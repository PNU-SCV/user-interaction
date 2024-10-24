from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi_mqtt.config import MQTTConfig
from fastapi_mqtt.fastmqtt import FastMQTT
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
import time
import asyncio
from websocket_manager import WebSocketManager, CHANEL_ROBOT
from models import Delivery, Point, robot_tasks, map_dict, robots_dict, schedule_dict, CommandGO, CommandStop, IDLE, MOVE, NEXT, WAIT, PAUSE
from utils import convert_point_to_list, convert_real_pos_to_virtual, convert_virtual_to_real_pos, find_msg_by_idx
#FOR CMD
#mosquitto -c "C:\Program Files\mosquitto\mosquitto.conf" -d -v
# pip install uvicorn[standard]
# uvicorn main:app --reload --host 0.0.0.0 --port 8000

# MQTT 기본 설정으로 초기화
# fast_mqtt = FastMQTT(config=MQTTConfig(host="192.168.0.5"))
fast_mqtt = FastMQTT(config=MQTTConfig())

websocket_manager = WebSocketManager()

MESSAGE_NULL = "ASD"
# FastAPI 앱의 생명주기 관리. MQTT 클라이언트 시작하고 종료 처리
@asynccontextmanager
async def _lifespan(_app: FastAPI):
    # asyncio.create_task(websocket_manager.process_messages())
    await fast_mqtt.mqtt_startup()

    yield
    await fast_mqtt.mqtt_shutdown()

# FastAPI 앱 인스턴스 생성, 생명주기 함수 등록
app = FastAPI(lifespan=_lifespan)
app.mount("/static", StaticFiles(directory="../dist/static"), name="static")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def gui():
    return FileResponse("../dist/index.html", media_type="text/html")

@app.get("/robots/{map_name}")
async def get_robots_by_map(map_name):
    resp = {
        "rects": [],
        "robots": []
    }

    if map_dict.get(map_name):
        map_state = map_dict[map_name]
        resp["rects"] = map_state.get_rects()
        resp["robots"] = [robots_dict[robot_id].to_dto() for robot_id in map_state.get_robot_ids() ]
    return resp

@app.get("/schedule/{robot_id}")
async def get_robot_schedule(robot_id):
    resp = {
        "schedules": []
    }
    if schedule_dict.get(robot_id):
        resp["schedules"] = schedule_dict[robot_id]
    return resp

"""
Web Socket
"""

async def move(robotId, dests, cancel_if_unconfirmed, dest_msgs, wait_time=10):
    global robots_dict, schedule_dict, robot_tasks

    path = "/mqtt/" + robotId + "/forward"
    print('move', robotId, dests, wait_time, cancel_if_unconfirmed, dest_msgs)
    if robotId not in robots_dict:
        # print("로봇 못찾음")
        return;

    await websocket_manager.broadcast(f"{robotId}가 이동을 시작합니다!;{json.dumps(dests)}", robotId);

    v_x = 0
    v_y = 0
    for idx, dest in enumerate(dests):
        v_x = dest["x"]
        v_y = dest["y"]
        dest_x, dest_y = list(map(convert_virtual_to_real_pos, map(float, [v_x, v_y])))
        # print('converted', dest_x, dest_y)
        # 먼저 pick 지점으로 명령 전송
        fast_mqtt.publish(path, {"command": 1, "coord": f"{dest_x},{dest_y}"})
        # print(f"{robotId}가 {v_x},{v_y} 지점으로 이동 중")

        robot = robots_dict.get(robotId)
        robot.set_state(MOVE)

        cnt = 0
        # 로봇이 pick 지점에 도착할 때까지 기다림
        while True:
            robot = robots_dict.get(robotId)
            robot_state = robot.get_state()
            # robot_x, robot_y = convert_point_to_list(robot.get_pos())
            if robot_state == WAIT:
                # robot_x == v_x and robot_y == v_y:
                # print(f"로봇 {robotId}가 {v_x},{v_y} 지점에 도착")
                break

            await asyncio.sleep(1)
            cnt += 1
            # if cnt >= 60 * 10:
            if cnt >= 60 * wait_time:
                # print(f"{robotId} 이동시간 {wait_time}분이 넘어서 종료")
                fast_mqtt.publish(path, {"command": 0, "coord": f"{dest_x},{dest_y}"})
                robot.set_state(IDLE)
                return

        if idx + 1 == len(dests):
            await websocket_manager.broadcast(f"{robotId},ASD,6,{v_x},{v_y},{10}", CHANEL_ROBOT)
            await websocket_manager.broadcast(f"{robotId}가 최종 목적지에 도착했습니다!", robotId)
            break
        else:
            dest_msg = find_msg_by_idx(dest_msgs, idx)
            await websocket_manager.broadcast(f"{robotId},{dest_msg},5,{v_x},{v_y},{wait_time * 60}", CHANEL_ROBOT)
            await websocket_manager.broadcast(f"{robotId}가 {idx + 1}번째목적지에 도착했습니다!", robotId);

        # !!!!
        schedules = schedule_dict[robotId]
        current = schedules[0]
        curr_dests = current["dest"]
        if len(curr_dests) > 1:
            # print('tq', current["dest"])
            current["dest"].pop(0)
            # print('tq2', current["dest"])
        for key, value in map_dict.items():
            map_state = value
            dests = list(map(lambda item: item.get('dest'), schedule_dict[robotId]))
            if robotId in map_state.get_robot_ids():
                await websocket_manager.broadcast(f"{robotId};{json.dumps(dests)}", key)
                break

        cnt = 0
        while True:
            if cnt >= 60 * wait_time:
                # if cnt >= 1 * wait_time:
                # print(f"{robotId} 대기시간 {wait_time}분이 넘어서 종료")

                if cancel_if_unconfirmed:
                    fast_mqtt.publish(path, {"command": 0, "coord": f"{dest_x},{dest_y}"})
                    robot.set_state(IDLE)
                    await websocket_manager.broadcast(f"{robotId}가 {wait_time}분 동안 확인을 받지 못해 이동을 취소합니다.", robotId);
                    schedule_dict[robotId].pop(0)
                    for key, value in map_dict.items():
                        map_state = value
                        if robotId in map_state.get_robot_ids():
                            dests = list(map(lambda item: item.get('dest'), schedule_dict[robotId]))
                            await websocket_manager.broadcast(f"{robotId};{json.dumps(dests)}", key)
                            break
                    return
                robot = robots_dict[robotId]
                robot_pos = robot.get_pos().to_coord_str()
                # print(f"대기시간 {wait_time}이 넘어서 다음 목적지로 이동")
                await websocket_manager.broadcast(f"{robotId},ASD,5,{robot_pos},-1", CHANEL_ROBOT)
                await websocket_manager.broadcast(f"{robotId}가 {wait_time}분 동안 확인을 받지 못했지만 다음 목적지로 이동합니다..", robotId)
                robot.set_state(NEXT)

            robot = robots_dict.get(robotId)
            robot_state = robot.get_state()

            if robot_state == NEXT:
                # print(f"{robotId} 다음 장소로 이동")
                dest_msg = find_msg_by_idx(dest_msgs, idx)
                if dest_msg == "ASD":
                    await websocket_manager.broadcast(f"{robotId}가 목적지 도착을 확인받고 다음 목적지로 이동을 시작합니다!", robotId)
                else:
                    await websocket_manager.broadcast(f"{robotId}가 \"{dest_msg}\"을(를) 확인받고 다음 목적지로 이동을 시작합니다!", robotId)
                break
            cnt += 1
            await asyncio.sleep(1)
    else:
        await websocket_manager.broadcast(f"{robotId},ASD,6,{v_x},{v_y},10", CHANEL_ROBOT)
    print(robotId + "태스크 완료", schedule_dict[robotId].pop(0))
    for key, value in map_dict.items():
        map_state = value
        if robotId in map_state.get_robot_ids():
            dests = list(map(lambda item: item.get('dest'), schedule_dict[robotId]))
            await websocket_manager.broadcast(f"{robotId};{json.dumps(dests)}", key)
            break

    robot.set_state(IDLE)
    del robot_tasks[robotId]
    if schedule_dict[robotId]:
        latest = schedule_dict[robotId][0]
        next_dests = latest["dest"]
        next_wait_time = latest["waitTime"]
        next_cancel_if_unconfirmed = latest["cancel"]
        next_dest_msgs = latest["msg"]
        task = asyncio.create_task(move(robotId, next_dests, next_cancel_if_unconfirmed, next_dest_msgs, next_wait_time))
        robot_tasks[robotId] = task

@app.websocket("/real-time-state")
async def websocket_endpoint(websocket: WebSocket):
    global robot_tasks, schedule_dict, map_dict
    await websocket_manager.connect(websocket, "robot")
    try:
        while True:
            data = await websocket.receive_text()
            data_json = json.loads(data)
            command = data_json["command"]
            target = data_json["target"]

            if command == 1:
                # 현재 task 수행중
                schedule_dict[target].append(data_json)
                await websocket_manager.broadcast(f"{target}에게 작업 할당이 완료되었습니다!", target)
                for key, value in map_dict.items():
                    map_state = value
                    if target in map_state.get_robot_ids():
                        dests = list(map(lambda item: item.get('dest'), schedule_dict[target]))
                        await websocket_manager.broadcast(f"{target};{json.dumps(dests)}", key)
                        break
                if target in robot_tasks:
                    continue
                dests = data_json["dest"]
                wait_time = data_json["waitTime"]
                cancel_if_unconfirmed = data_json["cancel"]
                dest_msgs = data_json["msg"]
                task = asyncio.create_task(move(target, dests, cancel_if_unconfirmed, dest_msgs, wait_time))
                robot_tasks[target] = task
            elif command == 0:
                if target in robot_tasks:
                    robot_tasks[target].cancel()  # 현재 실행 중인 작업 취소
                    del robot_tasks[target]
                path = "/mqtt/" + target + "/forward";
                command = {"command": 0, "coord": "0,0"}
                fast_mqtt.publish(path, command)
                schedules = schedule_dict[target]
                if len(schedules) > 1:
                    schedule_dict[target] = schedule_dict[target][1:0]
                for key, value in map_dict.items():
                    map_state = value
                    if target in map_state.get_robot_ids():
                        dests = list(map(lambda item: item.get('dest'), schedule_dict[target]))
                        # await websocket_manager.broadcast(f"{target};{json.dumps(list(map(lambda item: item.get('dest'), schedule)))}", key)
                        await websocket_manager.broadcast(f"{target};{json.dumps(dests)}", key)
                        break
                await websocket_manager.broadcast(f"{target}가 이동을 취소했습니다!", target);
            elif command == 2:
                print(2)
                if target in robot_tasks:
                    robot_tasks[target].cancel()  # 현재 실행 중인 작업 취소
                    del robot_tasks[target]
                    path = "/mqtt/" + target + "/forward";
                    command = {"command": 0, "coord": "0,0"}
                    fast_mqtt.publish(path, command)
                    await websocket_manager.broadcast(f"{target}가 이동을 정지했습니다!", target)
            elif command == 3:
                if target in robot_tasks:
                    if len(schedule_dict[target]) > 0:
                        latest = schedule_dict[target][0]
                        dests = latest["dest"]
                        wait_time = latest["waitTime"]
                        cancel_if_unconfirmed = latest["cancel"]
                        dest_msgs = latest["msg"]
                        task = asyncio.create_task(move(target, dests, wait_time, cancel_if_unconfirmed, dest_msgs))
                        robot_tasks[target] = task

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, "robot")

@app.websocket("/user-notification/{robot_id}")
async def user_notifications(websocket: WebSocket, robot_id: str):
    global robots_dict, schedule_dict
    await websocket_manager.connect(websocket, robot_id)
    # print(websocket_manager.get_active_connections_cnt(robot_id))
    await websocket_manager.broadcast(f"{robot_id}${websocket_manager.get_active_connections_cnt(robot_id)}", robot_id)

    try:
        if robots_dict.get(robot_id):
            if robots_dict[robot_id].get_state() == WAIT:
                msg = schedule_dict[robot_id][0]["msg"]
                await websocket_manager.broadcast(f"{json.dumps(msg)}", robot_id);
        while True:
            data = await websocket.receive_text()

    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, robot_id)

@app.websocket("/tasks/{place_name}")
async def robot_tasks_in_a_place(websocket: WebSocket, place_name: str):
    global map_dict
    await websocket_manager.connect(websocket, place_name)
    cnt = websocket_manager.get_active_connections_cnt(place_name)
    # print(place_name, cnt)
    await websocket_manager.broadcast(f"{place_name}${cnt}", place_name)

    try:
        for key, value in map_dict.items():
            if key == place_name:
                map_state = value
                dest_map = {}
                for robot_id in map_state.get_robot_ids():
                    dests = list(map(lambda item: item.get('dest'), schedule_dict[robot_id]))
                    dest_map[robot_id] = dests
                await websocket.send_text(f"@{json.dumps(dest_map)}")
                break
        # await websocket_manager.broadcast(f"${websocket_manager.get_active_connections_cnt(place_name)}", place_name)

        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, place_name)

"""
MQTT
"""
@fast_mqtt.on_connect()
def connect(client, flags, rc, properties):
    for robot_id in robots_dict:
        receive_from_robot = "/mqtt/" + robot_id + "/backward"
        fast_mqtt.client.subscribe(receive_from_robot)
    # fast_mqtt.client.subscribe("/mqtt/scv1/backward")

last_broadcast_time = 0
broadcast_interval = 1

#0이 이동 5
@fast_mqtt.on_message()
async def message(client, topic, payload, qos, properties):
    global last_broadcast_time, robots_dict, robot_tasks
    current_time = time.time()

    pl = json.loads(payload.decode())
    robotId = pl["id"]
    status = pl["status"]
    x = pl["loc_x"]
    y = pl["loc_z"]

    # print(robotId, status,x, y)

    # if robotId in robot_tasks:
    pos_x, pos_y = list(map(convert_real_pos_to_virtual, map(float, [x, y])))
    # print(pos_x, pos_y)
    robot = robots_dict[robotId]

    if status == 5:
        if robot.get_state() == MOVE:
            robot.set_state(WAIT)

    robot.set_pos(Point(pos_x, pos_y))

    if not robot.get_state() == WAIT:
        if current_time - last_broadcast_time >= broadcast_interval:
            await websocket_manager.broadcast(f"{robotId},ASD,{status},{pos_x},{pos_y},0", CHANEL_ROBOT)
            last_broadcast_time = current_time

    return 0

@app.post("/next")
async def move_next(commandNext: CommandStop):
    global robots_dict

    id = commandNext.robotId

    if id in robots_dict:
        robot = robots_dict[id]
        if robot.get_state() == WAIT:
            robot.set_state(NEXT)
            await websocket_manager.broadcast(f"{id},ASD,7,0,0,0", CHANEL_ROBOT)

    return "ok"
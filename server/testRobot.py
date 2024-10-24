import paho.mqtt.client as mqtt
import json
import time

myId = "scv1"
cur_x = 6.800000000000001
cur_y = 3.6

# 콜백 함수 정의
def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    # client.subscribe("/mqtt")
    client.subscribe("/mqtt/" + myId + "/forward")

def on_message(client, userdata, msg):
    global cur_x, cur_y
    received_msg = msg.payload.decode()
    # print(f"서버에서 메세지 '{received_msg}' on topic '{msg.topic}' with QoS {msg.qos}")
    print(f"서버에서 메세지 '{received_msg}' on topic '{msg.topic}'")
    msg_json = json.loads(received_msg)
    command = msg_json["command"]
    coord = msg_json["coord"]

    if command == 1:
        x, y = list(map(lambda x: round(float(x)), coord.split(',')))

        cur_x = abs(x - cur_x) / 2
        time.sleep(2)
        pl = json.dumps({"id": myId, "status": 1, "loc_x": cur_x, "loc_z": cur_y })
        client.publish("/mqtt/" + myId + "/backward", pl)
        print(pl)

        cur_x = x
        time.sleep(2)
        pl = json.dumps({"id": myId, "status": 1, "loc_x": cur_x, "loc_z": cur_y })
        client.publish("/mqtt/" + myId + "/backward", pl)
        print(pl)

        cur_y = abs(y - cur_y) / 2
        time.sleep(2)
        pl = json.dumps({"id": myId, "status": 1, "loc_x": cur_x, "loc_z": cur_y })
        client.publish("/mqtt/" + myId + "/backward", pl)
        print(pl)

        cur_y = y
        time.sleep(2)
        pl = json.dumps({"id": myId, "status": 5, "loc_x": cur_x, "loc_z": cur_y })
        client.publish("/mqtt/" + myId + "/backward", pl)
        print(pl)

# MQTT 클라이언트 인스턴스 생성
client = mqtt.Client()

# 콜백 설정
client.on_connect = on_connect
client.on_message = on_message

# 브로커에 연결
# client.connect("192.168.0.6", 1883, 60)
client.connect("localhost", 1883, 60)
# client.publish("/mqtt", "0,1,1")

# 네트워크 이벤트 루프 시작
client.loop_forever()
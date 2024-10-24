from pydantic import BaseModel

# ROBOT STATE
IDLE = "idle"
MOVE = "moving"
WAIT = "Waiting"
NEXT = "Next"
PAUSE = "Pause"

class CommandGO(BaseModel):
    robotId: str
    dest: str

class CommandStop(BaseModel):
    robotId: str

class Delivery(BaseModel):
    robotId: str
    item: str
    pick: str
    dest: str

    def get_id(self):
        return self.robotId

    def get_item(self):
        return self.item

    def get_pick(self):
        return self.pick

    def get_dest(self):
        return self.dest

    def destruct(self):
        return [self.robotId, self.item, self.pick, self.dest]

    def to_string(self):
        return f"{self.robotId} {self.item}, {self.pick}, {self.dest}"


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def get_x(self):
        return self.x

    def get_y(self):
        return self.y

    def set_x(self, x):
        self.x = x

    def set_y(self, y):
        self.y = y

    def to_coord_str(self):
        return f"{self.x},{self.y}"


class Rect:
    def __init__(self, p1, p2):
        self.p1 = p1
        self.p2 = p2


class MapState:
    def __init__(self, rects, robot_ids):
        self.map_rects = rects
        self.robot_ids = robot_ids

    def get_rects(self):
        return self.map_rects

    def get_robot_ids(self):
        return self.robot_ids


class Schedule:
    def __init__(self, who, start, end, time, task):
        self.who = who
        self.start = start
        self.end = end
        self.time = time
        self.task = task

    def get_length(self):
        return self.end - self.start

    def get_time(self):
        return self.time

    def to_dto(self):
        return {
            "who": self.who,
            "start": self.start,
            "end": self.end,
            "time": self.time,
            "task": self.task
        }

class RobotState:
    def __init__(self, id, curr_pos, label, curr_state):
        self.id = id
        self.pos = curr_pos
        self.label = label
        self.state = curr_state

    def get_id(self):
        return self.id

    def get_pos(self):
        return self.pos

    def get_state(self):
        return self.state

    def set_pos(self, pos):
        self.pos = pos

    def set_pos_x(self, x):
        self.pos.set_x(x)

    def set_pos_y(self, y):
        self.pos.set_y(y)

    def set_state(self, state):
        self.state = state

    def to_dto(self):
        return {
            "id": self.id,
            "pos": self.pos,
            "label": self.label,
            "state": self.state,
            # "schedules": [schedule.to_dto() for schedule in schedule_dict[self.id] if schedule in schedule_dict else ],
            # "schedules": [schedule.to_dto() for schedule in schedule_dict[self.id]],
            "schedules": schedule_dict[self.id] if schedule_dict.get(self.id) else [],
        }


test_map_name = "PLACE_TEST"
test_map_name2 = "201"
# test_map_name3 = 'siyeon'
map_dict = dict()
robots_dict = dict()
schedule_dict = dict()
robot_tasks = dict()

# scv1 = RobotState("scv1", Point(24, 0), "1번 로봇")
scv1 = RobotState("scv1", Point(0, 4), "1번 로봇", IDLE)
# scv2 = RobotState("scv2", Point(25, 25), "2번 로봇", IDLE)
scv3 = RobotState("scv3", Point(3, 3), "3번 로봇", IDLE)
# siyeon_scv1 = RobotState("sy1", Point(0, 4), "시연 로봇 1", IDLE)

# test_rect1 = Rect(Point(23, 0), Point(28, 50))
# test_rect2 = Rect(Point(8, 18), Point(23, 33))
# test_map = MapState([test_rect1, test_rect2], ["scv1", "scv2"])

test_rect3 = Rect(Point(1,1), Point(49, 15))
test_rect4 = Rect(Point(1, 2), Point(15, 49))
test_rect5 = Rect(Point(35, 15), Point(49, 49))
test_rect6 = Rect(Point(15, 35), Point(35, 49))
test_map2 = MapState([test_rect3, test_rect4, test_rect5, test_rect6], ["scv3"])

siyeon_rect1 = Rect(Point(2, 0), Point(8,2))
siyeon_rect2 = Rect(Point(4,3), Point(5,3))
siyeon_rect3 = Rect(Point(0,4), Point(8,5))
siyeon_rect4 = Rect(Point(6,6), Point(6,8))

test_map = MapState([siyeon_rect1, siyeon_rect2, siyeon_rect3, siyeon_rect4], ["scv1"])


# schedule1_1 = Schedule("tae", 0, 10, 'Morning', '배달하기')
# schedule1_2 = Schedule('heon', 45, 47, 'Morning', '배달하기')
# schedule1_3 = Schedule('seok', 13, 23, 'Afternoon', '짜장면 먹기')
# schedule1_4 = Schedule('won', 42, 47, 'Afternoon', '짬뽕 먹기')
# schedule1_5 = Schedule('jae', 13, 26, 'Night', '순찰돌기')

# schedule2_1 = Schedule('an', 20, 40, 'Morning', '순찰돌기')
# schedule2_2 = Schedule('jae', 30, 37, 'Afternoon', '배달하기')
# schedule2_3 = Schedule('han', 40, 46, 'Night', '배달하기')

# schedule3_1 = Schedule('heon', 0, 10, 'Morning', '배달하기')
# schedule3_2 = Schedule('won', 45, 47, 'Morning', '순찰돌기')

# schedule4 = Schedule('jae', 0, 10, 'Morning', '배달하기')

map_dict[test_map_name] = test_map
map_dict[test_map_name2] = test_map2
# map_dict[test_map_name3] = test_map3

robots_dict["scv1"] = scv1
# robots_dict["scv2"] = scv2
robots_dict["scv3"] = scv3
# robots_dict["siyeon"] = siyeon_scv1

schedule_dict["scv1"] = []
schedule_dict["scv3"] = []
# schedule_dict["scv2"] = [schedule2_1, schedule2_2, schedule2_3]
# schedule_dict["scv3"] = [schedule3_1, schedule3_2]
# schedule_dict["siyeon"] = [schedule4]


from models import Point

def convert_virtual_to_real_pos(pos_num):
    return pos_num * 0.8 + 0.4
    # return pos_num

def convert_real_pos_to_virtual(pos_num):
    return int((pos_num) / 0.8)


def convert_point_to_list(point:Point):
    return [point.get_x(), point.get_y()]

def find_msg_by_idx(dest_msgs, idx):
    try:
        return dest_msgs[idx]
    except IndexError:
        return "ASD"
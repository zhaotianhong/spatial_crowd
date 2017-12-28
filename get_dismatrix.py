# encoding: utf-8
# file: get_dismatrix.py
# author: zhaotianhong
# time: 2017/12/18 21:18

'''
通过高德地图API获取任务点之间的距离和可视化节点
'''

import requests
import pandas as pd
import random

TASKS = {1: [113.93694, 22.533868450412825, 200, 260, 8], 2: [113.94619898551942, 22.51389891454255, 250, 310, 5],
         3: [113.8753509520999, 22.577717970860856, 260, 320]}


def request_dis(start, dest):
    '''
    调用高德的接口，返回距离和画线边的信息，每天调用次数只有2000次
    :param start: 开始点坐标经纬度，以逗号隔开：'113.93694, 22.53386'
    :param dest: 目的地坐标经纬度
    :return: 两点之间的距离以及详细的道路节点
    '''
    # 不同的路径规划方式：步行，驾车
    KEYS = ['dfb29682d166b9f1cc96eac05d39b53b',
            'ad51ff9223a78e1c5ba930e94341ad03',
            'f2d13bf197cce2f48b2616a41a34faf8',
            'f7ce9c42c10ff75e38f3b8ccd6ab1f9d',
            '946a317c917d70ca56a48cb1a4787163']
    # 随机选取key增加访问次数
    key = KEYS[random.randint(0, 4)]
    print(key)
    walk = r'http://restapi.amap.com/v3/direction/walking?key=' + key + '&origin=' + start + '&destination=' + dest
    dive = r'http://restapi.amap.com/v3/direction/driving?key=' + key + '&origin=' + start + '&destination=' + dest
    try:
        content = requests.get(dive).json()
    except:
        print('can not get distance, see you tomorrow !')
        return None
    dis = int(content['route']['paths'][0]['distance'])
    plot = ''
    for step in content['route']['paths'][0]['steps']:
        line = step['polyline']
        plot += line + ';'
    return dis, plot[:-1]


def get_dismatrix(tasks):
    '''
    计算矩阵
    :param tasks:字典格式{id：[x,y,start_time,end_time,q]}
    :return:实际距离矩阵，画图矩阵
    '''
    plot_matrix = pd.DataFrame(index=tasks.keys(), columns=tasks.keys())
    dis_matrix = pd.DataFrame(index=tasks.keys(), columns=tasks.keys())
    for k1, v1 in tasks.items():
        for k2, v2 in tasks.items():
            if k1 == k2:  # 同一节点距离为0
                dis_matrix[k1][k2] = 0
                plot_matrix[k1][k2] = 0
            if dis_matrix[k2][k1] >= 0:
                break
            else:
                start = str(v1[0]) + ',' + str(v1[1])
                end = str(v2[0]) + ',' + str(v2[1])
                dis, plot = request_dis(start, end)
                dis_matrix[k1][k2] = dis
                plot_matrix[k1][k2] = plot
                dis_matrix[k2][k1] = dis
                plot_matrix[k2][k1] = plot
    return dis_matrix, plot_matrix


if __name__ == '__main__':
    dis_matrix, plot_matrix = get_dismatrix(TASKS)
    print(dis_matrix)

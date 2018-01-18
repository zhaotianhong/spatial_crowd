# encoding: utf-8
# file: initi_algorithm.py
# author: zhaotianhong
# time: 2017/12/18 21:23

import get_dismatrix as gm
import os
import time
import random
import pandas as pd
import numpy as np
from math import sqrt


def read_data(origin_path, matrix_path, plot_path,num):
    '''从计算机本地读取包含空间众包任务数据的txt文件，并格式化输出
    :param path: 文件路径
    :return: 字典{ID：[x,y,r,d,q]}，距离矩阵
    '''
    tasks_dic = {}

    # 读取任务表
    with open(origin_path, 'r') as fr:
        lines = fr.readlines()
        choose = list(random.sample(np.arange(len(lines)),num))
        for i in choose:
            line = lines[i]
            l = line[:-1].split('\t')
            # 数据结构：{id: [x,y,发布时间，截止时间，容量]}
            tasks_dic[l[0]] = [float(l[1]), float(l[2]), int(l[3]), int(l[4]) + 3600, int(l[5])]
    # 读取距离矩阵
    keys = list(tasks_dic.keys())
    dis_matrix = pd.read_csv(matrix_path, dtype=int, sep=',', index_col=0)
    dis_matrix.index = dis_matrix.columns
    # 读取画图矩阵
    plot_matrix = pd.read_csv(plot_path, dtype=str, sep=',', index_col=0)
    plot_matrix.index = plot_matrix.columns
    return tasks_dic, dis_matrix, plot_matrix

def get_random_tasks(num=93):
    script_dir = os.path.dirname(os.path.realpath(__file__))
    tasks_dic, dis_matrix, plot_matrix = read_data(script_dir + r'\data\90T.txt',
                                                   script_dir + r'\data\90Tdis.csv',
                                                   script_dir + r'\data\90Tplot.txt',num)
    randomTasks = []
    for k,v in tasks_dic.items():
        task = {'id':k,'x':v[0],'y':v[1],'time_a':timestamp_to_time(v[2]),'time_d':timestamp_to_time(v[3]),'volume':v[4]}
        randomTasks.append(task)
    Data = {'num':num,'randomTasks':randomTasks}
    return Data,tasks_dic, dis_matrix, plot_matrix


def timestamp_to_time(timestamp):
    # 时间戳转时间
    time_local = time.localtime(int(timestamp))
    dt = time.strftime("%Y-%m-%d %H:%M:%S", time_local)
    return str(dt)


def time_to_timestamp(time_str):
    # 时间装时间戳
    timeArray = time.strptime(time_str, "%Y-%m-%d %H:%M")
    timestamp = time.mktime(timeArray)
    return timestamp


def to_json(result, plot_matrix, type):
    '''
    把结果转化为json格式，并添加画图的每一个节点
    :param result: 每一步执行的任务
    :param plot_matrix: 画图每一步的矩阵
    :param type: 算法类型 -> 字符串格式
    :return:
    '''
    result_json = {}
    result_json['algorithm'] = type
    result_json['task_numbers'] = len(result)
    task_list = []
    for one_task in result:
        # 时间戳转换 -> 算法的得到的是时间戳，显示时间
        one_task['arrive'] = timestamp_to_time(one_task['arrive'])
        one_task['finish'] = timestamp_to_time(one_task['finish'])
        task_list.append(one_task['id'])
    result_json['tasks'] = result
    plot_list = []
    for i in range(len(task_list) - 1):
        step = {}
        step[i] = plot_matrix[task_list[i]][task_list[i + 1]]
        plot_list.append(step)
    result_json['plot'] = plot_list
    return result_json


class BasicAlgorithm():
    '''
    基本算法：距离临近算法，时间临近算法，时空临近算法，随机算法
    '''

    def __init__(self, atasks, adis_matrix, asearch_r, alpha, aworker_v, aplot_matrix):
        self.dis_matrix = adis_matrix
        self.tasks = atasks
        self.search_r = asearch_r
        self.time_a = alpha
        self.worker_v = aworker_v  # 单位m/s
        self.sp_dismatrix = self.get_sp_matrix()
        self.plot_matrix = aplot_matrix

    def get_sp_matrix(self):
        '''计算时空距离矩阵'''
        sp_matrix = pd.DataFrame(index=self.tasks.keys(), columns=self.tasks.keys())
        for k1, v1 in self.tasks.items():
            for k2, v2 in self.tasks.items():
                if k1 == k2:
                    sp_matrix[k1][k2] = 99999999
                if sp_matrix[k2][k1] >= 0:
                    break
                else:
                    dis = (self.dis_matrix[k1][k2]) / 1000  # 以km计算防止数据溢出
                    t_dis = (abs(v1[3] - v2[3]) * self.worker_v) / 1000
                    sp_dis = sqrt(t_dis * t_dis + dis * dis)
                    sp_matrix[k1][k2] = sp_dis
                    sp_matrix[k2][k1] = sp_dis
        return sp_matrix

    def get_first_task(self):
        ''' 获取第一个任务，最先发布的作为第一个任务
        :return: 任务id，时间，现在容量等 -> json'''
        do = []
        q = 50  # 任务量初始化为50
        first_t = min(self.tasks.items(), key=lambda x: x[1][2])
        do.append(
            {'id': first_t[0], 'lon': first_t[1][0], 'lat': first_t[1][1], 'arrive': first_t[1][2],
             'finish': first_t[1][2], 'q': q + first_t[1][-1]})
        return do

    def get_dynamic_set(self, do, time_r):
        '''获取动态任务集
        :param time_r: 时间搜索范围
        :param do: 执行任务集
        :return: 动态任务集'''
        dynamic_set = {}
        for key in self.tasks.keys():
            dis = self.dis_matrix[key][do[-1]['id']]
            # 满足动态约束和搜索半径约束
            if self.tasks[key][2] < time_r and self.tasks[key][3] > do[-1]['finish'] and dis <= self.search_r:
                dynamic_set[key] = self.tasks[key]
        for d in do:
            if d['id'] in dynamic_set:
                # 删除已经获取的任务`
                dynamic_set.pop(d['id'])
        return dynamic_set

    def get_can_set(self, dynamic_set, do):
        ''' 获取可行集合
        :param dynamic_set: 动态任务集合
        :param do: 执行集合
        :return: 可选任务状态
        '''
        # [距离（已经转化为相对时间），执行时间，容量，任务截止时间，时空距离]
        can = {}
        time_now = int(do[-1]['finish'])
        q = do[-1]['q']
        for j in dynamic_set:
            dis = self.dis_matrix[j][do[-1]['id']]
            sp_dis = self.sp_dismatrix[j][do[-1]['id']]
            time_now += (dis / self.worker_v)
            if time_now <= self.tasks[j][3] and q < 100 and q > 0:
                if time_now < self.tasks[j][2]:
                    can[j] = [dis, self.tasks[j][3], sp_dis, time_now, self.tasks[j][2], q]
                else:
                    can[j] = [dis, self.tasks[j][3], sp_dis, time_now, time_now, q]
            time_now -= (dis / self.worker_v)
            q -= self.tasks[j][-1]
        return can

    def run_ba(self, type):
        '''
        基本算法入口
        :param type: 选用什么算法：SH:空间原则；TH:时间原则；STH;时空原则；RH随机原则
        :return: 执行任务序列
        '''
        if type == 'SH' or type == 'TH' or type == 'STH' or type == 'RH':
            do = self.get_first_task()
            time_max = max(self.tasks.items(), key=lambda x: x[1][3])[1][3]  # 最大发布时间
            time_r = do[-1]['finish'] + self.time_a
            for i in range(len(self.tasks)):
                dynamic_set = self.get_dynamic_set(do, time_r)
                can_set = self.get_can_set(dynamic_set, do)
                if len(can_set) > 0:
                    if type == 'SH':
                        num = min(can_set, key=lambda x: can_set[x][0])
                    if type == 'TH':
                        num = min(can_set, key=lambda x: can_set[x][1])
                    if type == 'STH':
                        num = min(can_set, key=lambda x: can_set[x][2])
                    if type == 'RH':
                        list_c = list(can_set)
                        num = random.choice(list_c)
                    do.append(
                        {'id': num, 'lon': self.tasks[num][0], 'lat': self.tasks[num][1], 'arrive': can_set[num][3],
                         'finish': can_set[num][4], 'q': can_set[num][5]})
                    time_r = do[-1]['finish'] + self.time_a
                else:
                    time_r += self.time_a
                if do[-1]['finish'] > time_max:
                    break
            return to_json(do, self.plot_matrix, type)
        else:
            print'Without this strategy'
            return None


if __name__ == '__main__':
    # script_dir = os.path.dirname(os.path.realpath(__file__))
    # tasks_dic, dis_matrix, plot_matrix = read_data(script_dir + r'\data\90T.txt',
    #                                                   script_dir + r'\data\90Tdis.csv',
    #                                                   script_dir + r'\data\90Tplot.txt')
    # ba = BasicAlgorithm(atasks=tasks_dic, adis_matrix=dis_matrix, alpha=7000, asearch_r=10000, aworker_v=10,
    #                     aplot_matrix=plot_matrix)  # 每秒的速度
    # ba_result = ba.run_ba('SH')
    # print ba_result
    aa = get_random_tasks(20)

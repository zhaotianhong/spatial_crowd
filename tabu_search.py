# encoding: utf-8
# file: tuba_search.py
# author: zhaotianhong
# time: 2017/12/19 21:25

import initi_algorithm as bs
import pandas as pd
import numpy as np
import random
import os


class Tabu(bs.BasicAlgorithm):
    '''禁忌搜索算法类，继承于基本算法'''

    def __init__(self, atasks, adis_matrix, asearch_r, alpha, aworker_v, aplot_matrix):
        self.dis_matrix = adis_matrix
        self.tasks = atasks
        self.search_r = asearch_r
        self.time_a = alpha
        self.worker_v = aworker_v  # 单位m/s
        self.sp_dismatrix = self.get_sp_matrix()
        self.plot_matrix = aplot_matrix
        self.tabu_lenth = 5

    def get_score(self, path):
        '''
        评价函数，给每条规划的路径打分
        :param path: 规划的路径
        :return: 得分
        '''
        k = 1000  # 数量参数
        punish = 0
        for task in path:
            if task['finish'] > self.tasks[task['id']][3] or task['q'] > 100 or task['q'] < 0:
                punish = 99999999
        time_interval = path[-1]['finish'] - path[0]['finish']
        score = punish + time_interval + (1 / (len(path))) * time_interval * k  # 得分较小的者优
        return score

    def get_point(self, path, tabuTab):
        '''
        选择禁忌对象
        :param path: 初始化路径
        :param tabuTab: 禁忌表
        :return: 在初始化路径中选择不再禁忌表中的禁忌对象
        '''
        for i in range(20):
            point = np.random.choice(path)
            if not point in tabuTab:
                break
        return point

    def updata_tabu(self, tab, num, lenth):
        '''
        更新禁忌表
        :param tab: 禁忌表
        :param num: 禁忌对象
        :param lenth: 禁忌长度
        '''
        if num in tab:
            pass
        else:
            tab.append(num)
            if len(tab) > lenth:
                re_obj = tab[0]
                tab.remove(re_obj)
        return tab

    def get_neighbor(self, path, dynamic_list, tabu_tab):
        '''
        邻域变换
        :param path: 初始化路径
        :param dynamic_list: 动态区间内的任务
        :param tabu_tab:禁忌表
        :return:新的路径，禁忌对象
        '''
        path_id = [i['id'] for i in path]
        path_out = [item for item in dynamic_list if item not in path_id]
        p = self.get_point(path_id[1:], tabu_tab)
        point = path_id.index(p)
        rule = np.random.randint(1, 4)  # 用哪一种邻域交换规则
        # 如果动态区间内所有任务都已经规划，只能内部互换
        if len(path_out) == 0:
            rule = 2

        if rule == 1:  # 插入
            insert_id = random.choice(path_out)
            path_id.insert(point, insert_id)

        if rule == 2:  # 内部交换
            point1 = path_id.index(random.choice(path_id[1:]))
            path_id[point], path_id[point1] = path_id[point1], path_id[point]

        if rule == 3:  # 内外交换
            change_id = random.choice(path_out)
            path_id[point] = change_id

        temp_path = [path[0]]
        # 更新执行时间
        for i in path_id[1:]:
            t = (self.dis_matrix[i][temp_path[-1]['id']] / self.worker_v)
            arrive = temp_path[-1]['finish'] + t
            if arrive >= self.tasks[i][2]:
                temp_path.append(
                    {'id': i, 'lon': self.tasks[i][0], 'lat': self.tasks[i][1], 'arrive': arrive, 'finish': arrive,
                     'q': temp_path[-1]['q'] + self.tasks[i][-1]})
            else:
                temp_path.append(
                    {'id': i, 'lon': self.tasks[i][0], 'lat': self.tasks[i][1], 'arrive': arrive,
                     'finish': self.tasks[i][2], 'q': temp_path[-1]['q'] + self.tasks[i][-1]})
        return temp_path, p

    def init_tabu(self, do):
        '''
        初始化路径
        :param do: 之前已经规划的路径
        :return: 初始化路径，动态区间内的任务
        '''
        init_list = []
        init_list.append(do[-1])
        dynamic_set = self.get_dynamic_set(do, do[-1]['finish'] + self.time_a)
        dynamic_list = list(dynamic_set.keys())
        dynamic_list.insert(0, do[-1]['id'])
        # 动态时空距离矩阵
        dynamic_sp_dismatrix = self.sp_dismatrix[dynamic_list].ix[dynamic_list]
        # 用矩阵寻找时空距离最短的路径
        for i in dynamic_list:
            i = init_list[-1]['id']
            sort_task = (dynamic_sp_dismatrix[i]).sort_values()
            for min_task in sort_task.items():
                time_add = self.dis_matrix[i][min_task[0]] / self.worker_v
                arrive = init_list[-1]['finish'] + time_add
                if time_add == 0:  # 循环到自己本身
                    return init_list, dynamic_list
                if arrive <= self.tasks[min_task[0]][3]:
                    if arrive >= self.tasks[min_task[0]][2]:
                        init_list.append(
                            {'id': min_task[0], 'lon': self.tasks[min_task[0]][0], 'lat': self.tasks[min_task[0]][1],
                             'arrive': arrive, 'finish': arrive, 'q': init_list[-1]['q'] + self.tasks[min_task[0]][-1]})
                    else:
                        init_list.append(
                            {'id': min_task[0], 'lon': self.tasks[min_task[0]][0], 'lat': self.tasks[min_task[0]][1],
                             'arrive': arrive, 'finish': self.tasks[min_task[0]][2],
                             'q': init_list[-1]['q'] + self.tasks[min_task[0]][-1]})
                    # 防止回路
                    dynamic_sp_dismatrix[i][min_task[0]] = 99999999
                    dynamic_sp_dismatrix[min_task[0]][i] = 99999999
                    break
        return init_list, dynamic_list

    def one_interval(self, do):
        '''
        一个动态区间内优化结果
        :param do: 已经规划的任务
        :return: 该动态区间内的任务序列
        '''
        local_path_score = 99999999
        init_path, dynamic_list = self.init_tabu(do)
        if len(init_path) == 1:  # 若初始化没有任务直接返回空任务
            return []
        best_path_score = self.get_score(init_path)  # 计算初始解得分，作为当前最优得分
        best_path = init_path  # 记录初始解路径，作为最优路径
        tabu_tab = []  # 禁忌表（一维）
        local_path = []  # 局部最优路径

        for i in range(50):  # 迭代次数
            for j in range(20):  # 求邻域解
                temp_path, p = self.get_neighbor(init_path, dynamic_list, tabu_tab)
                temp_path_score = self.get_score(temp_path)
                # 核心就是要把禁忌表“活”起来，所以引入了localPath，只要有进步的点都作为禁忌对象
                # 如果直接用best比较，造成禁忌表没有几个元素，搜索空间很大
                if temp_path_score < local_path_score:
                    local_path = temp_path
                    local_path_score = temp_path_score
                    tabu_tab = self.updata_tabu(tabu_tab, p, 5)
            if local_path_score < best_path_score:
                best_path = local_path
                local_path_score = local_path_score
        return best_path

    def run_tabu(self):
        '''
        禁忌搜索算法入口，参数在类实例化的时候控制
        :return: 禁忌搜索结果
        '''
        time_max = max(self.tasks.items(), key=lambda x: x[1][3])[1][3]  # 最大发布时间
        first_task = self.get_first_task()
        do = [first_task[0]]
        while True:
            one_interval = self.one_interval(do)
            do.extend(one_interval[1:])
            if do[-1]['finish'] > time_max or len(one_interval) == 0:
                break
        return bs.to_json(do, self.plot_matrix, 'Tabu')


def get_result():
    '''
    前端接口
    :return: 返回所有算法的json格式的结果
    '''
    script_dir = os.path.dirname(os.path.realpath(__file__))
    tasks_dic, dis_matrix, plot_matrix = bs.read_data(script_dir + r'\data\90T.txt',
                                                      script_dir + r'\data\90Tdis.csv',
                                                      script_dir + r'\data\90Tplot.txt')
    TS = Tabu(atasks=tasks_dic, adis_matrix=dis_matrix, alpha=7000, asearch_r=10000, aworker_v=10,
              aplot_matrix=plot_matrix)  # 每秒的速度
    ts = TS.run_tabu()
    sth = TS.run_ba('STH')
    sh = TS.run_ba('SH')
    th = TS.run_ba('TH')
    r = TS.run_ba('RH')

    return {'Tabu': ts, 'STH': sth, 'SH': sh, 'TH': th, 'R': r}


if __name__ == '__main__':
    # 测试

    script_dir = os.path.dirname(os.path.realpath(__file__))
    tasks_dic, dis_matrix, plot_matrix = bs.read_data(script_dir + r'\data\90T.txt',
                                                      script_dir + r'\data\90Tdis.csv',
                                                      script_dir + r'\data\90Tplot.txt')
    TS = Tabu(atasks=tasks_dic, adis_matrix=dis_matrix, alpha=7000, asearch_r=10000, aworker_v=10,
              aplot_matrix=plot_matrix)  # 每秒的速度
    ts = TS.run_tabu()
    sth = TS.run_ba('STH')
    sh = TS.run_ba('SH')
    th = TS.run_ba('TH')
    r = TS.run_ba('RH')
    print ts['tasks'], sth['tasks'], sh['tasks'], th['tasks'], r['tasks']

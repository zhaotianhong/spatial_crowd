# encoding: utf-8
# file: get_dismatrix.py
# author: zhaotianhong
# time: 2017/12/18 21:18


from flask import Flask, render_template, jsonify,request
import tabu_search as ts
import initi_algorithm as ba
import json


app = Flask(__name__, static_url_path='')


@app.route('/')
def index():
    '''网站主页'''
    return render_template('index.html')


@app.route('/get_random_tasks/<num>/')
def return_random_tasks(num):
    '''
    响应前端请求的随机任务
    :param num: 任务数量
    :return:
    '''
    global dis_matrix, plot_matrix
    Data, tasks_dic, dis_matrix, plot_matrix = ba.get_random_tasks(int(num))
    return jsonify(Data)

@app.route('/back_data/', methods=['GET', 'POST'])
def js_call():
    '''
    接收任务和工人信息，并开始规划路径
    :return: 不同算法规划路径后的结果
    '''
    data = request.get_data()
    data = json.loads(data)
    tasks = data['taks']['features']
    global tasks_dic
    tasks_dic = {}
    for task in tasks:
        id = task['properties']['id']
        lon = task['geometry']['coordinates'][0]
        lat = task['geometry']['coordinates'][1]
        time_a = task['properties']['time_a']
        time_d = task['properties']['time_d']
        volume = task['properties']['volume']
        tasks_dic[id] = [float(lon), float(lat),ba.time_to_timestamp(time_a), ba.time_to_timestamp(time_d), int(volume)]
    result = ts.get_result(tasks_dic, dis_matrix, plot_matrix)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug = True)

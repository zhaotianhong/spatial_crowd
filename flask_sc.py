# encoding: utf-8
# file: get_dismatrix.py
# author: zhaotianhong
# time: 2017/12/18 21:18


from flask import Flask, render_template, jsonify
import tabu_search as ts
import initi_algorithm as ba

app = Flask(__name__, static_url_path='')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/result/')
def return_result():
    result = ts.get_result(tasks_dic, dis_matrix, plot_matrix)
    return jsonify(result)


@app.route('/get_random_tasks/<num>/')
def return_random_tasks(num):
    global  tasks_dic, dis_matrix, plot_matrix
    Data, tasks_dic, dis_matrix, plot_matrix = ba.get_random_tasks(int(num))
    return jsonify(Data)


if __name__ == '__main__':
    app.run(debug = True)

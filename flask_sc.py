# encoding: utf-8
# file: get_dismatrix.py
# author: zhaotianhong
# time: 2017/12/18 21:18


from flask import Flask, render_template, jsonify
import tabu_search as ts

app = Flask(__name__, static_url_path='')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/result/')
def return_result():
    result = ts.get_result()
    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True)

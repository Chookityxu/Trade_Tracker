from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests
import json
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)
@app.route('/search', methods=['POST', 'GET'])
def search():
    data = request.get_json()
    value = data['value']
    startdate = data['start']
    enddate = data['end']
    stat_year = startdate.split('-')[0]
    stat_month = startdate.split('-')[1]
    end_year = enddate.split('-')[0]
    end_month = enddate.split('-')[1]
    app = StockDataApp()
    app.start_year = stat_year
    app.start_month = stat_month
    app.end_year = end_year
    app.end_month = end_month
    code = value.split('_')[0]
    app.code = code  # 將股票代碼設為用戶輸入的值
    results = app.submit()
    return jsonify(results)

class StockDataApp:
    def __init__(self):
        self.start_year = 0
        self.start_month = 0
        self.end_year = 0
        self.end_month = 0
        self.code = 0

    def submit(self):
        data_list = []
        url ='https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date='
        data_points = []
        for year in range(int(self.start_year), int(self.end_year)+1):
            start_m = int(self.start_month) if year==int(self.start_year) else 1
            end_m = int(self.end_month) if year==int(self.end_year) else 12
            for month in range(start_m, end_m+1):
                month = str(month) if month>9 else '0'+str(month)
                date = str(year) + month + '01'
                r = requests.get(url+date+'&stockNo='+self.code)
                print(month, year)
                dataCheck = r.json()
                if 'stat' in dataCheck and dataCheck['stat'] == '很抱歉，沒有符合條件的資料!':
                        continue
                else:
                    data = r.json()
                    for row in data['data']:
                        year, month, day = row[0].split('/')
                        year = str(int(year) + 1911)
                        date = datetime.strptime(year + '/' + month + '/' + day, '%Y/%m/%d')
                        data_point = {
                            'date': date.strftime('%Y-%m-%d'),
                            'open': float(row[3]),
                            'high': float(row[4]),
                            'low': float(row[5]),
                            'close': float(row[6]),
                            'volume': float(row[1].replace(',', ''))
                        }
                        data_points.append(data_point)
                    title_parts = data['title'].split()
                    new_title = title_parts[1] + title_parts[2]
                    data_list=({
                        'title': new_title,
                        'data': data_points
                    })
        return json.dumps(data_list)

if __name__ == '__main__':
    app.run(debug=True)
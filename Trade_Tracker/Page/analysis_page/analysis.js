let chart; // 將chart變數定義在全局範圍內，以便在其他函數中訪問
const groupingUnits = [[ 'week', [1] ], [ 'month', [1, 2, 3, 4, 6] ]];
let data,StockData;
let chartType = 'candlestick';
async function loadAndRenderChart(chartType) {// 加載並渲染圖表
    console.log(chartType);
    const response = await fetch('../../assets/Json/0050.json');
    StockData = await response.json();
    data = StockData.data;
    let seriesData;
    let volumeData;
    let ma5Data;
    let ma10Data;
    let ma20Data;

    if (!chart) {
        createStockChart();
    }
    if (chartType === 'candlestick' || chartType === 'ohlc') {
        seriesData = data.map(item => [
            Date.parse(item.date),
            item.open,
            item.high,
            item.low,
            item.close
        ]);
    } else if (chartType === 'SingleLine') {
        seriesData = data.map(item => [
            Date.parse(item.date),
            item.close
        ]);
    }
    volumeData = data.map(item => [
        Date.parse(item.date),
        item.volume
    ]);
    
    if(chartType === 'candlestick' || chartType === 'ohlc'|| chartType === 'SingleLine'){
        chart.yAxis[0].update({
            title: { text: chartType === 'SingleLine' ? '股價' : 'OHLC' }
        });
        chart.series[0].update({
            type: chartType === 'SingleLine' ? 'line' : chartType,
            data: seriesData,
            lineColor: chartType === 'SingleLine' ? '#1947A3' : 'black',// 根據 chartType 設置顏色
            name: chartType === 'SingleLine' ? StockData.title+'股價' : StockData.title
        });
        chart.series[1].update({
            type: 'column',
            data: volumeData,
            name: '交易量'
        });
    }
};
function createStockChart() {// 創建股票圖表
    chart = Highcharts.stockChart('StockChart', {
        rangeSelector: { selected: 4 },
        title: { text: StockData.title},
        yAxis: [
            {
                labels: { align: 'left', x: 3 },
                height: '60%',
                lineWidth: 2,
                resize: { enabled: true },
                crosshair: {
                    snap: true, // yAxis 的 crosshair 配置
                    label: {
                        enabled: true,
                        format: '{value:,.0f}'
                    }
                }
            },
            {
                labels: { align: 'right', x: -3 },
                title: { text: '交易量' },
                top: '65%',
                height: '35%',
                offset: 0,
                lineWidth: 2,
                crosshair: {
                    snap: true, // yAxis 的 crosshair 配置
                    label: {
                        enabled: true,
                        format: '{value:,.0f}'
                    }
                }
            }
        ],
        tooltip: {
            split: true,
            crosshairs: false
        },
        xAxis: {
            crosshair: {
                snap: false, // yAxis 的 crosshair 配置
                label: {
                    enabled: true,
                    format: '{value: %Y-%m-%d}'
                }
            }
        },
        plotOptions: {
            series: {
                states: { hover: { enabled: false } },
                line: {
                    marker: { enabled: false },
                    lineWidth: 2,
                    opacity: 1,
                    states: { hover: { enabled: false } }
                }
            }
        },
        series: [
            {
                name: '股價',
                data: [],
                color: 'green',
                upColor: 'red',
                lineColor: 'black',
                dataGrouping: { units: groupingUnits }
            },
            {
                name: '交易量',
                data: [],
                yAxis: 1,
                dataGrouping: { units: groupingUnits },
                color: 'blue',
                negativeColor: 'red'
            },
        ]
    });
}
window.onload = async function() {
    await loadAndRenderChart('candlestick'); // 先加載數據
    createStockChart();
    ['candlestick', 'ohlc', 'SingleLine'].forEach(type => {
        const button = document.getElementById(type + 'Btn');
        button.addEventListener('click', () => loadAndRenderChart(type));
    });
};
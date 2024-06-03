let chart; // 將chart變數定義在全局範圍內，以便在其他函數中訪問
const groupingUnits = [
    ["week", [1]],
    ["month", [1, 2, 3, 4, 6]],
];
let data, StockData;
let chartType = "candlestick";
let names;
let filename;
let input = document.getElementById("search-input");
// 加載並渲染圖表
async function loadAndRenderChart(chartType) {
    // 加載並渲染圖表
    StockData = await loadStockData();
    data = StockData.data;
    let seriesData;
    let volumeData;

    if (!chart) {
        createStockChart();
    }
    if (chartType === "candlestick" || chartType === "ohlc") {
        //設置數據
        seriesData = data.map((item) => [
            Date.parse(item.date),
            item.open,
            item.high,
            item.low,
            item.close,
        ]);
    } else if (chartType === "SingleLine") {
        seriesData = data.map((item) => [Date.parse(item.date), item.close]);
    }

    volumeData = data.map((item) => [
        // 設置交易量數據
        Date.parse(item.date),
        item.volume,
    ]);
    if (
        chartType === "candlestick" ||
        chartType === "ohlc" ||
        chartType === "SingleLine"
    ) {
        // 設置均線數據
        chart.yAxis[0].update({
            title: { text: chartType === "SingleLine" ? "股價" : "OHLC" },
        });
        chart.series[0].update({
            type: chartType === "SingleLine" ? "line" : chartType,
            data: seriesData,
            lineColor: chartType === "SingleLine" ? "#1947A3" : "black", // 根據 chartType 設置顏色
            name:
                chartType === "SingleLine"
                    ? StockData.title + "股價"
                    : StockData.title,
        });
        chart.series[1].update({
            type: "column",
            data: volumeData,
            name: "交易量",
        });
    }
}
function loadStockData() {
    // 加載股票數據
    const fd = document.getElementById("search-input").value;
    fetch("http://127.0.0.1:5000/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: fd }),
    })
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
        initialize();
}
function createStockChart() {
    // 創建股票圖表
    chart = Highcharts.stockChart("StockChart", {
        rangeSelector: { selected: 4 },
        title: { text: StockData.title },
        yAxis: [
            {
                labels: { align: "left", x: 3 },
                height: "60%",
                lineWidth: 2,
                resize: { enabled: true },
                crosshair: {
                    snap: true, // yAxis 的 crosshair 配置
                    label: {
                        enabled: true,
                        format: "{value:,.0f}",
                    },
                },
            },
            {
                labels: { align: "right", x: -3 },
                title: { text: "交易量" },
                top: "65%",
                height: "35%",
                offset: 0,
                lineWidth: 2,
                crosshair: {
                    snap: true, // yAxis 的 crosshair 配置
                    label: {
                        enabled: true,
                        format: "{value:,.0f}",
                    },
                },
            },
        ],
        tooltip: {
            split: true,
            crosshairs: false,
        },
        xAxis: {
            crosshair: {
                snap: false, // yAxis 的 crosshair 配置
                label: {
                    enabled: true,
                    format: "{value: %Y-%m-%d}",
                },
            },
        },
        plotOptions: {
            series: {
                states: { hover: { enabled: false } },
                line: {
                    marker: { enabled: false },
                    lineWidth: 2,
                    opacity: 1,
                    states: { hover: { enabled: false } },
                },
            },
        },
        series: [
            {
                name: "股價",
                data: [],
                color: "green",
                upColor: "red",
                lineColor: "black",
                dataGrouping: { units: groupingUnits },
            },
            {
                name: "交易量",
                data: [],
                yAxis: 1,
                dataGrouping: { units: groupingUnits },
                color: "blue",
                negativeColor: "red",
            },
        ],
    });
}
async function initialize() {
    // 抓取資料
    await loadAndRenderChart("candlestick");
    createStockChart();
    ["candlestick", "ohlc", "SingleLine"].forEach((type) => {
        const button = document.getElementById(type + "Btn");
        button.addEventListener("click", () => loadAndRenderChart(type));
    });
}
// 搜索功能
function displayNames(value) {
    input.value = value;
    removeElements();
}
function removeElements() {
    let items = document.querySelectorAll(".list-items");
    items.forEach((item) => {
        item.remove();
    });
}

async function fetchNames() {
    const response = await fetch("/Trade_Tracker/assets/Json/Stock_list.json");
    names = await response.json();
}

function createListItem(name, inputValue) {
    let listItem = document.createElement("li");
    listItem.classList.add("list-items");
    listItem.style.cursor = "pointer";
    listItem.setAttribute("onclick", "displayNames('" + name + "')");
    let word = "<b>" + name.substr(0, inputValue.length) + "</b>";
    word += name.substr(inputValue.length);
    listItem.innerHTML = word;
    return listItem;
}

function handleInput(e) {
    removeElements();
    let count = 0;
    for (let name of names) {
        if (
            name.toLowerCase().startsWith(input.value.toLowerCase()) &&
            input.value != "" &&
            count < 5
        ) {
            count++;
            let listItem = createListItem(name, input.value);
            document.querySelector(".list").appendChild(listItem);
        }
    }
}
// 載入
window.onload = async () => {
    await fetchNames();
    input.addEventListener("keyup", handleInput);
};

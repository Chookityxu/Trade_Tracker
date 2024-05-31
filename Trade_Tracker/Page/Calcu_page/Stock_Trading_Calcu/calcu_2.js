// Date: 2024/5/30
// Creator: Terry
// Description: This is a trade calculator for stock trading.
// Version: 1.0.1

//data
let minFee = 20; //預設最低手續費
let feeDiscount = 1; //預設手續費折扣
let quoteNumber = 3; //預設報價數量
const FeeRate = 0.1425 / 100;
const taxRates = {
    stock: 0.3 / 100,
    stockDay: 0.15 / 100,
    etf: 0.1 / 100,
};
const tickValues = {
    belowTen: 0.01,
    tenToFifty: 0.05,
    fiftyToOneHundred: 0.1,
    oneHundredToFiveHundred: 0.5,
    fiveHundredToOneThousand: 1,
    aboveOneThousand: 5,
};
//functions
let checkInputValue = (input) => {
    //檢查是否有填寫
    let check = true;
    input.forEach(function (item) {
        //遍歷所有的input和select元素
        if (item.value === "") {
            //如果有一個input或select元素的值為空
            check = false; //返回false
        }
    });
    return check;
};
let getSelectedValue = (selectedID) => {
    //獲取select選中的值
    let selectElement = document.getElementById(selectedID); //獲取select元素
    let selectedIndex = selectElement.selectedIndex; //獲取選中的索引
    var options = selectElement.options; //獲取所有的option元素
    var selectedValue = options[selectedIndex].value; //option[選中的索引].value
    return selectedValue;
};
let fetchValue = (name) => {
    //獲取input元素的值

    let element = document.getElementById(name);
    if (element) {
        return Number(element.value);
    } else {
        console.error(`Element with ID ${name} not found.`);
        return null;
    }
};
let addInputValidation = (name) => {
    //為setting添加檢查函數

    let element = document.getElementById(name);
    let warning = element.parentNode.querySelector(".warning");
    let isValid = element.validity.valid;
    if (!warning) {
        //如果warning元素不存在
        warning = document.createElement("span");
        warning.innerText = "!";
        warning.style.color = "red";
        warning.style.display = "none"; // initially hidden
        warning.className = "warning";
        element.parentNode.insertBefore(warning, element); //在input元素之前插入warning元素
    }

    element.addEventListener("input", function (e) {
        isValid = element.validity.valid;
        if (isValid) {
            warning.style.display = "none";
        } else {
            warning.style.display = "inline-block";
        }
    });
    return isValid;
};
class tradeCalculator {
    //交易計算器
    constructor(buyPrice, sellPrice, tradeVolume, tradeType) {
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.tradeVolume = tradeVolume;
        this.tradeType = tradeType;
        this.feeDiscount = feeDiscount;
        this.buyPriceFee = 0;
        this.sellPriceFee = 0;
        this.oldSellPriceFee = 0;
        this.oldBuyPriceFee = 0;
    }
    calFee() {
        this.buyPriceFee = Math.round(
            this.buyPrice * this.tradeVolume * FeeRate * this.feeDiscount
        );
        this.sellPriceFee = Math.round(
            this.sellPrice * this.tradeVolume * FeeRate * this.feeDiscount
        );
        if (this.buyPriceFee < minFee) {
            this.oldBuyPriceFee = this.buyPriceFee;
            this.buyPriceFee = minFee;
        }
        if (this.sellPriceFee < minFee) {
            this.oldSellPriceFee = this.sellPriceFee;
            this.sellPriceFee = minFee;
        }
    }
    calculator() {
        this.calFee();
        let taxRate = taxRates[this.tradeType];
        let tax = Math.round(this.sellPrice * this.tradeVolume * taxRate);
        let totalBuyPrice = this.buyPrice * this.tradeVolume + this.buyPriceFee;
        let totalSellPrice = Math.round(
            this.sellPrice * this.tradeVolume - this.sellPriceFee - tax
        );
        let profit = Math.round(totalSellPrice - totalBuyPrice);
        let profitPercentage = parseFloat(
            ((profit / totalBuyPrice) * 100).toFixed(2)
        );
        let result = {
            成交價格: this.sellPrice,
            支付總金額: totalBuyPrice,
            實收總金額: totalSellPrice,
            買入手續費: this.buyPriceFee,
            賣出手續費: this.sellPriceFee,
            交易稅: tax,
            利潤: profit,
            利潤百分比: profitPercentage,
        };
        let oldFee = {
            oldBuyPriceFee: this.oldBuyPriceFee,
            oldSellPriceFee: this.oldSellPriceFee,
        };
        let output = {
            result: result,
            oldFee: oldFee,
        };
        return output;
    }
}
function calQuoteNum(sellPrice, quoteNumber, quoteNum, tickValues) {
    //計算報價數量
    let tickValue = 0;
    if (sellPrice < 10) {
        tickValue = tickValues.belowTen;
    } else if (sellPrice < 50) {
        tickValue = tickValues.tenToFifty;
    } else if (sellPrice < 100) {
        tickValue = tickValues.fiftyToOneHundred;
    } else if (sellPrice < 500) {
        tickValue = tickValues.oneHundredToFiveHundred;
    } else if (sellPrice < 1000) {
        tickValue = tickValues.fiveHundredToOneThousand;
    } else {
        tickValue = tickValues.aboveOneThousand;
    }

    for (let i = 0; i < quoteNumber; i++) {
        quoteNum.push(sellPrice - tickValue * (quoteNumber - i));
        quoteNum.push(sellPrice + tickValue * (i + 1));
    }
    quoteNum.push(sellPrice);
    quoteNum.sort((a, b) => a - b); // sort the array in ascending order
    return quoteNum;
}

let drawTable = (outputs) => {
    // 獲取或創建表格元素
    let table = document.getElementById("outTable");
    if (!table) {
        table = document.createElement("table");
        table.id = "outTable";
        table.classList.add(
            "table",
            "table-striped",
            "table-bordered",
            "border-primary"
        ); // 使用 Bootstrap 的 table 和 table-striped 類
        document.body.appendChild(table);
    }

    // 清空表格
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // 創建表頭
    let thead = document.createElement("thead");
    thead.classList.add("thead-dark"); // 使用 Bootstrap 的 thead-dark 類
    let headerRow = document.createElement("tr");
    let headers = Object.keys(outputs[0].result); // 使用 output.result 的鍵作為表頭
    headers.forEach((header) => {
        let th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 創建表格內容
    let tbody = document.createElement("tbody");
    outputs.forEach((output) => {
        let row = document.createElement("tr");
        headers.forEach((header, index) => {
            let td = document.createElement("td");
            td.style.width = '100px'; // 設定固定寬度
            td.style.overflow = 'hidden'; // 隱藏超出的內容
            td.style.textOverflow = 'ellipsis'; // 使用省略號表示超出的內容
            let content = output.result[header];
            td.style.fontSize = content.length > 10 ? '0.8em' : '1em';
            if ((index === 6 || index === 7) && output.result[header] < 0) {
                td.classList.add("text-success"); 
            } else if (
                (index === 6 || index === 7) &&
                output.result[header] >= 0
            ) {
                td.classList.add("text-danger");
            }
            if (typeof content === 'number') {
                content = content.toLocaleString(); // 將數字轉換為本地化的字串表示
            }
            if(index ===7)
                {
                    content = content + '%';
                }
            td.textContent = content;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    let table_label = document.getElementById("table_label");
    table_label.appendChild(table);
};

function main() {
    //主函數
    let buyPrice = fetchValue("buyPrice");
    let sellPrice = fetchValue("sellPrice");
    let tradeVolume = fetchValue("tradeVolume");
    let tradeType = getSelectedValue("tradeType");
    let quoteNumbers = [];
    let quoteNum = calQuoteNum(
        sellPrice,
        quoteNumber,
        quoteNumbers,
        tickValues
    );
    let outputs = quoteNum.map((sellPrice) => {
        let trade = new tradeCalculator(
            buyPrice,
            sellPrice,
            tradeVolume,
            tradeType
        );
        return trade.calculator();
    });
    drawTable(outputs);
}
window.onload = function () {
    var input = document.querySelectorAll("input,select"); //獲取所有的input和select元素
    input.forEach(function (item) {
        //為每個input和select元素添加一個事件監聽器
        item.addEventListener("input", function () {
            if (checkInputValue(input)) {
                //檢查是否有填寫
                main();
            }
            else {
                let table = document.getElementById("outTable");
                if (table) {
                    table.parentNode.removeChild(table);
                }
            }
        });
    });

    settingBtn.onclick = function () {
        const ids = ["minFee", "feeDiscount", "quoteNum"]; //需要檢查的input元素的id
        ids.forEach(addInputValidation); //為每個input元素添加檢查函數
        settingStore.onclick = function () {
            if (ids.every((id) => addInputValidation(id))) {
                alert("設定成功");
                minFee = fetchValue("minFee");
                feeDiscount = fetchValue("feeDiscount");
                quoteNumber = fetchValue("quoteNum");
                if (checkInputValue(input)) {
                    main();
                }
            } else {
                alert("請填寫正確的數值");
            }
        };
    };
};

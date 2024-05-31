class tradeCalculator {//計算風險報酬比
    constructor(EP, SLP, TP) {
        this.EP = EP;
        this.SLP = SLP;
        this.TP = TP;
    }

    calLongRRR() {
        let RRR = (this.TP - this.EP) / (this.EP - this.SLP);
        let SLPPercentage = ((this.SLP - this.EP) / this.EP) * 100;
        let TPPercentage = ((this.TP - this.EP) / this.EP) * 100;
        if (isNaN(RRR)) {
            RRR = 0;
        }
        return {
            RRR: RRR.toFixed(2),
            SLP: SLPPercentage.toFixed(2),
            TPP: TPPercentage.toFixed(2),
        };
    }

    calShortRRR() {
        let RRR = (this.EP - this.TP) / (this.SLP - this.EP);
        let SLPPercentage = ((this.EP - this.SLP) / this.EP) * 100;
        let TPPercentage = ((this.EP - this.TP) / this.EP) * 100;
        if (isNaN(RRR)) {
            RRR = 0;
        }
        return {
            RRR: RRR.toFixed(2),
            SLP: SLPPercentage.toFixed(2),
            TPP: TPPercentage.toFixed(2),
        };
    }
}

function checkRadio() {//檢查選擇的是買進還是賣出
    // 獲取所有的 radio 按鈕和 label 元素
    let select = document.querySelector('select[name="situation"]');
    let label = document.querySelector('label[for="entryPrice"]');

    // 為 select 添加一個事件監聽器
    select.addEventListener("change", function () {
        // 根據選擇的選項更新 label 的文字
        if (this.value === "Long") {
            label.textContent = "買進價格:";
        } else if (this.value === "Short") {
            label.textContent = "賣出價格:";
        }
    });
}
function showResult(result) {//顯示結果
    if (result) {
        // 創建表格
        let table = document.createElement("table");
        table.className = "table";

        // 創建表身
        let tbody = document.createElement("tbody");
        let data = [
            { name: "風險報酬比 (RRR)", value: result.RRR },
            { name: "預計停損幅度 (ESL)", value: result.SLP + '%' },
            { name: "預計停利幅度 (ETP)", value: result.TPP + '%' },
        ];
        for (let item of data) {
            let tr = document.createElement("tr");
            let td1 = document.createElement("td");
            td1.textContent = item.name;
            td1.style.fontWeight = "bold";
            td1.style.fontSize = "1rem";
            let td2 = document.createElement("td");
            td2.textContent = item.value;
            td2.style.fontWeight = "bold";
            td2.style.fontSize = "1rem";
            td2.style.textAlign = "center";
            td2.style.padding = "10px";
            // 如果值是正數，設置文字顏色為紅色；如果值是負數，設置文字顏色為綠色
            if (item.name !== "風險報酬比 (RRR)") {
                td2.style.color = parseFloat(item.value) > 0 ? 'red' : 'green';
            }
            tr.appendChild(td1);
            tr.appendChild(td2);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        // 將表格添加到頁面上
        let container = document.getElementById("table_label");
        container.innerHTML = ""; // 清空容器
        container.appendChild(table);
    } else {
        console.log("Result is undefined");
    }
}

function getSituationAndValidInputsValue(EP, SLP, TP) {//確認輸入的值是否為數字
    let situationSelect = document.querySelector('select[name="situation"]');
    let situation = situationSelect ? situationSelect.value : null;
    let isValid = EP && SLP && TP && situation !== null;
    return { situation, isValid };
}

window.onload = function () {
    checkRadio();
    cal.onclick = function () {
        let EP = parseFloat(document.getElementById("entryPrice").value);
        let SLP = parseFloat(document.getElementById("stopLossPrice").value);
        let TP = parseFloat(document.getElementById("targetPrice").value);
        let { situation, isValid } = getSituationAndValidInputsValue(EP, SLP, TP);
        if (!isValid) {
            $('#alertModal').modal('show');
            return;
        }

        let trade = new tradeCalculator(EP, SLP, TP);
        let result;
        switch (situation) {
            case "Long":
                result = trade.calLongRRR();
                break;
            case "Short":
                result = trade.calShortRRR();
                break;
            default:
                console.log("Invalid situation: " + situation);
                return;
        }
        showResult(result);
    };
};
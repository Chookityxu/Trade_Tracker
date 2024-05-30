class tradeCalculator {
    constructor(EP, SLP, TP) {
        this.EP = EP;
        this.SLP = SLP;
        this.TP = TP;
    }

    calLongRRR() {
        let RRR = ((this.TP - this.EP) / (this.EP - this.SLP));
        let SLPPercentage = ((this.SLP - this.EP) / this.EP) * 100;
        let TPPercentage = ((this.TP - this.EP) / this.EP) * 100;
        return { RRR, SLPPercentage, TPPercentage };
    }

    calShortRRR() {
        let RRR = (this.EP - this.TP) / (this.SLP - this.EP);
        let SLPPercentage = ((this.EP - this.SLP) / this.EP) * 100;
        let TPPercentage = ((this.EP - this.TP) / this.EP) * 100;
        return { RRR, SLPPercentage, TPPercentage };
    }
}
function checkRadio() {
    // 獲取所有的 radio 按鈕和 label 元素
    let radios = document.querySelectorAll('input[name="situation"]');
    let label = document.querySelector('label[for="entryPrice"]');

    // 為每個 radio 按鈕添加一個事件監聽器
    radios.forEach((radio) => {
        radio.addEventListener("change", function () {
            // 根據選擇的選項更新 label 的文字
            if (this.value === "Long") {
                label.textContent = "買進價格:";
            } else if (this.value === "Short") {
                label.textContent = "賣出價格:";
            }
        });
    });
}
function showResult(result) {
    document.getElementById("RRR").textContent = result.RRR;
    document.getElementById("SLP").textContent=result.SLPPercentage.toFixed(2);
    document.getElementById("TPP").textContent=result.TPPercentage.toFixed(2);
}
window.onload = function () {
    checkRadio();
    cal.onclick = function () {
        let EP = document.getElementById("entryPrice").value;
        let SLP = document.getElementById("stopLossPrice").value;
        let TP = document.getElementById("targetPrice").value;
        let situationRadio = document.querySelector(
            'input[name="situation"]:checked'
        );
        let situation = situationRadio ? situationRadio.value : null;
        if (!EP || !SLP || !TP || situation==null) {
            console.log("請填寫完整");
            //檢查是否有填寫
            document.getElementById("result").textContent = "請填寫完整"; // 清空結果
            return false;
        }

        let trade = new tradeCalculator(EP, SLP, TP);
        switch (situation) {
            case "Long":
                result = trade.calLongRRR();
                break;
            case "Short":
                result = trade.calShortRRR();
                break;
        }
        showResult(result);
    };
};

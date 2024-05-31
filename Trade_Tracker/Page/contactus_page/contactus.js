//需要檢查的input元素的id
let addInputValidation = (name) => {
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
SendTo = () => {
    console.log("SendTo");
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    var body = `姓名: ${name}\n電話: ${phone}\n\n${message}`;

    var recipientEmail = "test01@gmail.com"; // 收件人的電子郵件地址

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
SendBtn.onclick = function () {
    $('#error-message').hide();
    const ids = ["name", "email", "phone", "subject", "message"];
    if (ids.every((id) => addInputValidation(id))) {
        SendTo();
    } else {
        $('#error-message').text("請填寫正確的數值").show();
    }

};

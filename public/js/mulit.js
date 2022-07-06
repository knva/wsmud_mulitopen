var count = 0;
var prefix = 'www';
var nosc = false;
(function () {
    let r = getQueryString("c");
    let auto = getQueryString("a");
    if (r) {
        count = parseInt(r);
        run(auto);
    } else {
        var div = document.getElementById("buttonArea");
        div.appendChild(createDuoKaiButton("单开", 1));
        div.appendChild(createDuoKaiButton("双开", 2));
        div.appendChild(createDuoKaiButton("三开", 3));
        div.appendChild(createDuoKaiButton("四开", 4));
        div.appendChild(createDuoKaiButton("五开", 5));
        div.appendChild(createDuoKaiButton("十开", 10));

        var div2 = document.getElementById("button2Area");
        div2.innerHTML = "指定数量：<input id='aid' /> <button id='opa' >开</button>";
        div2.innerHTML += "<p>自动登录：<input id='auto' type='checkbox' '/> 需要使用0.0.32.120 以上版本的wsmud_pluginss</p>";
        div2.innerHTML += "<p>我没装脚本：<input id='nosc' type='checkbox' '/> 简单脚本模式,不依赖tampermonkey</p>";
        div2.innerHTML += "<p>本项目为开源项目,对css有建议的请到<a href='https://aize.coding.net/p/wsmud/'>https://aize.coding.net/p/wsmud/</a>提交PR</p>";
        var opBtn = document.getElementById("opa");
        opBtn.onclick = function () {
            count = document.getElementById("aid").value;
            run();
        }
        var auBtn = document.getElementById("auto");
        var noBtn = document.getElementById("nosc");
        auBtn.onchange = function () {
            addCookie('auto', document.getElementById("auto").checked)
            auto = document.getElementById("auto").checked
        }
        noBtn.onchange = function () {
            addCookie('nosc', document.getElementById("nosc").checked)
            nosc = document.getElementById("nosc").checked
        }
        if (getCookie('auto') == 'false') {
            document.getElementById("auto").checked = false;
        } else {
            document.getElementById("auto").checked = true;
        }
        if (getCookie('nosc') == 'false') {
            document.getElementById("nosc").checked = false;
            nosc = false;
        } else {
            document.getElementById("nosc").checked = true;
            nosc = true;
        }
    }

})();

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return (arr[2]);
    } else {
        return null;
    }
}
function addCookie(name, value, expireHours) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expireHours * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ((expireHours == null) ? "" : ";expires=" + exdate.toUTCString());
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function send() {
    var data = document.getElementById("data").value;
    for (let i = 0; i < window.frames.length; i++) {
        window.frames[i].postMessage(data, "*");
    }
}
function flush(idx) {
    if (nosc) {
        document.getElementById('f' + idx).src = `http://mush.aize.org/?test`;
    } else {

        document.getElementById('f' + idx).src = `http://baidu.com`;
        setTimeout(() => {
            document.getElementById('f' + idx).src = `http://${prefix}.wamud.com/?test`;
        }, 5000);
    }

}
function moCss() {
    var sd = document.getElementsByClassName("big_box");
    var dd = "700px";
    if (IsPC()) {
        dd = "calc(100vh - 50px)";
    }
    for (let i of sd) {
        i.style.height = dd;
    }
}
function createDuoKaiButton(name, value) {
    var button = document.createElement("button");
    button.type = "button";
    button.value = value;
    button.onclick = function () {
        count = this.value;
        run();
    };
    button.innerHTML = name;
    return button;
}
function createLazyBtn(name, console) {
    var float = document.getElementById("float");
    var button = document.createElement("button");
    button = document.createElement("button");
    button.innerHTML = name;
    button.className = "float";
    button.onclick = function () {
        if (console == "fx") {
            var name = prompt("请输入您的分享码", "");
            var mymsg = "";
            if (name.indexOf("触发") >= 0) {
                mymsg = `//
                      @js    Server.importTrigger("${name}","根文件夹")`
            } else {

                mymsg = `//
                       @js   Server.importFlow("${name}","根文件夹")`
            }
            for (let i = 0; i < window.frames.length; i++) {
                window.frames[i].postMessage(mymsg, "*");
            }
        }else if(console == "bf"){
            // 备份
            saveConfig()
        }else if(console == "hf"){
            // 恢复
            loadConfig()
        }
        else {
            for (let i = 0; i < window.frames.length; i++) {
                window.frames[i].postMessage(console, "*");
            }
        };
    }
    float.appendChild(button);

}
function creatFloatDiv() {


    var inputArea = document.getElementById("inputArea");
    inputArea.innerHTML = `发送指令：<textarea id='data' placeholder='此处可以编写流程 使用 // 作为第一行即可,也可以使用游戏命令'></textarea> <button id='sendBtn'>Send</button>`;
    var sendBtn = document.getElementById("sendBtn");
    sendBtn.onclick = function () {
        send();
    }
    var float = document.getElementById("float");
    var button = document.createElement("button");
    button.innerHTML = "全部最大化";
    button.className = "float";
    button.onclick = function () {
        for (var i = 1; i <= count; i++) {
            document.getElementById("box" + i).className = "big_box";
            document.getElementById("cover" + i).className = "disable";
        }
        moCss();
    };
    float.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "全部最小化";
    button.className = "float";
    button.onclick = function () {
        for (var i = 1; i <= count; i++) {
            document.getElementById("box" + i).className = "small_box";
            document.getElementById("cover" + i).className = "cover";
            document.getElementById("box" + i).style.height = "";
        }
    };
    float.appendChild(button);

    var btnList = {
        "日常": "日常",
        "修炼": "修炼",
        "停止动作": "挂机",
        "停止脚本": "$stop",
        "重置武道": "$to 武道塔;$wait 1000;ask1 %守门人%",
        "开始武道": "$to 扬州城-广场;$wudao",
        "扫荡武道": "$to 扬州城-广场;$to 武道塔;$wait 1000;ask3 %守门人%",
        "换装1": "$eq 1",
        "技能1": "$eqskill 1",
        "武庙疗伤": "$to 扬州城-武庙;liaoshang",
        "清包": "$sellall",
        "懒人练习": "stopstate;$atlx;$to 住房-练功房;dazuo",
        "当铺": "stopstate;$tnbuy",
        "导入流程或触发": "fx"

    }
    if(nosc){
        btnList['备份']='bf';
        btnList['恢复']='hf';
    }

    for (let item in btnList) {
        createLazyBtn(item, btnList[item])
    }

}



function run(command) {


    creatFloatDiv();
    var buttonArea = document.getElementById("buttonArea");
    buttonArea.className = "disable";
    var button2Area = document.getElementById("button2Area");
    button2Area.className = "disable";
    var iframeArea = document.getElementById("iframeArea");
    iframeArea.innerHTML = "";
    for (var i = 1; i <= count; i++) {
        var box = document.createElement("div");
        box.className = "big_box";
        box.id = "box" + i;

        var iframe = document.createElement("iframe");
        iframe.id = 'f' + i;
        let auto = getQueryString(i);
        //自动登录
        if (auto || command == "1" || document.getElementById("auto").checked)

            if (nosc) {
                iframe.src = `http://mush.aize.org/?test&login=${i}`;
            } else {
                iframe.src = `http://${prefix}.wamud.com/?test&login=${i}`;
            }
        else {
            if (nosc) {
                iframe.src = `http://mush.aize.org/?test`;
            } else {
                iframe.src = `http://${prefix}.wamud.com/?test`;
            }
        }


        var rbtn = `<button  id="btn" onclick="flush(${i})">刷</button>`

        rbtn[i] = document.createElement("button");
        rbtn[i].innerHTML = '刷' + i;
        rbtn[i].onclick = "flush(" + i + ")";


        var cover = document.createElement("div");
        cover.className = "disable";
        cover.id = "cover" + i;
        cover.innerHTML = i;
        cover.onclick = function () {
            this.className = "disable"; // cover 消失
            document.getElementById("box" + this.innerHTML).className = "big_box"; // box 变大
        };

        box.appendChild(iframe);


        box.innerHTML += rbtn;

        box.appendChild(cover);
        iframeArea.appendChild(box);


    }



    moCss();
}
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function saveConfig() {
    if (!nosc) {
        // 提示用户只能在简易模式下使用
        alert("只能在简易模式下使用");
    }
    // 遍历localStorage，把所有的键值对保存成文件下载
    var fileName = "config.txt";
    var content = "";
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        content += key + "=" + value + "\n";
    }
    var blob = new Blob([content], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);


}


function loadConfig(){
    if(!nosc){
        // 提示用户只能在简易模式下使用
        alert("只能在简易模式下使用");
    }
    //上传文件
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        var content = e.target.result;
        var lines = content.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var pair = line.split("=");
            if (pair.length == 2) {
                localStorage.setItem(pair[0], pair[1]);
            }
        }
    }

}

function clickCover() {
    var box_array = document.getElementsByClassName("small_box" + " " + this.innerHTML);
    for (var i = 0; i < box_array.length; i++) {
        box_array[i].className = "big_box";
    }
}



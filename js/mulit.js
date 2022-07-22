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

        // 绑定addrow 事件
        document.getElementById("addrow").onclick = function () {
            var zdybtn = get_value('zdybtn');
            if (zdybtn) {
                zdybtn = JSON.parse(zdybtn);
            }
            // 名称为input btname
            var btname = document.getElementById("btname").value;
            zdybtn[btname] = ''
            set_value('zdybtn', JSON.stringify(zdybtn));
            rebuild_btnhtml()

        }

        // 绑定save事件
        document.getElementById("save").onclick = function () {
            var zdybtn = get_value('zdybtn');
            if (zdybtn) {
                zdybtn = JSON.parse(zdybtn);
            }
            // 遍历keyvalue的label 与 input
            var datalist = $('#keyvalue').children();
            for (let i = 0; i < datalist.length; i++) {
                var key = datalist[i].children[0].value;
                var value = datalist[i].children[1].value;
                zdybtn[key] = value;
            }
            set_value('zdybtn', JSON.stringify(zdybtn));
            rebuild_btnhtml()
        }
        // 绑定outputbtn
        document.getElementById("outputbtn").onclick = function () {
            var zdybtn = get_value('zdybtn');
            if (zdybtn) {
                zdybtn = JSON.parse(zdybtn);
            }
            // 下载json文件
            var blob = new Blob([zdybtn], { type: "text/plain;charset=utf-8" });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "config.json";
            a.click();
            URL.revokeObjectURL(url);

        }
        // 绑定inputbtn
        document.getElementById("inputbtn").onclick = function () {
            var zdybtn = get_value('zdybtn');
            if (zdybtn) {
                zdybtn = JSON.parse(zdybtn);
            }
            // 创建文件选择框
            var input = document.createElement('input');
            input.type = 'file';
            input.onchange = function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    var text = reader.result;
                    zdybtn = JSON.parse(text);
                    set_value('zdybtn', JSON.stringify(text));
                    rebuild_btnhtml();
                }
                reader.readAsText(file);
            }
        }
    }

})();

function get_value(name) {
    //返回本地存储
    return localStorage.getItem(name);
}

function set_value(name, value) {
    localStorage.setItem(name, value);
}

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
function createLazyBtn(name, order) {
    var float = document.getElementById("float");
    var button = document.createElement("button");
    button = document.createElement("button");
    button.innerHTML = name;
    button.className = "float";
    button.onclick = function () {
        if (order == "fx") {
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
        } else if (order == "bf") {
            // 备份
            var jsdd = saveConfig()
            window.frames[0].postMessage(jsdd, "*");
        } else if (order == "hf") {
            // 恢复
            var jsdd = loadConfig()
            window.frames[0].postMessage(jsdd, "*");
        } else if (order == 'zdy') {

            rebuild_btnhtml()
            // 自定义按钮 使用layer 弹出userBtnSetting
            layer.open({
                type: 1,
                title: '自定义按钮',
                area: ['500px', '300px'],
                content: $('#userBtnSetting')
            });

        }
        else {
            for (let i = 0; i < window.frames.length; i++) {
                window.frames[i].postMessage(console, "*");
            }
        };
    }
    float.appendChild(button);

}
function rebuild_btnhtml() {
    // 清空keyvalue
    document.getElementById("keyvalue").innerHTML = "";
    var zdybtn = get_value('zdybtn');
    if (zdybtn) {
        zdybtn = JSON.parse(zdybtn);
    }

    // 向 keyvalue 循环添加zdybtn的key value 值
    var html = ''
    for (let key in zdybtn) {
        html += `<p><input type="text" value="${key}"</input> : <input type="text" value="${zdybtn[key]}"</p>`;
    }
    document.getElementById("keyvalue").innerHTML = html;
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
    }
    var userBtn = get_value('zdybtn')
    if (userBtn == null) {
        userBtn = {
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
        }
        set_value('zdybtn', JSON.stringify(userBtn));
    } else {
        userBtn = JSON.parse(userBtn)
    }

    btnList = { ...btnList, ...userBtn }
    if (nosc) {
        btnList['备份'] = 'bf';
        btnList['恢复'] = 'hf';
    }
    btnList['导入流程或触发'] = 'fx';
    btnList['自定义按钮'] = 'zdy';
    addZdyBtn(btnList)

}



function addZdyBtn(btnList) {
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
    alert('如果点击无效，请点击一下第一个子窗口')
    // // 将localStorage中的配置信息保存为json字符串
    // var config = {};
    // var keys=Object.keys( localStorage);
    // for(var k in keys){
    //     var key=keys[k];var value=localStorage.getItem( key );
    //     config[key] = value;
    // }
    // var json = JSON.stringify(config);
    // // 将json字符串保存到本地文件中
    // var blob = new Blob([json], { type: "text/plain" });
    // var url = URL.createObjectURL(blob);
    // var a = document.createElement("a");
    // a.href = url;
    // a.download = "config.json";
    // a.click();
    // URL.revokeObjectURL(url);

    return `//
@js var config={};var keys=Object.keys( localStorage);for( var k in keys){var key=keys[k];var value=localStorage.getItem( key);config[key]=value}var json=JSON.stringify( config);var blob=new Blob( [json],{type:"text/plain"});var url=URL.createObjectURL( blob);var a=document.createElement( "a");a.href=url;a.download="config.json";a.click( );URL.revokeObjectURL( url);`


}


function loadConfig() {
    alert('如果点击无效，请点击一下第一个子窗口')
    //   // 提示用户选择文件
    //     var input = document.createElement('input');
    //     input.type = 'file';
    //     input.onchange = function () {
    //         // 获取文件列表中的第一个文件
    //         var file = this.files[0];
    //         // 创建一个读取文件的对象
    //         var reader = new FileReader();
    //         // 将文件读取为字符串
    //         reader.readAsText(file);
    //         // 读取文件成功后执行的回调函数
    //         reader.onload = function () {
    //             // 获取文件内容
    //             var content = this.result;
    //             // 将json字符串转换为对象
    //             var config = JSON.parse(content);
    //             // 将对象中的属性赋值给 localStorage
    //             for (var key in config) {
    //                 localStorage.setItem(key, obj[key]);
    //             }
    //             alert('操作成功,请刷新页面')
    //         }
    //     }
    //     // 添加到页面中
    //     input.click();
    return `//
@js var input=document.createElement('input');input.type='file';input.onchange=function(){var file=this.files[0];var reader=new FileReader();reader.readAsText(file);reader.onload=function(){var content=this.result;var config=JSON.parse(content);for(var key in config){localStorage.setItem(key,config[key])}alert('操作成功,请刷新页面')}};input.click();`
}


function clickCover() {
    var box_array = document.getElementsByClassName("small_box" + " " + this.innerHTML);
    for (var i = 0; i < box_array.length; i++) {
        box_array[i].className = "big_box";
    }
}



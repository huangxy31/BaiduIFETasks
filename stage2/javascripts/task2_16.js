/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {
	//定义length方法
	"length" : function() {
		var l = 0;
		for (var data in this) {
			l++;
		}
		return l;
	}
};


/**
 * 记录aqiData长度，
 * 用于检测是否有添加数据
 */
//var length = 0;
/**
 * 最后一个key
 */
/*var last_key = "";
update_length_and_last_key();
*/
/**
 * 更新对象长度，以及最后一个key
 * 
 */
/*function update_length_and_last_key(){
	var new_length = 0
	for (var x in aqiData) {
		new_length++;
		last_key = x;
	}
	length = new_length;
}*/


/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	
	var city = document.getElementById("aqi-city-input").value.trim();
	var quality = document.getElementById("aqi-value-input").value.trim();
	
	//验证城市名是否为中英文字符
	if (validateCity(city)) {
		//验证空气质量是否为 正整数
		if (validateQuality(quality)) {
			aqiData[city] = parseInt(quality);
		}
	}
}

/**
 * 判断城市名是否为中英文字符
 * @param {Object} quality
 */
function validateCity(city) {
	if (city === "") {
		alert("城市名为空"); 
		return false;
	}
	if (checkChinese(city) || checkEnglish(city)) {
		return true;
	} else {
        alert("请输入中文或英文城市名");
		return false;
	}
}

/**
 * 判断输入是否是英文字符串
 * @param {String} str
 */
function checkEnglish(str) {
	return (/^[a-zA-Z]/).test(str);
}

/**
 * 判断输入是否是汉字
 * @param {String} str
 */
function checkChinese(str) {
	//判断是否包含中文：if(/^[\u4e00-\u9fa5]/.test("名字"))
	//判断是否包含英文:   if(/^[a-zA-Z]/.test("abc"))
	//只要编码大于255的都是汉字
	for (var i=0; i<str.length; i++) {
		if (str.charCodeAt(i) <= 255) {
			return false;
		}
	}
	return true;
}

/**
 * 判断空气质量输入是否有效
 * @param {Object} quality
 */
function validateQuality(quality) {
	try{
		if (quality == "") {
			//未输入的情况
			alert("空气质量为空")
			return false;
		}
		//判断输入的是否为正整数
		if (checkRate(quality)){
			return true;
		}
		else{
			alert("空气质量输入错误");
			return false;
		}
		
	}catch(e){
		//TODO handle the exception
		alert("空气质量输入错误");
		return false;
	}
}

/**
 * 判断是否为正整数
 * @param {String} input 判断是否为正整数
 */
function checkRate(input)
{
	//使用正则表达式判断
    return /^[1-9]+[0-9]*]*$/.test(input);
}


/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	//删除到aqiData没有数据时要去掉标头
	if (aqiData.length() === 1){
		document.getElementById("aqi-table").innerHTML = "";
		return;
	}
	
	var table_html = "";
	var str = ""; //需要添加的html
	//添加表头
	table_html = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
	//添加数据
	for (var city in aqiData) {
		if (city === "length") {continue;}
		table_html += "<tr><td>" + city + "</td><td>" + aqiData[city] +"</td><td><button>删除</button></td></tr>";
	}
	
	
	document.getElementById("aqi-table").innerHTML = table_html;
	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	bind_del_bnts_event();
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  var city = this.parentElement.parentElement.firstChild.innerHTML;
  delete aqiData[city];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").onclick = addBtnHandle;

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  bind_del_bnts_event();

}

/**
 * 给每个按钮绑定事件
 * 
 */
function bind_del_bnts_event() {
  var del_bnts = document.getElementById("aqi-table").getElementsByTagName("button");
  for (var i=0; i<del_bnts.length; i++) {
	  del_bnts[i].onclick = delBtnHandle;
  }
}

window.onload = init;
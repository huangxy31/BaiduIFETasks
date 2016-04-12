/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = dat.getDate();
	d = d < 10 ? '0' + d : d;
	return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = ''
	for (var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}

var aqiSourceData = {
	"北京": randomBuildData(500),
	"上海": randomBuildData(300),
	"广州": randomBuildData(200),
	"深圳": randomBuildData(100),
	"成都": randomBuildData(300),
	"西安": randomBuildData(500),
	"福州": randomBuildData(100),
	"厦门": randomBuildData(100),
	"沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
	nowSelectCity: -1,
	nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
	//var city = pageState.nowSelectCity;
	var chart_div = document.getElementById("city-chart");
	
}

/**
 * 返回对象的属性个数
 * @param {Object} obj
 */
function getObjectLength(obj) {
	var len = 0;
	for (var p in obj) {
		len++;
	}
	return len;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
	// 确定是否选项发生了变化
	if (pageState.nowGraTime == this.value) {
		return;
	}
	// 设置对应数据
	pageState.nowGraTime = this.value;
	getChartData();
	// 调用图表渲染函数
	renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
	// 确定是否选项发生了变化 
	if (pageState.nowSelectCity == this.selectedIndex) {
		return;
	}
	// 设置对应数据
	pageState.nowSelectCity == this.selectedIndex
	getChartData();
	// 调用图表渲染函数
	renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var radio_btn = document.getElementsByName("gra-time");
	for (var i = 0; i < radio_btn.length; i++) {
		radio_btn[i].onclick = graTimeChange;
	}
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
	// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	city_txt = "";
	for (var city in aqiSourceData) {
		city_txt += "<option>" + city + "</option>";
	}
	document.getElementById("city-select").innerHTML = city_txt;
	// 给select设置事件，当选项发生变化时调用函数citySelectChange
	document.getElementById("city-select").onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
	// 将原始的源数据处理成图表需要的数据格式
	//设置默认城市名
	document.getElementById("city-select").selectedIndex = 0;
	pageState.nowSelectCity = 0;
	// 处理好的数据存到 chartData 中
	getChartData();
	//渲染图表
	renderChart();
}

/**
 * 根据pageStage确定图表数据，存放在charData中
 */
function getChartData(){
	//获取城市名
	var city_index = pageState.nowSelectCity;
	var city = document.getElementById("city-select").options[city_index].text;
	var city_data = aqiSourceData[city];
	//根据日、周、月处理数据
	if (pageState.nowGraTime == "day") {
		chartData = city_data;
	} else if (pageState.nowGraTime == "week") {
		//计算出每周的数据
		chartData = {};
		var week_str = "";
		for (var dat in city_data) {
			//计算某一天是这个月的第几周
			week_str = getWeekStr(new Date(dat))
			if (chartData.hasOwnProperty(week_str)) {
				chartData[week_str] += city_data[dat];
			} else{
				chartData[week_str] = city_data[dat];
			}
		}
	} else{
		//计算出每月的数据
		chartData = {};
		var month_str = "";
		for (var dat in city_data) {
			month_str = getMonthStr(new Date(dat))
			if (chartData.hasOwnProperty(month_str)) {
				chartData[month_str] += city_data[dat];
			} else{
				chartData[month_str] = city_data[dat];
			}
		}
	}
}

/**
 * 返回周数字符串
 * @param {Object} dat
 */
function getWeekStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var w = dat.getWeekOfMonth();
	return y + '年' + m + '月,第' + w + '周';
}

/**
 * 返回月份字符串
 * @param {Object} dat
 */
function getMonthStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	return y + '-' + m;
}


/**
 * 初始化函数
 */
function init() {
	initGraTimeForm()
	initCitySelector();
	initAqiChartData();
}

window.onload = init;

// 计算当前日期在本年度的周数
Date.prototype.getWeekOfYear = function(weekStart) { // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
	weekStart = (weekStart || 0) - 0;
	if(isNaN(weekStart) || weekStart > 6)
		weekStart = 0;	

	var year = this.getFullYear();
	var firstDay = new Date(year, 0, 1);
	var firstWeekDays = 7 - firstDay.getDay() + weekStart;
	var dayOfYear = (((new Date(year, this.getMonth(), this.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;
	return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;
}

// 计算当前日期在本月份的周数
Date.prototype.getWeekOfMonth = function(weekStart) {
	weekStart = (weekStart || 0) - 0;
	if(isNaN(weekStart) || weekStart > 6)
		weekStart = 0;

	var dayOfWeek = this.getDay();
	var day = this.getDate();
	return Math.ceil((day - dayOfWeek - 1) / 7) + ((dayOfWeek >= weekStart) ? 1 : 0);
}

/*
// 使用
var date = new Date(2011, 11, 31); // 注意：JS 中月的取值范围为 0~11
var weekOfYear = date.getWeekOfYear(); // 当前日期是本年度第几周
var weekOfMonth = date.getWeekOfMonth(); // 当前日期是本月第几周

// 2011 年度有几周
(new Date(2011, 11, 31)).getWeekOfYear();
// 2011 年度 1 月有几周
(new Date(2011, 0, 31)).getWeekOfMonth();
*/
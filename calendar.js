/*calendar = {
	data: [[3,4,5,6,7,8,9],[10,11,12,13,14,15,16]....], 储存直接输入table的日期数据

	oldDay: newTime[0].getDay() === 6? -1 : newTime[0].getDay(), table中上个月的数据

	newDay: newTime[2].getDay()+1, table中下个月的数据

	nowTime: new Date( time ) 当前定位到的时间 隐含到秒

}*/



var getId = function( id ){
	return  document.getElementById( id );
};


var calendarObj = {
	tbody: getId( "tbody" ),
	selectMonth: getId( "selectMonth" ),
	selectYear: getId( "selectYear" ),
	dataInput: getId("dataInput"),
	calendar: {},//储存数据
	tableClick: true,//表示table的显示情况 默认初始为不显示

	init(){
		this.inputInit();
		this.calculate();
		this.render();
		this.bingEvent();
		this.selecteChange();
		this.dateClick();
	},
	getTime( day ){//接受日期参数 返回上月最后一天 当月第一天 当月最后一天
		var firstDay = new Date( day ),
		endDay = new Date( firstDay ),
		lastDay = new Date( firstDay );

		firstDay.setDate(1);

		endDay.setMonth( firstDay.getMonth() + 1);
		endDay.setDate(0);

		lastDay.setDate(0);
		return [ lastDay, firstDay, endDay ];
	},
	addColor(){//给非当月日期改变颜色
		var calendar = this.calendar,
			trs = this.tbody.getElementsByTagName( "tr" ),
			lastTr = trs[trs.length-1].getElementsByTagName( "td" ),
			firstTr = trs[0].getElementsByTagName( "td" );

		for( var i = 0; i<=calendar.oldDay; i++){
			firstTr[i].className = "numberGrey" ;
		}
		for( i = lastTr.length-1; i>=calendar.newDay; i--){
			lastTr[i].className = "numberGrey" ;
		}
	},


	calculate( time = Date() ){//传入一个详细时间进行一系列初始化表格数据的算法 进而传给render函数进行渲染
		var newTime = this.getTime( time ),
		calendar = {
			data: [[]],
			oldDay: newTime[0].getDay() === 6? -1 : newTime[0].getDay(),
			newDay: newTime[2].getDay()+1,
			nowTime: new Date( time )
		};
		//本月份前数据
		for( var i = newTime[0].getDay(), day = newTime[0].getDate(); i >= 0; i--, day-- ){
			calendar.data[0][i] = day;
		}
		i = 1; 
		//本月份中数据
		for( var n = newTime[2].getDate(), week = 0, begin = newTime[1].getDay() ; i <= n; i++,begin++){
			if( begin === 7 ){
				begin = 0;
				++week;
				calendar.data[week] = [];
			}
			calendar.data[week][begin] = i;	
		}
		//本月份后数据
		for( i = calendar.data[calendar.data.length-1].length,n=1; i < 7; i++,n++ ){
			calendar.data[calendar.data.length-1][i] = n;
		}

		console.log(calendar);
		this.calendar = calendar;

		//相应下拉框选项变化 
		this.selectYear.getElementsByTagName("option")[parseInt( calendar.nowTime.getFullYear().toString().slice( 2 ) ,10 )].selected = true;
		this.selectMonth.getElementsByTagName("option")[ calendar.nowTime.getMonth() ].selected = true;

	},
	render(){//利用calculate函数生成的calendar数组 dom插入table的tbody
		var tbodyArr = [],
			calendar = this.calendar;

		for( var i = 0; calendar.data[i]; i++ ){
			tbodyArr[i] = "";
			for( var j = 0; calendar.data[i][j]; j++ ){
				tbodyArr[i] += "<td>" + calendar.data[i][j] + "</td>";
			}
		}
		this.tbody.innerHTML = "<tr>" + tbodyArr.join("</tr><tr>") + "</tr>";
		this.addColor();
	},

	setTableDisplay( ){
		var	head = getId( "head" ),
			table = getId( "table" ),
			self = this;

		if( self.tableClick ){
			head.style.display = "block";
			table.style.display = "table";
			self.tableClick = false;
		}else{
			head.style.display = "none";
			table.style.display = "none";
			self.tableClick = true;
		}
	},
	inputInit(){
		var self = this;

		this.dataInput.onclick = function(){
			self.setTableDisplay( );
		};//绑定事件  点击输入框table的display变为相反状态

	},
	dateClick(){
		var tds = this.tbody.getElementsByTagName("td"),
			self = this;

		validTds = [].filter.call( tds, function( item, index, array ){
			return !item.className;
		});
		tds = null;
		for( var i = 0; validTds[i]; i++ ){
			validTds[i].onclick = function(){
				self.dataInput.value = self.calendar.nowTime.getFullYear() + "-" + (self.calendar.nowTime.getMonth() + 1) + "-" + this.innerHTML;

				//点击消失
				self.setTableDisplay();
			}
		}
	},

	bingEvent(){//给日期改变按钮添加事件
		var lastYear = getId( "setLastYear" ),
			lastMonth = getId( "setLastMonth" ),
			nextYear = getId( "setNextYear" ),
			nextMonth = getId( "setNextMonth" ),
			calendar = this.calendar,
			self = this,

			changeYear = function(n){
				var year = calendar.nowTime.getFullYear();
				calendar.nowTime.setFullYear( year + n );
				
				try{
					self.calculate( calendar.nowTime );
				}catch(e){
					alert("您已超出规定范围，现在是"+ calendar.nowTime.getFullYear());
				}finally{
					self.render();
					self.dateClick();
				}
				
			},
			changeMonth = function(n){
				var month = calendar.nowTime.getMonth();
				calendar.nowTime.setMonth( month + n );
				
				try{
					self.calculate( calendar.nowTime );
				}catch(e){
					alert("您已超出规定范围，现在是"+ calendar.nowTime.getFullYear());
				}finally{
					self.render();
					self.dateClick();
				}
			};

		lastYear.onclick = function(){
			changeYear( -1 );
		};

		lastMonth.onclick = function(){
			changeMonth( -1 );
		} ;

		nextMonth.onclick  = function(){
			changeMonth( 1 );
		} ;

		nextYear.onclick = function(){
			changeYear( 1 );
		} ;

		lastYear = null;
		lastMonth = null;
		nextYear = null;
		nextMonth = null;
	},
	selecteChange(){//对日期下拉框进行改变监控 不会监控js对下拉框值进行的改变
		var self = this;

		this.selectMonth.onchange = function(){
			self.calendar.nowTime.setMonth( parseInt( this.value, 10 ) - 1 );
			self.calculate( self.calendar.nowTime );
			self.render();
			self.dateClick();
		};
		this.selectYear.onchange = function(){
			self.calendar.nowTime.setFullYear( parseInt( this.value, 10 ) );
			self.calculate( self.calendar.nowTime );
			self.render();
			self.dateClick();
		};
	},



};

var newCalendar = Object.create( calendarObj );
newCalendar.init();



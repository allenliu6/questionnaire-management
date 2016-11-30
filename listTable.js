/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
	}*/


var newTable = (function( w, undefined){

	var table = {
		tableBody: getId("tableBody"),//table tbody
		data : data,
		deleteQueue: [],
		
		//初始化函数集
		init(){
			this.render();
			this.addEvent();
			localStorage.qnData = JSON.stringify(this.data);
			console.log(this.data, localStorage.qnData);
		},

		//渲染tbody内容
		render(){
			var data = this.data;
			tableBody.innerHTML = "";
			for( let i = 0; data[i]; i++ ){
				data[i].status = data[i].deadline > parseInt( Date(), 10 )? "发布中" : "已结束";//通过日期比较判断状态
				tableBody.innerHTML += `<tr><td><input type="checkbox" name=""></td><td>${data[i].name}</td><td>${data[i].deadline}</td><td>${data[i].status}</td><td><button>编辑</button><button class="deleteBut">删除</button><button>查看数据</button></td>`;
			}
		},

		//全选全不选 删除按钮点击
		addEvent(){
			var checkbox = tableBody.getElementsByTagName( "input" ),
				chooseAll = getId( "chooseAll" ),
				select = function(){
					for( let i = 0; checkbox[i]; i++ ){
						checkbox[i].checked = "checked";
					}
					chooseAll.onclick = unselect;
				},
				unselect = function(){
					for( let i = 0; checkbox[i]; i++ ){
						checkbox[i].checked = "";
					}
					chooseAll.onclick = select;
				};
			//全选全不选设置
			chooseAll.onclick = select;

			//删除点击
			var deleteBut = [],
				deleteMore = getId( "deleteMore" ),
				_this = this;//this为调用对象 newTable
			deleteBut = deleteBut.concat( ...tableBody.getElementsByClassName( "deleteBut" ) );

			for( let i = 0; i < deleteBut.length; i++ ){
				deleteBut[i].onclick = (function (n){
					return function (){
						_this.__proto__.deleteQueue = [n];
						alertObj.windowInit( "listTable", _this.data[n].name,  _this );
					};
				})(i);
			}

			deleteMore.onclick = function(){
				var detail = "";
				_this.__proto__.deleteQueue = [];
				for( let i = 0; checkbox[i]; i++ ){
					if( checkbox[i].checked ){
						_this.__proto__.deleteQueue.push(i);

						detail += _this.data[i].name;
					}
				}
				if( detail ){
					alertObj.windowInit( "listTable", detail, _this );
					chooseAll.checked = "";
				}

			};

		},

		deleteDate(){
			var deleteQueue = this.deleteQueue;
			console.log(deleteQueue );
			for( let i = 0; i<deleteQueue.length; i++ ){
				this.data.splice( deleteQueue[i] - i, 1 );
				//彻底删除?  关于addEvent函数删除按钮 单选框的引用  全部删除后addEvent被回收吗？
			}
			this.init();
		}

	};

	var newTable = Object.create( table );
	return newTable;

})( window );

	
newTable.init();


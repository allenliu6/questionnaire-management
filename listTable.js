/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
	}*/


/*数据绑定  默认是登录弹出窗口  header只能存在文字和一个默认存在的关闭按钮  
				content可以有输入框或者文字  bottom可以设置多个按钮 
			//
			headerText: '',
			content:['','',]
			contentType: [0,1], 0字符串 1文本输入框 2数字输入框
			bottom:['','']  默认为确认取消按钮
			*/

var newTable = (function(w, undefined) {
	console.log(JSON.parse(localStorage.qnData), localStorage.editPaper);
	var table = {
		tableBody: getId("tableBody"), //table's tbody
		data: JSON.parse(localStorage.qnData),
		deleteQueue: [],//删除队列
		editQueue: 0,//编辑队列
		lastDone:'',

		//初始化函数集
		init() {
			this.render();
			this.addEvent();
			localStorage.qnData = JSON.stringify(this.data);
		},

		//重新渲染tbody内容，数据来源this.data
		render() {
			var data = this.data;
			tableBody.innerHTML = "",
				statusClass = "";//问卷状态变量
			for (let i = 0; data[i]; i++) {
				data[i].status = judgeDate(data[i].deadline) ? "发布中" : "已结束"; //通过日期比较support判断状态
				statusClass = data[i].status === "发布中" ? "greenColor" : "";
				tableBody.innerHTML += `<tr><td><input type="checkbox" name=""></td>
					<td>${data[i].name}</td><td>${data[i].deadline}</td>
					<td class=${statusClass}>${data[i].status}</td>
					<td><button class="editBut">编辑</button><button class="deleteBut">删除</button><button>查看数据</button></td>`;
			}
		},

		//添加事件 全选全不选 删除按钮点击
		addEvent() {
			this.bindDelete()
			this.bindEdit()
			this.bindSelect()
			this.bindSetter()
		},

		bindSetter(){
			let _this = this;
			alertObj.eventBus = {
				set value(x){
					if(x[0]){
						switch(_this.lastDone){
							case 'edit': 
								_this.edit();
								break;
							
							case 'delete':
								_this.delete()
								break;

							case 'deleteMore':
								_this.delete()
								break;
						}
					}
				}
			}
		},

		bindSelect(){
				this.checkbox = tableBody.getElementsByTagName("input");
				this.chooseAll = getId("chooseAll");
				_this = this;

				this.select = function() {
					for (let i = 0; _this.checkbox[i]; i++) {
						_this.checkbox[i].checked = "checked";
					}
					_this.chooseAll.onclick = _this.unselect;
				},
				this.unselect = function() {
					for (let i = 0; _this.checkbox[i]; i++) {
						_this.checkbox[i].checked = "";
					}
					_this.chooseAll.onclick = _this.select;
				};
			//全选全不选设置
			this.chooseAll.onclick = _this.select;
		},

		bindDelete(){
			//删除点击
			var deleteBut = [],
				deleteMore = getId("deleteMore"),//多项删除按钮
				_this = this; //this为当前函数对象 addEvent
			deleteBut = deleteBut.concat(...tableBody.getElementsByClassName("deleteBut"));

			for (var i = 0, length = deleteBut.length; i < length; i++) {
				deleteBut[i].onclick = (function(n) {
					return function() {
						_this.deleteQueue = [n];//记录当前是第几个点击了删除按钮
						_this.lastDone = 'delete'
						alertObj.init({
							content: [`是否删除 ${_this.data[n].name} 问卷`],
							contentType: [0],
						});
					};
				})(i);
			}
			deleteBut = null;

			//删除多个
			deleteMore.onclick = function() {
				var detail = "";//承载传递给alert的content信息
				_this.deleteQueue = [];//重置删除队列
				_this.lastDone = 'deleteMore'
				for (let i = 0; _this.checkbox[i]; i++) {//遍历全部多选框，查看是否选中
					if (_this.checkbox[i].checked) {
						_this.deleteQueue.push(i);
						_this.checkbox[i].checked = '';
						_this.chooseAll.onclick = _this.select;
						detail += (_this.data[i].name + " ");
					}
				}
				if (detail) {
					alertObj.init({
						content: [`是否删除 ${detail} 问卷`],
						contentType: [0],
					});
					_this.chooseAll.checked = "";
				}
			};
		},

		bindEdit(){
			//编辑点击
			var editButs = [],
				_this = this;
			editButs = editButs.concat(...tableBody.getElementsByClassName("editBut"));

			for (var i = 0, length = editButs.length; i < length; i++) {
				editButs[i].onclick = (function(n) {
					return function() {
						_this.editQueue = n;//记录当前是第几个点击了编辑按钮
						_this.lastDone = 'edit'
						alertObj.init({
							content: [`是否编辑 ${_this.data[n].name} 问卷`],
							contentType: [0],
						});
					};
				})(i);
			}
		},

		delete() {
			var deleteQueue = this.deleteQueue;
			for (var i = 0, length = deleteQueue.length; i < length; i++) {
				this.data.splice(deleteQueue[i] - i, 1);
				//彻底删除?  关于addEvent函数删除按钮 单选框的引用  全部删除后addEvent被回收吗？ 应该不会
			}
			this.init();
		},

		edit() { //把要编辑的数据提取出来赋值给editPaper  跳转页面
			localStorage.editPaper = JSON.stringify(this.data.splice(this.editQueue, 1)[0]);
			localStorage.qnData = JSON.stringify(this.data);
			location.href = "createTool.html";
		},

	};

	var newTable = Object.create(table);
	return newTable;

})(window);


newTable.init();
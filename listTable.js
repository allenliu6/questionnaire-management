/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
	}*/


var newTable = (function(w, undefined) {
	console.log(JSON.parse(localStorage.qnData), localStorage.editPaper);
	var table = {
		tableBody: getId("tableBody"), //table's tbody
		data: JSON.parse(localStorage.qnData),
		deleteQueue: [],//删除队列
		editQueue: 0,//编辑队列

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
			var checkbox = tableBody.getElementsByTagName("input"),
				chooseAll = getId("chooseAll"),

				select = function() {
					for (let i = 0; checkbox[i]; i++) {
						checkbox[i].checked = "checked";
					}
					chooseAll.onclick = unselect;
				},
				unselect = function() {
					for (let i = 0; checkbox[i]; i++) {
						checkbox[i].checked = "";
					}
					chooseAll.onclick = select;
				};
			//全选全不选设置
			chooseAll.onclick = select;

			//删除点击
			var deleteBut = [],
				deleteMore = getId("deleteMore"),//多项删除按钮
				_this = this; //this为当前函数对象 addEvent
			deleteBut = deleteBut.concat(...tableBody.getElementsByClassName("deleteBut"));

			for (var i = 0, length = deleteBut.length; i < length; i++) {
				deleteBut[i].onclick = (function(n) {
					return function() {
						_this.deleteQueue = [n];//记录当前是第几个点击了删除按钮
						alertObj.init({
							obj: _this,
							content: [`是否删除 ${_this.data[n].name} 问卷`],
							contentType: [0],
							bottomFunc: [_this.delete, '']//为alert的button传入删除函数
						});
					};
				})(i);
			}
			deleteBut = null;

			/*数据绑定  默认是登录弹出窗口  header只能存在文字和一个默认存在的关闭按钮  
				content可以有输入框或者文字  bottom可以设置多个按钮 
			//
			headerText: '',
			content:['','',]
			contentNum:[2,1]//对应content数量，默认为1
			contentType: [0,1], 0字符串 1文本输入框 2数字输入框
			bottom:['',''] 默认为
			*/


			//删除多个
			deleteMore.onclick = function() {
				var detail = "";//承载传递给alert的content信息
				_this.deleteQueue = [];//重置删除队列
				for (let i = 0; checkbox[i]; i++) {//遍历全部多选框，查看是否选中
					if (checkbox[i].checked) {
						_this.deleteQueue.push(i);
						checkbox[i].checked = '';
						chooseAll.onclick = select;
						detail += (_this.data[i].name + " ");
					}
				}
				if (detail) {
					alertObj.init({
						obj: _this,
						content: [`是否删除 ${detail} 问卷`],
						contentType: [0],
						bottomFunc: [_this.delete, '']
					});
					chooseAll.checked = "";
				}
			};

			//编辑点击
			var editButs = [];
			editButs = editButs.concat(...tableBody.getElementsByClassName("editBut"));

			for (var i = 0, length = editButs.length; i < length; i++) {
				editButs[i].onclick = (function(n) {
					return function() {
						_this.editQueue = n;//记录当前是第几个点击了编辑按钮
						alertObj.init({
							obj: _this,
							content: [`是否编辑 ${_this.data[n].name} 问卷`],
							contentType: [0],
							bottomFunc: [_this.edit, '']//传递给alert的编辑函数
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
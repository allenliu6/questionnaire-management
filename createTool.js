/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30",
		content:[{title:"试验",type:0 单选 1 多选 2 文本 ,option:[]},]
		
	}*/
//localStorge与createTool之间的数据联通


var createTool = function(w, undefined) {

	var createTool = {
		paperContent: getId("paperContent"),
		lastType: 0, //上次点击类型选项
		data: { //一个问卷的数据结构
			name: "",
			deadline: "",
			content: []
		},
		init() { //函数初始化  检查是否是编辑才跳转 如果是则对data进行初始化再进行渲染页面绑定事件
			if (localStorage.editPaper) {
				this.data = JSON.parse(localStorage.editPaper)
				this.renderQuestion(); //重新刷新页面
				this.renderTitleDate();
			}
			this.addBasicEvents();//为原HTML页面所有可点击元素添加事件

		},

		addBasicEvents() { //为HTML页面结构所有可点击元素添加事件
			var createBody = getId("createBody"),
				setTitle = getId("setTitle"),
				addQuestion = getId("addQuestion"),
				questionType = getId("questionType"),
				questionTypes = questionType.getElementsByTagName('button'),
				storeQues = getId("storeQues"),
				pushQues = getId("pushQues"),
				_this = this;

			setTitle.onclick = function() {//初始化标题
				setTitle.value = "";
				setTitle.onclick = null;
				setTitle = null;
			};

			addQuestion.onclick = function() {
				questionType.style.display = "block";
				addQuestion.onclick = null;
				addQuestion = null;
			};

			questionTypes[0].onclick = function() {
				alertObj.init({
					headerText: '单选题详情单',
					content: ['请输入问题标题和问题选项，问题选项以 ”，“ 为分隔','标题', '内容'],
					contentType: [0,1,1],
				});
				_this.lastType = 0;
			};

			questionTypes[1].onclick = function() {
				alertObj.init({
					headerText: '多选题详情单',
					content: ['请输入问题标题和问题选项，问题选项以 ”，“ 为分隔','标题', '内容'],
					contentType: [0,1,1],
				});
				_this.lastType = 1;
			};

			questionTypes[2].onclick = function() {
				alertObj.init({
					headerText: '文本题详情单',
					content: ['请输入问题标题','标题'],
					contentType: [0,1],
				});
				_this.lastType = 2;
			};

			storeQues.onclick = function() {
				_this.storeQues();
			};

			pushQues.onclick = function() {
				if (_this.storeQues()) {
					_this.pushQues();
				}
			};

			//设置set绑定value，如果在alert中发生变化则进行输入处理
			//value = [boolean, [title, option]]  第一参数为title，第二个参数为option
			alertObj.eventBus = {
				set value(x){
					if(x[0]){
						_this.inputHandle(x[1][0],x[1][1])
					}
				}
			}

			questionTypes = null;
			storeQues = null;
			pushQues = null;
		},

		renderQuestion() { //重新刷新所有问卷内容部分
			var content = this.data.content,
				optionHTML = "",
				inputType;

			for (var j = 0; content[j]; j++) {
				inputType = this.getInputType(content[j].type);

				optionHTML += `<div class="questionDetail"><p>Q${ j+1 }</p>
								<div class="detailRight"><div>${ content[j].title }</div>`;

				if (content[j].type == 2) { //如果上次点击为文本框即为文本框
					optionHTML += `<textarea></textarea>`;
					content[j].option.length = 0;
				}

				for (var i = 0; i < content[j].option.length; i++) {
					optionHTML += `<div><input type=${ inputType }>${ content[j].option[i] }</div>`;
				}

				optionHTML += `<div><a class="moveUp">上移</a><a class="moveDown">下移</a>
									<a class="copy">复用</a><a class="deleteDom">删除</a></div></div></div>`;
			}

			this.paperContent.innerHTML = optionHTML;
			this.addDetailEvents();
		},

		renderTitleDate() {//若是编辑行为则渲染问卷名称和截止日期
			var title = this.data.name,
				deadline = this.data.deadline,
				setTitle = getId("setTitle"),
				setDate = getId("dateInput");

			setTitle.value = title;
			setDate.value = deadline;

		},

		addDetailEvents() { //给可以进行四种操作的问题内容元素 显式绑定四种行为函数
			var moveUps = this.paperContent.getElementsByClassName("moveUp"),
				moveDowns = this.paperContent.getElementsByClassName("moveDown"),
				copys = this.paperContent.getElementsByClassName("copy"),
				deleteDoms = this.paperContent.getElementsByClassName("deleteDom"),
				_this = this;

			for (var i = 1; moveUps[i]; i++) {
				moveUps[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.moveUp.call(_this, n);
					};
				})(i);
			}

			for (var i = 0, length = moveDowns.length - 1; i < length; i++) {
				moveDowns[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.moveDown.call(_this, n);
					};
				})(i);
			}

			for (i = 0; copys[i]; i++) {
				copys[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.copy.call(_this, n);
					};
				})(i);
			}

			for (i = 0; deleteDoms[i]; i++) {
				deleteDoms[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.deleteDom.call(_this, n);
					};
				})(i);
			}

			deleteDoms = null;
			copys = null;
			moveDowns = null;
			moveUps = null;
		},


		/*
			支持事件绑定的函数
		 */
		inputHandle(title, option) { //创建数据处理  弹出窗口的回调

			var optionArr = option ? option.split("，") : [],
				number = this.data.content.length;
			this.data.content[number] = {};
			var newQuestion = this.data.content[number];
			newQuestion.title = title;
			newQuestion.type = this.lastType;
			newQuestion.option = optionArr;
			console.log(this.data.content);

			this.renderQuestion();
		},

		getInputType(type) { //获取问题类型
			var inputType = "";

			switch (type) {
				case 0:
					inputType = "radio";
					break;
				case 1:
					inputType = "checkbox";
					break;
				case 2:
					break;
			};

			return inputType;
		},

		fourOperate: { //问卷问题的四种操作 上移下移复用删除
			moveUp(num) {
				var changeData = this.data.content[num];
				this.data.content[num] = this.data.content[num - 1];
				this.data.content[num - 1] = changeData;
				this.renderQuestion();
			},
			moveDown(num) {
				var changeData = this.data.content[num];
				this.data.content[num] = this.data.content[num + 1];
				this.data.content[num + 1] = changeData;
				this.renderQuestion();
			},
			deleteDom(num) {
				this.data.content.splice(num, 1);
				this.renderQuestion();
			},
			copy(num) {
				this.data.content.splice(num, 0, this.data.content[num]);
				this.renderQuestion();
			}
		},

		storeQues() { //保存按钮   先检查日期 在检查问卷名称 检查问卷题目的数目 检查每个问题的问题描述和选项是否为空 若全部通过验证则弹出窗口返回true
			var dateInput = getId("dateInput"),
				setTitle = getId("setTitle"),
				data = this.data;
			data.deadline = dateInput.value;
			data.name = setTitle.value;

			//检查数据是否合格
			if (data.deadline) { 
				if (data.name) {
					if (data.content.length) {
						for (var i = 0, content = data.content; content[i]; i++) {
							if (!content[i].title || !content[i].option) {
								alert(`请不要在第${i+1}个问题中少填写`);
							}
						}

						alert("操作成功");
						localStorage.editPaper = JSON.stringify(data);
						return true;
						
					} else {
						alert(`请添加问卷题目`);
					}
				} else {
					alert("请输入正确问卷名称");
				}
			} else {
				alert("请输入正确的日期");
			}
		},

		pushQues() { //发布按钮   给localStorage的qnData赋值 移除编辑项即localStorage.editPaper 跳转页面
			var data = JSON.parse(localStorage.qnData);
			data.push(this.data);

			localStorage.qnData = JSON.stringify(data);
			localStorage.removeItem("editPaper");
			location.href = "index.html"
		},

	};


	var newCreate = Object.create(createTool);
	return newCreate;

}(window);

createTool.init();
/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30",
		content:[{title:"试验",type:0 单选 1 多选 2 文本 ,option:[]},]
		
	}*/
//localStorge与createTool之间的数据联通


var createTool = function(w, undefined) {
	//console.log(JSON.parse(localStorage.qnData));
	/*
		support
	*/

	var createTool = {
		paperContent: getId("paperContent"),
		lastType: 0, //上次点击类型选项
		data: { //一个问卷的数据结构
			name: "",
			deadline: "",
			content: []
		},
		init() { //函数初始化
			if ( localStorage.editPaper ) {
				console.log(this.data)
				this.data = JSON.parse(localStorage.editPaper)
				this.renderQuestion();
				this.renderTitleDate();
			}
			this.addBasicEvents();

		},
		addBasicEvents() { //为页面所有可点击元素添加事件
			var createBody = getId("createBody"),
				setTitle = getId("setTitle"),
				addQuestion = getId("addQuestion"),
				questionType = getId("questionType"),
				questionTypes = questionType.getElementsByTagName('button'),
				storeQues = getId("storeQues"),
				pushQues = getId("pushQues"),
				_this = this;

			setTitle.onclick = function() {
				setTitle.value = "";
				setTitle.onclick = null;
				setTitle = null;
			};

			addQuestion.onclick = function() {
				questionType.style.display = "block";
				addQuestion = null;
			};

			questionTypes[0].onclick = function() {
				alertObj.windowInit("input", "单选", _this);
				_this.lastType = 0;
			};

			questionTypes[1].onclick = function() {
				alertObj.windowInit("input", "多选", _this);
				_this.lastType = 1;
			};

			questionTypes[2].onclick = function() {
				alertObj.windowInit("input", "文本", _this);
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

			questionTypes = null;
		},

		inputHandle(title, option) { //创建数据处理

			var optionArr = option ? option.split(",") : [],
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

		renderQuestion() { //重新刷新页面
			var content = this.data.content,
				optionHTML = "",
				inputType;

			console.log(this.data.content);
			for (var j = 0; content[j]; j++) {
				inputType = this.getInputType(content[j].type);

				optionHTML += `<div class="questionDetail"><p>Q${ j+1 }</p><div class="detailRight"><div>${ content[j].title }</div>`;

				if (content[j].type == 2) { //如果上次点击为文本框即为文本框
					optionHTML += `<textarea></textarea>`;
					content[j].option.length = 0;
				}

				for (var i = 0; i < content[j].option.length; i++) {
					optionHTML += `<div><input type=${ inputType }>${ content[j].option[i] }</div>`;
				}

				optionHTML += `<div><a class="moveUp">上移</a><a class="moveDown">下移</a><a class="copy">复用</a><a class="deleteDom">删除</a></div></div></div>`;
			}

			this.paperContent.innerHTML = optionHTML;
			this.addDetailEvents();
		},

		renderTitleDate() {
			var title = this.data.name,
				deadline = this.data.deadline,
				setTitle = getId("setTitle"),
				setDate = getId("dateInput");

			setTitle.value = title;
			setDate.value = deadline;

		},

		addDetailEvents() { //给当前进行四种操作的元素显式绑定函数
			var moveUp = this.paperContent.getElementsByClassName("moveUp"),
				moveDown = this.paperContent.getElementsByClassName("moveDown"),
				copy = this.paperContent.getElementsByClassName("copy"),
				deleteDom = this.paperContent.getElementsByClassName("deleteDom"),
				_this = this;

			for (var i = 1; moveUp[i]; i++) {
				moveUp[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.moveUp.call(_this, n);
					};
				})(i);
			}

			for (var i = 0, length = moveDown.length - 1; i < length; i++) {
				moveDown[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.moveDown.call(_this, n);
					};
				})(i);
			}

			for (i = 0; copy[i]; i++) {
				copy[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.copy.call(_this, n);
					};
				})(i);
			}

			for (i = 0; deleteDom[i]; i++) {
				deleteDom[i].onclick = (function(n) {
					return function() {
						_this.fourOperate.deleteDom.call(_this, n);
					};
				})(i);
			}

			deleteDom = null;
			copy = null;
			moveDown = null;
			moveUp = null;
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

		storeQues() {
			var dateInput = getId("dateInput"),
				setTitle = getId("setTitle"),
				data = this.data;
			data.deadline = dateInput.value;
			data.name = setTitle.value;

			console.log(Date.parse(data.deadline));
			//检查数据是否合格
			if (data.deadline) { //?日期验证
				if (data.name) {
					if (data.content.length) {
						for (var i = 0, content = data.content; content[i]; i++) {
							if (!content[i].title || !content[i].option) {
								alert(`请不要在第${i+1}个问题中少填写`);
							}
						}
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

			console.log(this.data);
		},

		pushQues() {
			console.log(JSON.parse(localStorage.qnData));
			var data = JSON.parse(localStorage.qnData);
			data.push(this.data);

			localStorage.qnData = JSON.stringify(data);
			localStorage.removeItem("editPaper");
			location.href = "task50.html"
		},

	};


	var newCreate = Object.create(createTool);
	return newCreate;

}(window);

createTool.init();
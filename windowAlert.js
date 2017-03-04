const alertObj = function(w) {

	const alertModule = {
		//
		//support
		//

		//对象消失
		disappear(dis) {
			this.win.style.display = dis;
			this.shadow.style.display = dis;
		},

		//show函数事件绑定
		addEvents(obj, event, dis) {
			const self = this;
			obj.addEventListener(event, function() {
				self.disappear(dis)
			});
		},

		//处理传参
		createContent({content, contentType}) {
			let str = '';

			for (let i of content.keys()) {
					switch (contentType[i]) {
						case 0:
							{
								str += content[i] + '</br></br>';
								break;
							}
						case 1:
							{
								str += `<label for="title">${content[i]}</label>&nbsp;
							<input type="text" name="title" placeholder="请输入文本"><br>`;
								break;
							}
						case 2:
							{
								str += `<label for="password">${content[i]}</label>&nbsp;
							<input type="password" name="password" placeholder="请输入数字"><br>`;
								break;
							}
					}
			}
			return str;
		},

		//创建按钮
		createBottom(obj) {
			let str = '';
			for (let i of obj) {
				str += `<button>${i}</button>`;
			}
			return str;
		},

		//窗口单例
		createNew() {

			this.shadow = document.createElement('div');
			this.win = document.createElement("div");

			this.shadow.id = 'shadow';
			this.win.id = 'window';

			document.body.appendChild(this.shadow);
			document.body.appendChild(this.win);

			this.isCreate = true;
		},


		//弹出窗口初始化 基本HTML 位置信息 绑定事件
		init({
			headerText = '提示',
			content,
			contentType = [1, 1, 1, 1, 1],
			bottom = ['确定', '取消'],
		}) {

			/*数据绑定  默认是登录弹出窗口  header只能存在文字和一个默认存在的关闭按钮  content可以有输入框或者文字  bottom可以设置多个按钮 
			//
			headerText: '', 默认为提示
			content:['','',] 名称或文字
			contentType: [0，1], 0单纯字符串一般用来表达警示  1文本输入框 2数字输入框
			bottom:['',''],
			*/

			//只创建一次
			if (!this.isCreate) {
				this.createNew();
			}

			//添加Window的HTML
			this.win.innerHTML = `
				<div id="header"><span>${headerText}</span><input type="button" id="closeWindow" value="X"></div>
				<div class="content"><div>${this.createContent({content,contentType})}</div></div><div class="bottom">${this.createBottom(bottom)}</div>`;

			let self = this,
				closeWindow = getId("closeWindow"),
				btns = this.win.getElementsByTagName('button'),
				inputs = this.win.getElementsByTagName('input');
			
			//过滤正确input
			inputs = [inputs[1] ? inputs[1] : {value: 'random'}, inputs[2] ? inputs[2] : {value: 'textArea'}]
				
			//window位置初始化
			this.win.style.left = parseInt(document.body.clientWidth, 10) / 2 - parseInt(getStyle(this.win, "width")) / 2 + "px";
			this.win.style.top = parseInt(document.body.clientHeight, 10) / 2 - parseInt(getStyle(this.win, "height")) / 2 + "px";
			this.shadow.style.height = document.documentElement.scrollHeight + 'px';

			this.win.style.display = 'block';
			this.shadow.style.display = 'block';


			//添加改变window和shadow事件
			this.addEvents(this.shadow, "click", "none");
			this.addEvents(closeWindow, "click", "none");
			this.addEvents(btns[1], "click", "none");
			

			//为确认和取消添加按钮事件
			btns[0].onclick = function(){
				let arr = [];
				for(let i of inputs){
					if( !i.value ){
						window.alert('请输入正确内容');
						return 
					}
					arr.push(i.value)
				}
				self.disappear('none');
				self.eventBus.value =  [true, arr]
				console.log(self.eventBus.value, [true, arr])
			}
		},
	};

	const alert = Object.create(alertModule);
	return alert;

}(window);
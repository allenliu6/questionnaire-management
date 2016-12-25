const alertObj = function(w) {

	const alertModule = {

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
		createContent(obj) {
			let num = 0,
				str = '';

			for (let i of obj.content.keys()) {
				while (num < obj.contentNum[i]) {
					switch (obj.contentType[i]) {
						case 0:
							{
								str += obj.content[i] + '</br></br>';
								break;
							}
						case 1:
							{
								str += `<label for="username">${obj.content[i]}</label>&nbsp;
							<input type="text" name="username" placeholder="请输入文本"><br>`;
								break;
							}
						case 2:
							{
								str += `<label for="password">${obj.content[i]}</label>&nbsp;
							<input type="password" name="password" placeholder="请输入数字"><br>`;
								break;
							}
					}

					num++
				}
				num = 0;
			}

			return str;
		},

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



		init({
			obj,
			headerText = '提示',
			content,
			contentNum = [1, 1, 1, 1, 1],
			contentType = [1, 1, 1, 1, 1],
			bottom = ['确定', '取消'],
			bottomFunc,
		}) {

			/*数据绑定  默认是登录弹出窗口  header只能存在文字和一个默认存在的关闭按钮  content可以有输入框或者文字  bottom可以设置多个按钮 
			//
			headerText: '', 默认为提示
			content:['','',] 名称或文字
			contentNum:[2,1]//对应content数量，默认为1
			contentType: [0，1], 0字符串 1文本输入框 2数字输入框
			bottom:['',''],
			buttonFunc :[]  按钮的回调函数
			*/

			//只创建一次
			if (!this.isCreate) {
				this.createNew();
			}
			//默认参数
			for (let i in bottom) {
				if (!bottomFunc[i]) {
					let self = this;
					bottomFunc[i] = function() {
						self.disappear('none')
					};
				}
			}
			const _this = this;

			this.win.innerHTML = `
			<div id="header"><span>${headerText}</span><input type="button" name="" id="closeWindow" value="X"></div><div class="content"><div>${this.createContent({content,contentNum,contentType})}</div></div><div class="bottom">${this.createBottom(bottom)}</div>`;


			this.closeWindow = getId("closeWindow");


			//window位置初始化
			this.win.style.left = parseInt(document.body.clientWidth, 10) / 2 - parseInt(getStyle(this.win, "width")) / 2 + "px";
			this.win.style.top = parseInt(document.body.clientHeight, 10) / 2 - parseInt(getStyle(this.win, "height")) / 2 + "px";
			this.shadow.style.height = document.documentElement.scrollHeight + 'px';


			this.win.style.display = 'block';
			this.shadow.style.display = 'block';


			//添加改变window和shadow事件
			this.addEvents(this.shadow, "click", "none");
			this.addEvents(this.closeWindow, "click", "none");

			//添加按钮事件
			const btns = this.win.getElementsByTagName('button'),
					inputs = this.win.getElementsByTagName('input');

			for (let i in bottom) {

				btns[i].onclick = (function() {
					return function() {
						bottomFunc[i].call(obj, contentType[1] && inputs[1].value , contentType[2] && inputs[2].value);
						_this.disappear('none');
					}
				})(i);
			}

		},
	};

	const alert = Object.create(alertModule);

	return alert;

}(window);
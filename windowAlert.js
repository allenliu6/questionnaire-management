/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
	}*/



	//弹出窗口主类
var alertObj = (function(){

	var winAlert = {
    	iscreated: false,
    	windowDom : getId( "windowDom" ),//主domdiv
		shadow : getId( "shadow" ),//阴影
		closeWindow : getId( "closeWindow" ),//关闭按钮
		windowContent: getId( "windowContent" ),//窗口主体
		buttons: getId( "windowBottom" ).getElementsByTagName( "button" ),//返回按钮
		windowTitle: getId("addTypeText") || null,
		quesContent: getId("quesContent") || null,
		iscreated: false,//当前页面窗口是否已经创建

		//添加事件包装函数
		addEvents( obj, event ){
			var _this = this;
			obj.addEventListener( event, function(){
				_this.windowDom.style.display = "none";
			});
		},

		//listTable专属函数
		listTable( content, self ){
			this.windowContent.innerHTML = content;
		},

		//createTool专属函数
		createTool( title ){
			this.windowTitle.innerHTML = "添加" + title;
			if( title === "文本" ){
				this.quesContent.parentNode.style.display = "none";
			}
		},

		//初始化 
    	windowInit( strategy, content, self ){//传递第三个参数为引用window的主体对象
    		_this = this;
			_this.quesContent.parentNode.style.display = "block";//优化点 保证每次打开都会恢复上一次可能会被createTool函数造成的选项输入框消失情况

			this.windowDom.style.display = "block";
			this[ strategy ]( content );


			if(!this.iscreated){
				this.addEvents( this.buttons[1], "click" );
				this.addEvents( shadow, "click" );
				this.addEvents( closeWindow, "click" );
				this.addEvents( this.buttons[0], "click" );
				this.iscreated = true;
				if( strategy === "listTable" ){//可节约开销
					this.buttons[0].addEventListener( "click", function(){
						self.deleteDate();
					});
				}else{
					this.buttons[0].addEventListener( "click", function(){

						var quesTitle = getId("quesTitle");
					
						self.inputHandle( quesTitle.value, _this.quesContent.value );
						_this.quesContent.value = "";
						quesTitle.value = "";

					});
				}
			}
		},
		
	};

	var alertObj = Object.create( winAlert );
	return alertObj;

})( window );   
	
	
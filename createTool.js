/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 ,option:[]},]
		
	}*/
//localStorge与createTool之间的数据联通


(function( w, undefined){
	console.log( JSON.parse(localStorage.qnData) );
    /*
		support
	*/

	var createToll = {
		paperContent: getId("paperContent"),
		lastType: 0,//上次点击类型选项
		data: {
			name:"",
			deadline:"",
			content:[]
		},
		init(){
			this.addBasicEvents();
			
		},
		addBasicEvents(){
			var createBody = getId("createBody"),
				setTitle = getId("setTitle"),
				addQuestion = getId("addQuestion"),
				questionType = getId("questionType"),
				questionTypes = questionType.getElementsByTagName('button'),
				windowDom = getId("windowDom"),
				goListTable = getId("goListTable"),
				_this = this
				;

			setTitle.onclick = function(){
				setTitle.value = "";
				setTitle = null;
			};

			addQuestion.onclick = function(){
				questionType.style.display = "block";
				addQuestion = null;
			};

			questionTypes[0].onclick = function(){
				alertObj.windowInit( "createTool", "单选", _this );
				_this.lastType = 0;
			};

			questionTypes[1].onclick = function(){
				alertObj.windowInit( "createTool", "多选", _this );
				_this.lastType = 1;
			};

			questionTypes[2].onclick = function(){
				alertObj.windowInit( "createTool", "文本", _this );
				_this.lastType = 2;
			};

			questionTypes = null;
		},

		inputHandle( title, option ){

			var optionArr = option ? option.split( "," ) : [],
			number = this.data.content.length;
			this.data.content[ number ] = {};
			var newQuestion = this.data.content[ number ];
			newQuestion.title = title;
			newQuestion.type = this.lastType;
			newQuestion.option = optionArr;
			console.log(this.data.content);

			this.renderQuestion();

		},

		getInputType( type ){
			var inputType = "";

			switch( type ){
				case 0: 
					inputType = "radio";break;
				case 1: 
					inputType = "checkbox";break;
				case 2: 
					break;
			};

			return inputType;
		},

		renderQuestion(){
			var content = this.data.content,
				optionHTML = "",
				inputType;

			console.log(this.data.content);
			for( var j = 0; content[j]; j++){
				inputType = this.getInputType( content[j].type );

				optionHTML += `<div class="questionDetail"><p>Q${ j+1 }</p><div class="detailRight"><div>${ content[j].title }</div>`;

				if( content[j].option.length == 0 ){//如果选项框输入为空即为文本框
					optionHTML += `<textarea></textarea>`;
					content[j].option.length = 0;
				}

				for( var i = 0; i < content[j].option.length; i++ ){
					optionHTML += `<div><input type=${ inputType }>${ content[j].option[i] }</div>`;
				}

				optionHTML += `<div><a class="moveUp">上移</a><a class="moveDown">下移</a><a class="copy">复用</a><a class="deleteDom">删除</a></div></div></div>`;
			}

			this.paperContent.innerHTML = optionHTML;
			this.addDetailEvents();
		},

		addDetailEvents(){
			var moveUp = this.paperContent.getElementsByClassName("moveUp"),
				moveDown = this.paperContent.getElementsByClassName("moveDown"),
				copy = this.paperContent.getElementsByClassName("copy"),
				deleteDom = this.paperContent.getElementsByClassName("deleteDom"),
				_this = this;

			for( var i = 1; moveUp[i]; i++ ){
				moveUp[i].onclick = (function( n ){
					return function(){
						_this.fourOperate.moveUp.call( _this, n );
					};
				})(i);
			}

			for( var i = 0, length = moveDown.length-1; i < length; i++){
				moveDown[i].onclick = (function( n ){
					return function(){
						_this.fourOperate.moveDown.call( _this, n );
					};
				})(i);
			}

			for( i = 0; copy[i]; i++ ){
				copy[i].onclick = (function( n ){
					return function(){
						_this.fourOperate.copy.call( _this, n );
					};
				})(i);
			}

			for( i = 0; deleteDom[i]; i++ ){
				deleteDom[i].onclick = (function( n ){
					return function(){
						_this.fourOperate.deleteDom.call( _this, n );
					};
				})(i);
			}

			deleteDom = null;
			copy = null;
			moveDown = null;
			moveUp = null;
		},

		fourOperate:{
			moveUp( num ){
				var changeData = this.data.content[num];
				this.data.content[ num ] = this.data.content[ num-1 ];
				this.data.content[ num-1 ] = changeData;
				this.renderQuestion();
			},
			moveDown( num ){
				var changeData = this.data.content[num];
				this.data.content[ num ] = this.data.content[ num+1 ];
				this.data.content[ num+1 ] = changeData;
				this.renderQuestion();
			},
			deleteDom( num ){
				this.data.content.splice( num, 1 );
				this.renderQuestion();
			},
			copy( num ){
				this.data.content.splice( num, 0, this.data.content[num] );
				this.renderQuestion();
			}
		},

	};

	 
	var newCreate = Object.create(createToll);
	newCreate.init();


})(window);


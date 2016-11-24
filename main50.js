/*{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
		}*/



(function( w, undefined){
	//id获取元素
	var getId = function ( id ){
		return document.getElementById( id );
	};

	//嗅探 获取元素内嵌和外联样式
	var getStyle = function(oDiv, attr){
        if(oDiv.currentStyle){
            //针对IE浏览器
            return oDiv.currentStyle[attr];
        }else{
            //Firefox浏览器
            return getComputedStyle(oDiv, false)[attr];
        }
    };console.log(1);
    /*
		support
	*/


	var data = [{
		name:"问卷1",
		deadline:"2016-11-30 11:11:11",
		content:[{title:"试验", type:1, option:["正确","错误"]}]
	},{
		name:"问卷1",
		deadline:"2016-11-30 11:11:11",
		content:[{title:"试验", type:1, option:["正确","错误"]}]
	}]

	var table = {
		tableBody: getId("tableBody"),
		data : data,
		
		render(){
			var data = this.data;
			
			for( let i = 0; data[i]; i++ ){
				data[i].status = data[i].deadline > parseInt( Date(), 10 )? "发布中" : "已结束";
				tableBody.innerHTML += `<tr><td><input type="checkbox" name=""></td><td>${data[i].name}</td><td>${data[i].deadline}</td><td>${data[i].status}</td><td><button>编辑</button><button class="deleteBut">删除</button><button>查看数据</button></td>`;
			}
		},
		init(){
			this.render();
			this.addEvent();

		},
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
				deleteMore = getId( "deleteMore" );
			deleteBut = deleteBut.concat( ...tableBody.getElementsByClassName( "deleteBut" ) );
			for( let i = 0; i < deleteBut.length; i++ ){
				deleteBut[i].addEventListener( "click", function (){
					alertObj.windowInit( );
				});
			} 
			deleteMore.addEventListener( "click", function(){
				for( let i = 0; checkbox[i]; i++ ){
					if( !checkbox[i].checked ){
						alertObj.windowInit();
					}
				}
				alertObj.windowInit();

			});
		}

	};

	//弹出窗口主类
    var winAlert = {
    	iscreated: false,
    	windowDom : getId( "windowDom" ),
		shadow : getId( "shadow" ),
		closeWindow : getId( "closeWindow" ),
		returnBtn: getId( "windowBottom" ).getElementsByTagName( "button" )[1],
		addEvents( obj, event ){
			var _this = this;
			obj.addEventListener( event, function(){
				_this.windowDom.style.display = "none";
			});
		},
    	windowInit(){
			this.windowDom.style.display = "block";

			if(!this.iscreated){
				this.addEvents( this.returnBtn, "click" );
				this.addEvents( shadow, "click" );
				this.addEvents( closeWindow, "click" );
				this.iscreated = true;
			}
		},
		
	};

	var alertObj = Object.create( winAlert );

	var newTable = Object.create( table );
	newTable.init();
})( window )


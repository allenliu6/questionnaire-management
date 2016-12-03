/*	问卷格式JSON{
		name:"问卷1",
		deadline:"2016-04-30 11:11:11",
		content:[{title:"试验",type:1 单选 2 多选 3 文本 -->,option:[]},]
		
	}*/


		//id获取元素
		var getId = function ( id ){
			return document.getElementById( id ) || null;
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
	    };

	    //传入符合一定格式的日期 未来日期返回true 过去日期返回false
	    var judgeDate = function( date ){
			var nowTime = new Date(),
				setDate = new Date(date);

			if(setDate.getTime() > nowTime.getTime()){
				return true;
			}
			return false;
		};

	    /*//dom在之后插入
	    function insertAfter(newEl, targetEl){
	        var parentEl = targetEl.parentNode;
	                
	       	if(parentEl.lastChild == targetEl){
	            parentEl.appendChild(newEl);
	        }else{
	            parentEl.insertBefore(newEl,targetEl.nextSibling);
	        }            
	    }*/
	    /*
			support
		*/
	
		if(!localStorage.qnData){
			localStorage.qnData = JSON.stringify([{
				name:"问卷1",
				deadline:"2016-11-30",
				content:[{title:"试验", type:1, option:["正确","错误"]}]
			}]);
		}



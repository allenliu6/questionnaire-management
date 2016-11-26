/*	问卷格式JSON{
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
    };console.log( JSON.parse(localStorage.data) );
    /*
		support
	*/


	 var newQues = getId("newQues"),
	 	createBody = getId("createBody"),
	 	setTitle = getId("setTitle"),
	 	questionType = getId("questionType"),
	 	addQuestion = getId("addQuestion");
	 newQues.onclick = function(){
	 	newQues.style.display = "none";
	 	createBody.style.display = "block";
	 	newQues = null;
	 }; 

	 setTitle.onclick = function(){
	 	setTitle.value = "";
	 	setTitle = null;
	 }

	 addQuestion.onclick = function(){
	 	questionType.style.display = "block";
	 	addQuestion = null;
	 }


})(window);


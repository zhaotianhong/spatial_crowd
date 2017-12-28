
define(['ol','toolkit','bootstrap','member'],function (ol,toolkit,bootstrap,member) {
	
	//注意：不要再借助其他改界面了
	var myElement=toolkit.strToHtml("<div class='Map-app-menu'> "+
		"<div class='Map-app-option app-option-order ' >"+
			"<span class='glyphicon glyphicon-tags app-float ' aria-hidden='true'></span>"+
		"</div>"+
		"<div class='Map-app-option ' >"+
		"</div>"+
		"<div class='Map-app-option ' >"+
		"</div>"+
"	</div>");
    var menu=new ol.control.Control({element: myElement});
	
	menu.elementListen = function(map){
			//菜单切换
			$(".app-option-order").click(function(){
				menu.toggleMenu();
			});
	}
	
	/* 
	*method
	*/
	//切换目录
	menu.toggleMenu = function(){
		if (!($(".app-control").hasClass('app-hidden'))){
				$(".app-control").addClass('app-hidden');
			}
		else{
			$(".app-control").removeClass('app-hidden');
		}
	};
	
	
	
    return menu;
});

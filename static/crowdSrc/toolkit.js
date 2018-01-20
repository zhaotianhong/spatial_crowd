
define(['jquery','CSV'],function ($,CSV) {
	var baiKey="ryvwYVq8Gl3cOOQBvFypZMbI7GDylfwb";
	var toolkit={
				/* 
				通过字符串创建dom
				*/
				 strToHtml:function(str){
							var objE=document.createElement("div");
							objE.innerHTML=str;
							return objE.childNodes[0];
					},
				/* 
				解析CSV,注意参数，因为member中加载了toolkit，导致toolkit顺序在member之前，toolkit中想要使用后面才加入的member需要按需在函数参数中申请member
				*/
				 parseTasksCsv:function (fileString,member){
								var a =new CSV(fileString, {
										header: ["time_a","time_d","volume","x","y","id"]
										}).parse();
								a.splice(0,1);//删除第一行目录
								var arr_tasks=[];
								for(i = 0; i <a.length; i++){
									var t=new member.Task(a[i]);
									arr_tasks.push(t);
								}
							return arr_tasks;	
					},
				
				/* 
				准备dropFile
				*/
				documReady:function (map,app,member,panel) {
							$(document).ready(function(){
							
							//************ dropify**************************
							$('.dropify').dropify();
						   
							// Used events
							var drEvent = $('#input-file-events').dropify();
							

							drEvent.on('dropify.beforeClear', function(event, element){
								return confirm('Do you really want to delete \'' + element.file.name + '\' ?');
							});

							drEvent.on('dropify.afterClear', function(event, element){
								alert('File deleted');
							});

							drEvent.on('dropify.errors', function(event, element){
								console.log('Has Errors');
							});

							var drDestroy = $('#input-file-to-destroy').dropify();
							drDestroy = drDestroy.data('dropify')
						  //将tasks页面关闭
							app.panel.muteEditTasks();
							
							
							//************ datetimepicker**************************
							$.datetimepicker.setLocale('en');
							$('#app-input-task-timeA').datetimepicker();
							$('#app-input-task-timeD').datetimepicker();


							//************mousePosition**************************
							var imouse = 0;
            				var timer;
            				var se=false;
            				var zoom;

            				//鼠标进入时给安置一个计时器，干两件事，判断是否静止，并每个一段时间设静止，看是否会改变
            				$("#app-map").mouseover(function(){
				                timer = window.setInterval(function(){
				                			//静止且说明框未popup时进行判断
						                	if (imouse == 0 && (member.overlay.getPosition()==undefined)) {
						                		zoom=map.getView().getZoom();						                		
						                		member.popup();
						                	}
							                imouse = 0;

							            }, 800);
				            });
				            $("#app-map").mouseout(function(){
				                window.clearInterval(timer);
				            });
				            $("#app-map").mousemove(function(){
				                imouse = 1;
				                //只要移动就会关闭
				                se=false;
				                member.overlay.setPosition(undefined);
				            });


							member.popup=function(){
								if(member.source.getFeatures().length>0){
									var features=member.source.getFeatures();
									var point=$('.ol-mouse-position')[0].innerHTML.split(",");
										point=[parseFloat(point[0]),parseFloat(point[1])];
									//寻找是否选中
									for (var i = features.length - 1; i >= 0; i--) {										
										se=features[i].task.select(point,zoom);
										
										if(se){

											$("#task-popup-content")[0].innerHTML="time a: "+se.time_a+"<br>time d: "+se.time_d+"<br>volume: "+se.volume;											
											member.overlay.setPosition(se.coordinates);
											return;
										}
									}
									
								}
								if(app.panel.curentTasks.source&&app.panel.curentTasks.source.getFeatures().length>0){
									var features=app.panel.curentTasks.source.getFeatures();
									var point=$('.ol-mouse-position')[0].innerHTML.split(",");
										point=[parseFloat(point[0]),parseFloat(point[1])];
									//寻找是否选中
									for (var i = features.length - 1; i >= 0; i--) {
										if(features[i].task){
											se=features[i].task.select(point,zoom);
											
											if(se){

												$("#task-popup-content")[0].innerHTML="time a: "+se.time_a+"<br>time d: "+se.time_d+"<br>volume: "+se.volume;											
												member.overlay.setPosition(se.coordinates);
												return;
											}
										}										
										
									}
									
								}
								if(member.routeSource.getFeatures().length>0){
									var features=member.routeSource.getFeatures();
									var point=$('.ol-mouse-position')[0].innerHTML.split(",");
										point=[parseFloat(point[0]),parseFloat(point[1])];
									for (var i = features.length - 1; i >= 0; i--) {										
										if(features[i].task){
											se=features[i].task.select(point,zoom);
											if(se){

												$("#task-popup-content")[0].innerHTML="time a: "+se.time_a+"<br>time d: "+se.time_d+"<br>volume: "+se.volume;
												member.overlay.setPosition(se.coordinates);
												return;
											}
										}
									}									
								}

							}
						});
					},
					/* 
				
				*/
				 testXY:function (adddress){
							$.ajax({ 
										type:'get', 
										url : 'http://api.map.baidu.com/geocoder/v2/?address='+adddress+'&output=json&ak='+baiKey, 
										dataType : 'jsonp', 
										success : function(json) { 
										  console.log(adddress);
										console.log(json);
										}, 
										error : function(e) { 
										  console.log(e);
										} 
									  }); 
								obj={X:12696299, Y:2576930}
							return obj;	
					},
					/* 
				   自动计算task的id
				*/
				 getTaskID:function (){
						 var trs=$($('.app-tasksTable').children()[0]).children();
						 var n=trs.length;
						 if(n==1){
							 return "t1";
						 }
						 else{
							 var lastNumStr=trs[n-1].task.id;
							 var num=parseInt(lastNumStr.substr(1))+1;
							 var id="t"+num;
							 return id;
						 }
						
					},
				getTime:function (){
						 var times=[0,0];
						 var day=new Date()
						 var daystr=day.getFullYear()+"/"+(day.getMonth()+1)+"/"+day.getDate();
						 times[0]=daystr+" 00:00";
						 times[1]=daystr+" 23:00";
						return times;
					},
				/* 
				   自动计算task的id
				*/
				 getWorkerID:function (){
						 var trs=$($('.app-workersTable').children()[0]).children();
						 var n=trs.length;
						 if(n==1){
							 return "w1";
						 }
						 else{
							 var lastNumStr=trs[n-1].worker.getID();
							 var num=parseInt(lastNumStr.substr(1,1))+1;
							 var id="w"+num;
							 return id;
						 }
						
					}
			
				
			}
	
    return toolkit

});

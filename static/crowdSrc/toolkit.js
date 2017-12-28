
define(['jquery','CSV'],function ($,CSV) {
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
				documReady:function (app) {
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
						});
					},
					/* 
				解析CSV,注意参数，因为member中加载了toolkit，导致toolkit顺序在member之前，toolkit中想要使用后面才加入的member需要按需在函数参数中申请member
				*/
				 testXY:function (adddress){
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
							 var lastNumStr=trs[n-1].task.getID();
							 var num=parseInt(lastNumStr.substr(1,1))+1;
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
						
					},
				
			}
	
    return toolkit

});

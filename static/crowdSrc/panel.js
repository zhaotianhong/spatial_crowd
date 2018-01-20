
define(['ol','toolkit','bootstrap','member'],function (ol,toolkit,bootstrap,member) {
	
	//注意：不要再借助其他改界面了
	var myElement=toolkit.strToHtml("<div  class='app-control app-hidden'>"+
"<div class='app-menu'>"+
"		  <div class='btn-group btn-group-justified app-menus-div' role='group' aria-label='...'>"+
"			  <div class='btn-group '  role='group' id='app-Tasks'>"+
"				<button type='button' class='btn btn-default active'>tasks</button>"+
"			  </div>"+
"			  <div class='btn-group' role='group' id='app-Workers'>"+
"				<button type='button' class='btn btn-default'>Workers</button>"+
"			  </div>"+
"			  <div class='btn-group' role='group' id='app-Routes'>"+
"				<button type='button' class='btn btn-default'>Route</button>"+
"			  </div>"+
"			</div>"+
"		</div>"+
"		<div class='app-content'>"+
"			<div id='app-Tasks-view' class='app-subContent' >"+
	"	<div role='presentation' class='dropdown app-choseTasks' id='app-dropdiv1'>	"+		
	"				<button id='app-drop' type='button' class='btn btn-danger dropdown-toggle ' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><p class='app-float' style='margin:0'>Select Tasks </p>"+
	"						<div class='app-floatRight'><span class='caret '></span>"+
	"						<span class='sr-only '>Toggle Dropdown</span></div>"+
	"				</button>"+
	"				<ul id='app-tasksMenu' class='dropdown-menu' aria-labelledby='app-drop'>"+
	"				  <li><a href='#' data-toggle='modal' class='app-addTasks' data-target='#app-TID'>Add Tasks</a></li>"+
	
	"				</ul>"+
	"			  </div>"+			  
"				<div class=' app-tablediv app-taskTableDiv'>"+
"						<div class='app-tableAdd app-tabletaskAdd app-hidden'><span class='glyphicon glyphicon-tag app-task-add' aria-hidden='true'> start</span></div>"+
"						 <table class='table app-tasksTable' >"+
"							<tr>"+
"							<th class='app-TableHead'>id</th>"+
"							<th class='app-TableHead'>start time</th>"+
"							<th class='app-TableHead'>end time</th>"+
"							</tr>"+
"						</table>"+
"				</div>"+
"				<div class='app-uploading'>"+
"				    <p style='font-size: small;margin-bottom: 0px;' >Or Add A CSV File</p>"+
"                   <input type='file' id='app-upCSV' class='dropify' data-max-file-size='2M' data-allowed-file-extensions='csv' />"+
"				</div>"+
"				<div class='app-Ok'>"+
"					<button class='btn btn-default app-ok app-float app-hidden' type='submit'>OK</button>"+
"					<button class='btn btn-default app-no app-hidden' type='submit'>cancel</button>"+
					"<button class='btn btn-default app-display app-hidden app-floatRight' >display</button>"+
"				</div>"+
"			</div>"+
"			<div id='app-Workers-view' class='app-hidden app-subContent'>"+
"				<div class=' app-tablediv app-workerTableDiv'>"+
"						<div class='app-tableAdd '><span class='glyphicon glyphicon-user app-worker-add' aria-hidden='true'> add</span></div>"+
"						 <table class='table app-workersTable' >"+
"							<tr>"+
"							<th class='app-TableHead'>id</th>"+
"							<th class='app-TableHead'>velocity</th>"+
"							<th class='app-TableHead'>radius</th>"+
"							<th class='app-TableHead'><span class='glyphicon glyphicon-th-large ' aria-hidden='true'> </span></th>"+
"							</tr>"+
"						</table>"+
"				</div>"+
"							<p>one worker:xx Algorithm</p>"+
"							<p>more than one worker:xx Algorithm</p>"+
			"</div>"+
"			<div id='app-Routes-view' class='app-hidden app-subContent'>"+
				" <button type='button' class='btn btn-default app-route-check '>route</button><p></p>"+
				"<div class=' app-routeTableDiv'>"+
 "						 <table class='table app-routesTable' >"+
"							<tr>"+
"							<th class='app-routeTh app-routeRH'></th>"+
"							<th class='app-routeTh app-routeSH'></th>"+
"							<th class='app-routeTh app-routeSTH'></th>"+
"							</tr>"+
"							<tr>"+
"							<th class='app-routeTh app-routeTH'></th>"+
"							<th class='app-routeTh app-routeTabu'></th>"+
"							<th class='app-routeTh' ></th>"+
"							</tr>"+

"						</table>"+
				"  </div>"+
	"</div>"+
"		</div>	"+	
"	</div>");
    var panel=new ol.control.Control({element: myElement});
	//此面板此时对应的Tasks
	panel.curentTasks={};
	panel.draw=false;
	/* 
	*listenning
	*/
	//切换目录
	panel.elementListen = function(map){
		//***********************tasks***********************************
		//菜单切换
		$(".app-menus-div").click(function(event){
			if (event.target.tagName=='BUTTON'){
				var id=$(event.target).parent()[0].id;
				panel.toggleMenu(id);
				}
			panel.toggleDrop(0);
			panel.stopDraw(map);
		});
		//点击弹出模态框输入tasksID
		$(".app-addTasks").click(function(){
			$('#app-TID').modal('show');
			if($(".app-task-add")||$(".app-task-add")[0].innerText==' stop'){
				map.removeInteraction(member.draw);
				$(".app-task-add")[0].innerText=' start'
			}
		});
		//展开下拉框
		$(".dropdown-toggle").click(function(){
			panel.toggleDrop();
			
		});
		//手动添加task
		$(".app-task-add").click(function(){
			var text=$(".app-task-add")[0].innerText;
			//$('#app-input-task').modal('show');
			if(text==' start'){
				panel.startDraw(map);
				$(".app-task-add")[0].innerText=' stop'
				
			}
			else if(text==' stop'){
				map.removeInteraction(member.draw);
				$(".app-task-add")[0].innerText=' start'
			}
			
			
			
		});
		//选择tasks 
		$("#app-tasksMenu").click(function(event){
			if (event.target.tagName=='A'&&event.target.innerText!="Add Tasks"){
				$("#app-drop").children()[0].innerText=event.target.innerText;
				var li=$(event.target).parent()[0];
				
				panel.refreashContent(li.collect_Tasks);
				//收尾工作
				panel.toggleDrop(0);
				panel.muteEditTasks();
				panel.toggleBtn(1);
				panel.endDraw(map);
			}
			
		});		
		//新建tasks 1.打开面板
		$(".app-dropID").click(function(){
			
			$(".app-inputTasksid")[0].value="";
			$("#app-TID").modal('hide');
		});
		//新建tasks 1.打开面板
		$(".app-saveID").click(function(){
			//获取id 
			var tasksid=$(".app-inputTasksid")[0].value.trim();
			//判断输入是否合法
			var Regx = /^[A-Za-z0-9]*$/;
            if ((!tasksid)||(!Regx.test(tasksid))){
				alert("Please enter an id that begins only with letters or digits.");
				return;
			}
			if($(".app-randomTasks")[0].checked){
				var num =$(".app-tasksNum")[0].innerText;
				$.ajax({
                type: 'GET',
                url: '/get_random_tasks/'+num+'/',
                success: function (data) {
                    var randomTasks=data.randomTasks;
                    for(i=0;i<randomTasks.length;i++){
                    	var task= new member.Task(randomTasks[i]);
						$($('.app-tasksTable').children()[0]).append(task.view);						
					}	
                },
                error: function (e) {
                    console.log(e);
                }
				
			})}
			$("#app-drop").children()[0].innerText="tasks_"+tasksid;
			$(".app-inputTasksid")[0].value="";
			$("#app-TID").modal('hide');
			//收尾工作，准备面板 确保面板。地图干净，启用面板，显示底部 ok'与cancel两个btn
			panel.refreashContent(0);
			panel.clearUpload();
			
			panel.initEditTasks();
			panel.toggleBtn(2);

			
			
		});		
		//
		$(".app-input-task-testXYBtn").click(function(){
			var adddress=$(".app-input-task-testXY")[0].value;
			var obj=toolkit.testXY(adddress);
			
			$(".app-input-task-X")[0].innerText=obj.X;
			$(".app-input-task-Y")[0].innerText=obj.Y;
		});
		//更改task
		$(".app-saveTask").click(function(){
			var volume=$(".app-input-Task-volume")[0].value;
			var timeA=$("#app-input-task-timeA")[0].value;
			var timeD=$("#app-input-task-timeD")[0].value;
			
			var X=$(".app-input-task-X")[0].innerText;
			var Y=$(".app-input-task-Y")[0].innerText;
			
			//判断输入是否合法 
			
			if(parseInt(volume)){
				var opt={x:parseFloat(X),
					y:parseFloat(Y),
					time_a:timeA,
					time_d:timeD,
					volume:parseInt(volume)
				};
						
				var tasktr=$(".app-task-tr-active")[0];
				tasktr.task.change(opt);
				tasktr.innerHTML="<th>"+tasktr.task.id+"</th>"+"<th>"+opt.time_a+"</th>"+"<th>"+opt.time_d+"</th>";

				$("#app-input-task").modal('hide');
			}else{
				alert("input error");
				return;
			}
			
			
			
		});
		
		//新建tasks .2.若不保存新建
		$(".app-no").click(function(){
			//下拉框重新要求选取
			$("#app-drop").children()[0].innerText="Select Tasks";
			//关闭面板
			panel.muteEditTasks();
			panel.toggleBtn(0);
			panel.clearUpload();
			panel.refreashContent(0);
			panel.stopDraw(map);
			panel.endDraw(map);
					
		});
		//新建tasks .2.若不保存新建
		$(".app-tasksNum").click(function(){
			var num=parseInt($(".app-tasksNum")[0].innerText);
			if(num==80){
				$(".app-tasksNum")[0].innerText=20;
			}
			else{
				$(".app-tasksNum")[0].innerText=num+20;
			}		
		});
		//新建tasks .2.保存新建，若列表中有则去除然后，在列表中建立task列表，3关闭编辑面板
		$(".app-ok").click(function(){
			var files = $('input[id="app-upCSV"]').prop('files');//获取到文件列表 
			var trs= $($('.app-tasksTable').children()[0]).children();
			 if(files.length == 0&&trs.length==1){
			   alert('Please add some tasks.');
			   return;
			 }
			 else {	
					var id=$("#app-drop").children()[0].innerText;
					 var newtasks=new member.Collect_Tasks(id);
					 //先将表单中数据加入
					 if(trs.length>1){
						 for(i=1;i<trs.length;i++){
									newtasks.addTasks([trs[i].task]);
								}
					 }
					 //再将上传文件中每个传入给
					 if(files.length != 0){
						var reader = new FileReader();//新建一个FileReader
						reader.readAsText(files[0]);//读取文件
						reader.onload = function(evt){//读取完文件之后会回来这里
							
								var fileString = evt.target.result;	
								var ts=toolkit.parseTasksCsv(fileString,member);
								
								newtasks.addTasks(ts);
								for(i=0;i<ts.length;i++){
									$($('.app-tasksTable').children()[0]).append(ts[i].view);
								}																					
							} 
						}
					// 
					//判断是不是初次添加
					if($("#app-tasksMenu").children().length==1){
						var line=toolkit.strToHtml("<li role='separator' class='divider'></li>");
						$("#app-tasksMenu").append(line);
					}
					//收尾工作
					panel.curentTasks=newtasks;
					$("#app-tasksMenu").append(panel.curentTasks.view);
					panel.toggleBtn(1);							
					panel.clearUpload();
					panel.muteEditTasks();
					panel.stopDraw(map);
					panel.endDraw(map);
			 }
			
			
		});
		//显示
		$(".app-display").click(function(){
			if($(".app-display")[0].innerText=='display'){
								
				
				map.addLayer(panel.curentTasks.vectorLayer);
				$(".app-display")[0].innerText='undisplay';
				
			}
			else if($(".app-display")[0].innerText=='undisplay'){
				map.removeLayer(panel.curentTasks.vectorLayer);
				$(".app-display")[0].innerText='display';
			}
			
		});
		//修改默认task设置
		$(".app-tasksTable").click(function(event){
				//若不是编辑模式则不允许编辑操作
				if(!$(".app-display").hasClass('app-hidden')){
					return;
				}
				//开始编辑操作
				var tr;
				if(event.target.tagName=='TR'){
					tr=event.target
				}else if(event.target.tagName=='TH'){
					tr=$(event.target).parent()[0];
				}
				
				if ($(tr).hasClass("app-task-tr")){
					if($(".app-task-tr-active")){
						$(".app-task-tr-active").removeClass("app-task-tr-active")
					}
					$(tr).addClass("app-task-tr-active");
					
					//弹出窗显示对应的task information
					panel.changeAddTask(tr.task);				
					$("#app-input-task").modal('show');
					panel.stopDraw(map);
				}	
			});
		
		
		//***********************worker***********************************
		//手动添加worker
		$(".app-worker-add").click(function(){
			$('#app-input-worker').modal('show');
			
		});
		//取消添加worker
		$(".app-dropWorker").click(function(){
			
			panel.clearAddWorker();
			$("#app-input-worker").modal('hide');
		});
		//保存添加的worker
		$(".app-saveWorker").click(function(){
			var v=$(".app-input-worker-velocity")[0].value;
			var vol=$(".app-input-worker-volume")[0].value;
			var r=$(".app-input-worker-radius")[0].value
			
			var opt={
					velocity:v,
					volume:vol,
					radius:r};
			var worker=new member.Worker(opt);
			$($('.app-workersTable').children()[0]).append(worker.view);
			
			panel.clearAddWorker();
			$("#app-input-worker").modal('hide');
			
		});		
		$(".app-workersTable").click(function(event){
				
				//开始编辑操作 
				if(event.target.tagName=='SPAN'&&$(event.target).hasClass("app-worker-delete")){
					var tr=$($(event.target).parent()[0]).parent()[0];
					console.log(tr);
					delete tr.worker;
					$(tr).remove();
				}
			});
		
		
		//*****************************route**************************
		$(".app-route-check").click(function(){
			//panel.curentTasks.getGeoJson()
			//var geo=JSON.stringify(this.geojson);
			var routes=[];
			member.routeSource.clear();
			var routeTh=$(".app-routeTh");
			for(var a=0;a<routeTh.length;a++){
				routeTh[a].innerHTML="";
				
			}
			if($(".app-display").hasClass('app-hidden')){
				alert("Taks Is NOT Ready!");
				return;
			}
			if($($('.app-workersTable').children()[0]).children().length==1){
				workercheck="is NOT ready";
				alert("Workers Is NOT Ready!");
				return;
			}

			var jsonObj={
			 	taks:panel.curentTasks.getGeoJson(),
			 	workers:panel.getWorkers()
			 } 
			 var json=JSON.stringify(jsonObj);		
            $.ajax({
	                type: 'POST',
	                url: '/back_data/',
	                data: json,
	                dataType: 'json',
				    contentType: 'application/json; charset=UTF-8',

	                success: function (data) {
	                    var routesData=data;
	                    var alg=["R","SH","STH","TH","Tabu"];
	                    for(var i=0;i<4;i++){
	                    	var route=new member.Route(routesData[alg[i]]);	                   		
	                    	var div=".app-route"+route.algorithm;
	                    	$(div).append(route.view);
	                    	member.routeSource.addFeature(route.feature);
	                    	console.log(panel.curentTasks.source.getFeatures());
	                    }
	                    
	                    
	                },
	                error: function (e) {
	                    alert(e);
	                }
	            });
			/*
			var ss={
					algorithm:"RH",
					plot:["114.084381,22.543047;114.084381,22.54355;114.084373,22.543747;114.084267,22.543734;114.084282,22.542774;114.084381,22.542778;114.084488,22.542791;114.08506,22.542904;114.085457,22.542969;114.085495,22.542973;114.085724,22.543005;114.08609,22.54302;114.08651,22.543024;114.086731,22.543005;114.087112,22.542959;114.087608,22.542959;114.087891,22.542973;114.087891,22.542973;114.087891,22.542847","114.065979,22.54714;114.065994,22.54698;114.06601,22.546949;114.066078,22.546894;114.066109,22.546835;114.066116,22.546776;114.06736,22.546808;114.06749,22.546799;114.067627,22.546749;114.06778,22.546585;114.06778,22.546585;114.067787,22.545591;114.067802,22.544882;114.067993,22.544754;114.068398,22.544758;114.069725,22.5448;114.071304,22.544836;114.071815,22.54484;114.071945,22.544844;114.072952,22.544867;114.073143,22.544888;114.07489,22.545208;114.07563,22.545321;114.075943,22.545355;114.07618,22.545364;114.076675,22.545341;114.076988,22.545313;114.077354,22.545235;114.077568,22.545181;114.078064,22.545065;114.079308,22.544754;114.080055,22.544571;114.080978,22.544336;114.081154,22.544302;114.081154,22.544302;114.081161,22.543945;114.081177,22.543734;114.081154,22.542673;114.081352,22.542683;114.082039,22.542709;114.082596,22.542734;114.083427,22.542751;114.084282,22.542774;114.084381,22.542778;114.084488,22.542791;114.08506,22.542904;114.085457,22.542969;114.085495,22.542973;114.085724,22.543005;114.08609,22.54302;114.08651,22.543024;114.086731,22.543005;114.087112,22.542959;114.087608,22.542959;114.087891,22.542973;114.087891,22.542973;114.087891,22.542847","114.060455,22.568424;114.060051,22.56842;114.059891,22.568424;114.059235,22.568434;114.059235,22.568365;114.059395,22.568356;114.060051,22.568369;114.060921,22.568369;114.061005,22.568369;114.062668,22.568388;114.062714,22.568388;114.063164,22.568388;114.063591,22.568388;114.063698,22.568388;114.063866,22.568388;114.064667,22.568388;114.064819,22.568388;114.065331,22.568388;114.065376,22.568388;114.065834,22.568386;114.065948,22.568386;114.066055,22.568386;114.066338,22.568378;114.066338,22.568378;114.066513,22.568325;114.06665,22.568256;114.066719,22.568182;114.066772,22.568073;114.066833,22.567804;114.066895,22.567547;114.066895,22.567547;114.067078,22.566776;114.067078,22.566776;114.067154,22.566689;114.0672,22.566511;114.067284,22.566076;114.067307,22.565916;114.067337,22.565765;114.067368,22.565392;114.067413,22.564667;114.067436,22.563784;114.067451,22.563293;114.067474,22.56246;114.06749,22.561626;114.06749,22.561594;114.067528,22.559959;114.067535,22.559849;114.067535,22.559717;114.067535,22.559595;114.067558,22.558929;114.067558,22.558464;114.067558,22.558229;114.067566,22.557991;114.067589,22.557144;114.067589,22.556488;114.067596,22.556116;114.067627,22.554932;114.067635,22.554157;114.067642,22.553938;114.067642,22.553715;114.06765,22.552177;114.067642,22.551666;114.067642,22.550564;114.067673,22.549774;114.067673,22.54954;114.067726,22.548767;114.067726,22.548616;114.067719,22.548256;114.067772,22.547136;114.067772,22.547136;114.067757,22.547085;114.067688,22.546963;114.067635,22.546917;114.067558,22.546885;114.067299,22.546858;114.066879,22.546858;114.066109,22.546835;114.066109,22.546835;114.066078,22.546894;114.06601,22.546949;114.065994,22.54698;114.065979,22.54714","114.060455,22.568424;114.060051,22.56842;114.059891,22.568424;114.059235,22.568434;114.059143,22.568356;114.059158,22.568016;114.059166,22.567217;114.059166,22.567045;114.059181,22.566475;114.059189,22.566189;114.059189,22.565916;114.059196,22.565687;114.059189,22.565346;114.059212,22.564522;114.059212,22.56444;114.059242,22.563616;114.05925,22.563042;114.059242,22.562916;114.059196,22.562819;114.059105,22.562664;114.059105,22.562664;114.058525,22.562595;114.057556,22.562546;114.057556,22.562546;114.056999,22.56246;114.056007,22.562283;114.053627,22.562408;114.05265,22.562445;114.052116,22.562441;114.051605,22.562408;114.051193,22.562365;114.050613,22.562277;114.049774,22.562105;114.049774,22.562105;114.049438,22.562092;114.049278,22.562071;114.049072,22.562023;114.048668,22.561893;114.047722,22.561567;114.047546,22.56152;114.04673,22.561293;114.046478,22.56123;114.045898,22.561089;114.045555,22.56102;114.044441,22.560802;114.044441,22.560802;114.044334,22.560829;114.044258,22.560863;114.044189,22.560921;114.044151,22.560965;114.044113,22.561029;114.044098,22.561119;114.044106,22.561211;114.044144,22.561302;114.044174,22.561354;114.044243,22.561407;114.044327,22.561445;114.044403,22.561459;114.044495,22.561453;114.044548,22.561436;114.044624,22.561398;114.044807,22.561234;114.045296,22.560295;114.045464,22.559978;114.046043,22.558889;114.04641,22.558273;114.046768,22.557705;114.047081,22.55714;114.047104,22.557091;114.047737,22.555981;114.048264,22.554932;114.048286,22.554905;114.048462,22.55467;114.048721,22.554144;114.04879,22.553984;114.048904,22.553633;114.049004,22.553207;114.049095,22.552769;114.049118,22.552517;114.04921,22.551197;114.049232,22.550087;114.049255,22.548775;114.049255,22.548161;114.049255,22.547937;114.049255,22.547783;114.049263,22.547527;114.049263,22.546303;114.049278,22.544645;114.049286,22.544344;114.049301,22.544062;114.049301,22.543945;114.049309,22.543585;114.049339,22.542925;114.049339,22.542608;114.049355,22.542286;114.049377,22.541636;114.049377,22.540773;114.049423,22.538616;114.049423,22.538616;114.049248,22.538361;114.049118,22.538294;114.048988,22.538288;114.048851,22.538342;114.048782,22.538429;114.048729,22.53862;114.048714,22.539188;114.048737,22.539339;114.048851,22.539526;114.048851,22.539526;114.050095,22.539553;114.050232,22.539553;114.050362,22.539562;114.050941,22.539576;114.051346,22.539581;114.052124,22.539614;114.052406,22.539627;114.053078,22.53964;114.054276,22.539675;114.054939,22.539675;114.055763,22.539667;114.056084,22.539667;114.056786,22.53968;114.057091,22.539667;114.057732,22.539576;114.057732,22.539576;114.057617,22.538706"]
				}
			var route1=new member.Route(ss);
            member.routeSource.addFeature(route1.feature);
            if(ss.tasks){
					for(i=0;i<ss.tasks.length;i++){
						var op={
							id:ss.tasks[i].id,
							time_a:ss.tasks[i].arrive,
							time_d:ss.tasks[i].finish,
							volume:ss.tasks[i].q,
							x:ss.tasks[i].lat,
							y:ss.tasks[i].lon
						};
						var ta=new member.Task(op);
						member.routeSource.addFeature(ta.feature);
					}
				} 
			*/	


			
		});
		$(".app-routesTable").click(function(event){
			if(!$(event.target).hasClass('app-routeAlg')){
				return;
			}
			if($(event.target).hasClass('app-routeActive')){
				$(event.target).removeClass('app-routeActive');
				member.routeSource.removeFeature(event.target.route.feature);
			}
			else{
				$(event.target).addClass('app-routeActive');
				member.routeSource.addFeature(event.target.route.feature)
			}
		});
	}
	
	/* 
	*method
	*/
	//切换目录
	panel.toggleMenu = function(id){
		var menu="#"+id;
		var view="#"+id+"-view";
		var menus=['#app-Tasks','#app-Workers','#app-Routes'];
		var views=['#app-Tasks-view','#app-Workers-view','#app-Routes-view'];
		for (i=0;i<menus.length;i++){
			var keyW=menus[i];
			var bt=$(keyW).children()[0];
			if($(bt).hasClass('active')) {
				$(bt).removeClass('active');
			}
		}
		for (j=0;j<views.length;j++){
			var keyW=views[j];
			if (!($(keyW).hasClass('app-hidden'))){
				$(keyW).addClass('app-hidden');
			}
		}
		var bt=$(menu).children()[0];
		$(bt).addClass('active');
		$(view).removeClass('app-hidden');
		
	};
	//展开下拉框
	panel.toggleDrop = function(boo){
		//切换
		if ($("#app-dropdiv1").hasClass('open')){
				$("#app-dropdiv1").removeClass('open');
				$(".dropdown-toggle")[0].attributes[5].value=false;
			}
			else{
				$("#app-dropdiv1").addClass('open');
				$(".dropdown-toggle")[0].attributes[5].value=true;
			}
		//有参数时候则判断，为0则关
		if(boo==0&&$("#app-dropdiv1").hasClass('open')){
			$("#app-dropdiv1").removeClass('open');
				$(".dropdown-toggle")[0].attributes[5].value=false;
		}
		
	};	
	//禁用EditTasks
	panel.muteEditTasks = function(){
		 var div=$('#app-upCSV').parent()[0];
			if($(div).hasClass('dropify-wrapper')) {
					if(!$(div).hasClass('disabled')){
						$(div).addClass('disabled')
						$('#app-upCSV').attr("disabled",true);
					}
				}
		if (!$(".app-tabletaskAdd").hasClass('app-hidden')){
				$(".app-tabletaskAdd").addClass('app-hidden');
			}
		panel.clearUpload();	
	};
	//启用EditTasks
	panel.initEditTasks = function(){
		//
		 var div=$('#app-upCSV').parent()[0];
			if($(div).hasClass('dropify-wrapper')) {
					if($(div).hasClass('disabled')){
						$(div).removeClass('disabled')
						$('#app-upCSV').attr("disabled",false);
					}
				}
		if ($(".app-tabletaskAdd").hasClass('app-hidden')){
				$(".app-tabletaskAdd").removeClass('app-hidden');
			}
	};	
	//控制下部按钮显示 1为display，2为save和cancel,0为都不显示
	panel.toggleBtn = function(boo){
		var btns=['.app-display','.app-ok','.app-no','.app-undisplay'];
		for (i=0;i<btns.length;i++){
			var bt=btns[i];
			if(!$(bt).hasClass('app-hidden')) {
				$(bt).addClass('app-hidden');
			}
		}
		if (boo==1){
			$(".app-display").removeClass('app-hidden');
			$(".app-undisplay").removeClass('app-hidden');
			}
		if(boo==2){
			$(".app-ok").removeClass('app-hidden');
			$(".app-no").removeClass('app-hidden');
			}		
	};
	//清空上传
	panel.clearUpload = function(){	
		var remove=$('#app-upCSV').next();	
		if(remove[0].innerText=="REMOVE"){
			$(remove).trigger("click");
		}		
	};	
	//控制如何刷新content（包括地图种图层），0，一切清空(面版+两个vector Layer)， 或为对应要选的collectTasks，并按照选中的collectTasks刷新
	panel.refreashContent = function(boo){		
		if (boo==0){
				$('.app-tasksTable').children()[0].innerHTML="<tr><th class='app-tasksTableHead'>id</th><th class='app-tasksTableHead'>start time</th><th class='app-tasksTableHead'>end time</th></tr>";
				if($(".app-display")&&$(".app-display")[0].innerText=='undisplay'){
					$(".app-display").trigger("click");
				}
				if(member.source.getFeatures().length>0){
					member.source.clear();
				}
				
			}
		if(boo!=0){
			
				if($(".app-display")&&$(".app-display")[0].innerText=='undisplay'){
					$(".app-display").trigger("click");
				}
				panel.curentTasks=boo;
				$('.app-tasksTable').children()[0].innerHTML="<tr><th>ask_id</th><th>start_time</th><th>end_time</th></tr>";
				var ts=panel.curentTasks.tasks;
				for(i=0;i<ts.length;i++){
					$($('.app-tasksTable').children()[0]).append(ts[i].view);
				}
				if(member.source.getFeatures().length>0){
					member.source.clear();
				}
				
			}
	};
	//清空addTask弹窗
	panel.changeAddTask = function(task){
		
		$(".app-input-Task-volume")[0].value=task.volume;
		$("#app-input-task-timeA")[0].value=task.time_a;
		$("#app-input-task-timeD")[0].value=task.time_d;
		$(".app-input-task-testXY")[0].value="";
		
		$(".app-input-task-X")[0].innerText=task.coordinates[0];
		$(".app-input-task-Y")[0].innerText=task.coordinates[1];
		};
		//清空addTask弹窗
	panel.startDraw = function(map){
			
			map.addInteraction(member.draw);
			//map.addInteraction(member.select);
		};
	panel.endDraw = function(map){
			if(map.getInteractions().getLength()>0){
				if(member.source.getFeatures().length>0){
					member.source.clear();
				}
				map.removeInteraction(member.draw);
				
			}
			
		};
	//关闭手动添加task
	panel.stopDraw = function(map){			
			if($(".app-task-add")||$(".app-task-add")[0].innerText==' stop'){
				map.removeInteraction(member.draw);
				$(".app-task-add")[0].innerText=' start'
			}	
		};
	
	//***********************************************worker****************************************
	//清空addWorker弹窗
	panel.clearAddWorker = function(){	
		$(".app-input-worker-velocity")[0].value=20;
		$(".app-input-worker-volume")[0].value=10;
		$(".app-input-worker-radius")[0].value=1000;
	};
	panel.deleteWorker = function(){	
		$(".app-input-worker-velocity")[0].value=20;
		$(".app-input-worker-volume")[0].value=10;
		$(".app-input-worker-radius")[0].value=1000;
	};
	panel.getWorkers = function(){	
		var workers=[];
		for(var i=1;i<$($('.app-workersTable').children()[0]).children().length;i++){
			var wo=$($('.app-workersTable').children()[0]).children()[i].worker;
			workers.push();
		}
		return workers;
	};

    return panel;
});

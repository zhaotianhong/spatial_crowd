
define(['panel','inputTID','inputTask','inputWorker','menu'],function (panel,inputTID,inputTask,inputWorker,menu) {
	 window.app = {};
     var app = window.app;
	app.panel=panel;
	app.menu=menu;
	app.inputTID=inputTID;
	app.inputTask=inputTask;
	app.inputWorker=inputWorker;
	
	app.appListen=function(map){
		panel.elementListen(map);
		menu.elementListen(map);
		inputTID.elementListen();
		inputTask.elementListen();
		inputWorker.elementListen();
	}
	
    return app;
});

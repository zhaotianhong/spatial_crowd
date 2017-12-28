require.config({
    paths: {
        jquery: "../lib/js/jquery-3.2.1.min",
		toolkit:"./toolkit",
        CSV: "../lib/js/CSV/csv.min",
		bootstrap: "../lib/js/bootstrap/bootstrap",
		ol: "../lib/js/openlayers/ol",
		app:"./app",
		dropify:"../lib/src/plug/uploading/dist/js/dropify",
		datetimepicker:"../lib/src/plug/datetimepicker/build/jquery.datetimepicker.full",
		member:"./member",
		Collect_Tasks:"./Collect_Tasks",
		Task:"./Task",
		Worker:"./Worker"
    },
	shim: {

　　　　　　'CSV':{
　　　　　　　　exports: 'CSV'
　　　　　　},
　　　　　　'bootstrap': {
　　　　　　　　deps: ['jquery'],
　　　　　　　　exports: 'bootstrap'
　　　　　　},
			'dropify':{
				deps: ['jquery'],
　　　　　　　　exports: 'dropify'
　　　　　　},
			'datetimepicker':{
				deps: ['jquery'],
　　　　　　　　exports: 'datetimepicker'
　　　　　　},
			'mousewheel':{
				deps: ['jquery'],
　　　　　　　　exports: 'mousewheel'
　　　　　　}

　　　　}
})
require(['jquery', 'CSV', 'bootstrap','ol','app','toolkit','dropify','member','datetimepicker'], function ($, CSV, bootstrap,ol,app,toolkit,dropify,member,datetimepicker){
	//添加三个弹出框
		$("body").append(app.inputTID);
		$("body").append(app.inputTask);
		$("body").append(app.inputWorker);
　　　　var map = new ol.Map({
        interactions: ol.interaction.defaults().extend([
          
        ]),
		controls: ol.control.defaults({
          attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
            collapsible: false
          })
        }).extend([
		app.menu,
          app.panel,
		  new ol.control.MousePosition
        ]),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: [12696299, 2576970],
          zoom: 13
        })
      });
	 
	 
	  app.appListen(map);
	 toolkit.documReady(app);
	 map.addLayer(member.drawLayer);
	 var sss = back;
	 var back1;

	 console.log(sss);
　　});
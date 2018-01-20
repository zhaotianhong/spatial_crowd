require.config({
    paths: {
        jquery: "../lib/js/jquery-3.2.1.min",
		toolkit:"./toolkit",
        CSV: "../lib/js/CSV/csv.min",
		bootstrap: "../lib/js/bootstrap/bootstrap",
		ol: "../lib/js/openlayers/ol",
		app:"./app",
		dropify:"../lib/src/plug/uploading/dist/js/dropify",
		datetimepicker:"../lib/src/plug/datetimepicker/build/jquery.datetimepicker.full"
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
        interactions: ol.interaction.defaults(),
		controls: [app.menu,
	       			app.panel,
		  			new ol.control.MousePosition()],
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        overlays: [member.overlay],
        target: 'app-map',
        view: new ol.View({
          center: [114.05160241122102, 22.542616783367],
          zoom: 13,
          minZoom:10,
          projection: 'EPSG:4326'
        })
      });
	 
	  app.appListen(map);
	 toolkit.documReady(map,app,member);
	 map.addLayer(member.drawLayer);
	 map.addLayer(member.routeLayer);
	
　　});
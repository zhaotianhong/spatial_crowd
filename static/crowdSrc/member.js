
define(['ol','toolkit','Collect_Tasks','Task','Worker','Route'],function (ol,toolkit,Collect_Tasks,Task,Worker) {
	var member={};
	 member.Collect_Tasks=Collect_Tasks;
	 member.Task=Task;
	 member.Worker=Worker;
	 member.Route=Route;


	 //用于tasks添加时候的交互
	member.source = new ol.source.Vector();
    member.drawLayer=new ol.layer.Vector({
        source: member.source
      });
	member.draw = new ol.interaction.Draw({
          source: member.source,
          type:"Point"

        });
	member.source.on("addfeature",function(event){
			var fea=member.source.getFeatures();
			if(fea.length>0){
				var stroke = new ol.style.Stroke({color: '#000000', width: 1});
     			var fill = new ol.style.Fill({color: '#000000'});

				var style= new ol.style.Style({
				          image: new ol.style.RegularShape({
				            fill: fill,
				            stroke: stroke,
				            points: 3,
				            radius: 10,
				            angle: 0
				          })
				     });
				var feature=fea[fea.length-1];
				feature.setStyle(style);
				var coor=feature.getGeometry().getCoordinates();

				//创建task
				var opt={time_a:toolkit.getTime()[0],time_d:toolkit.getTime()[1],volume:32,x:coor[0],y:coor[1]};
				var task=new member.Task(opt,feature);
				//将task的view添加至界面
				$($('.app-tasksTable').children()[0]).append(task.view);
			}

			return true;
		  });


	//ROUTE可视化时候的图层
	member.routeSource=new ol.source.Vector();
	member.routeLayer=new ol.layer.Vector({
		source: member.routeSource
	});


	//添加task info框

	member.overlay = new ol.Overlay({
			element: document.getElementById('task-popup'),
			autoPan: true,
			position:undefined,
			autoPanAnimation: {
			duration: 250
			}
		});
	//
	member.popup;

	return member;

});

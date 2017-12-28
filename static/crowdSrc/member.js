
define(['ol','toolkit','Collect_Tasks','Task','Worker'],function (ol,toolkit,Collect_Tasks,Task,Worker) {
	var member={};
	 member.Collect_Tasks=Collect_Tasks;
	 member.Task=Task;
	 member.Worker=Worker;
	 
	 //
	member.source = new ol.source.Vector();
    member.drawLayer=new ol.layer.Vector({
        source: member.source
      });
	member.draw = new ol.interaction.Draw({
          source: member.source,
          type:"Point"
		
        });
	member.source.on("change",function(event){
			var fea=member.source.getFeatures();
			if(fea.length>0){
				var feature=fea[fea.length-1];
				var coor=feature.getGeometry().getCoordinates();
				
				
				
				
				var opt={time_a:toolkit.getTime()[0],time_d:toolkit.getTime()[1],volume:32,x:coor[0],y:coor[1]};
				var task=new member.Task(opt,feature);
				
				$($('.app-tasksTable').children()[0]).append(task.view);
			}
			
			return true;
		  });	
	member.select = new ol.interaction.Select({
        wrapX: false
      });	
	return member;

});

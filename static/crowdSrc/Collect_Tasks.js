
define(['ol','toolkit','Task'],function (ol,toolkit,Task) {
	
	Collect_Tasks=function(id){
			//tasks集合
			this.tasks=[];
			//此任务集的geojson
			this.geojson={
				type:'FeatureCollection',
				features:[]
				};
			
			this.view=toolkit.strToHtml("<li  class='app-tasksli'><a href='#'>"+id+"</a></li>");
			this.view.collect_Tasks=this;
		}
	
	//添加任务类任务 tasks:[]
	Collect_Tasks.prototype.addTasks=function(arr){
				for(i=0;i<arr.length;i++){
					this.tasks.push(arr[i]);
				}	
				this.refreash();
		}
	//删除任务 
	Collect_Tasks.prototype.delTasks=function(task){
				for(i=0;i<this.tasks.length;i++){
					if(this.tasks[i]==task){
						this.tasks.splice(i,1);
						break;
					}
				}					
		}		
	//返回需要传输的geojson
	Collect_Tasks.prototype.getGeoJson=function(){
		this.geojson.features=[];
		for (i=0;i<this.tasks.length;i++){
			this.geojson.features.push(this.tasks[i].getGeojson());
		}
		return this.geojson;

		}
	//准备要给source用的feature
	Collect_Tasks.prototype.getFeatures=function(){
			var features=[];
			for (i = 0; i <this.tasks.length; i++) {
			
				features[i] = this.tasks[i].feature;
			  }
			return features;
		}
		//准备要给source用的feature
	Collect_Tasks.prototype.refreash=function(){
			//此任务集图层
			this.source=new ol.source.Vector({
					features: this.getFeatures()
				  });
			this.vectorLayer=new ol.layer.Vector({
					source: this.source
				  });
		}


    return Collect_Tasks;

});

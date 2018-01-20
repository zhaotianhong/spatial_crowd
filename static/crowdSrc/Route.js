
define(['ol','toolkit',],function (ol,toolkit) {	
	Route=function(opt){
			this.algorithm=opt.algorithm;
			this.plot=opt.plot;
			this.tasks=opt.tasks;
			
			this.view=toolkit.strToHtml("<div class='app-routeAlg app-routeActive'><br> "+this.algorithm+"</div>");
			this.view.route=this;
			
			this.createRouteFeature();	
		};
	
	//创建对应运输路线 
	Route.prototype.createRouteFeature=function(){				
				if(!this.feature){
					var coordinates=[];
					
					for(i=0;i<this.plot.length;i++){
						this.plot[i]=this.plot[i][i].split(";");//此时plot中每个元素都是一个，包含很多坐标字符串的数组。
						for(j=0;j<this.plot[i].length;j++){//["",""]
							var p=this.plot[i][j].split(",");
							var coord=[parseFloat(p[0]),parseFloat(p[1])];
							
							coordinates.push(coord);
						}
					}
					var lines= new ol.geom.LineString(coordinates);
					this.feature=new ol.Feature(lines);

					var stroke = new ol.style.Stroke({color: '#000000', width: 3});
					var style= new ol.style.Style({
				          stroke: stroke
				     });
					this.feature.setStyle(style);
				} 
				
				this.feature.route=this;
		};
	//创建对应task点 
	Route.prototype.getTasksOpts=function(opts){
				var TasksOpts=[];				
				if(opts.length>0){
					for(i=0;i<opts.length;i++){
						var op={
							id:opts[i].id,
							time_a:opts[i].arrive,
							time_d:opts[i].finish,
							volume:opts[i].q,
							x:opts[i].lat,
							y:opts[i].lon
						};
						TasksOpts.push(TasksOpts);
					}
					return TasksOpts;
				} 
				
				
		};

    return Route;

});


define(['ol','toolkit',],function (ol,toolkit) {	
	Task=function(opt,feature){
			this.id=opt.id||toolkit.getTaskID();
			this.coordinates=[parseFloat(opt.x),parseFloat(opt.y)];
			this.time_a=opt.time_a;
			this.time_d=opt.time_d;
			this.volume=opt.volume;
			

			this.view=this.createEle(opt);
			this.view.task=this;
			//有两个参数，因为有两种生成方式
			//一种是用户直接点地图来生成，一种是csv上传
			if(feature){
				this.feature=feature;
			}
			this.CreatFeature();
				
		}
	//表单输入改变task
	Task.prototype.change=function(opt){
			this.coordinates=[parseFloat(opt.x),parseFloat(opt.y)];
			this.time_a=opt.time_a;
			this.time_d=opt.time_d;
			this.volume=opt.volume;
		}
	//创建对应task点 
	Task.prototype.CreatFeature=function(){				
				if(!this.feature){
					var coo=this.coordinates;
					this.feature=new ol.Feature(new ol.geom.Point(coo));

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
					
					this.feature.setStyle(style);
				} 
				
				this.feature.task=this;
		}
	Task.prototype.createEle=function(opt){
				var tr=document.createElement("tr");				
				tr.className="app-task-tr";
				tr.innerHTML="<th>"+this.id+"</th>"+"<th>"+opt.time_a+"</th>"+"<th>"+opt.time_d+"</th>";
				
				return tr;
		}
	Task.prototype.getGeojson=function(){
				var th=this;
				var geojson={
					type:'task',
					geometry:{
						type:'point',
						coordinates:[parseFloat(th.coordinates[0]),parseFloat(th.coordinates[1])]
							},
					properties:{
						id:th.id,
						time_a:th.time_a,
						time_d:th.time_d,
						volume:th.volume
						},
				};
				
				
				return geojson;
		}	
	Task.prototype.changeEle=function(){
				
				$(this.view).innerHTML="<th>"+this.id+"</th>"+"<th>"+this.time_a+"</th>"+"<th>"+this.time_d+"</th>";
		}
	Task.prototype.select=function(point,zoom){
				var e=0.004/(zoom-9);

				var extent=[this.coordinates[0]-e,this.coordinates[1]-e,this.coordinates[0]+e,this.coordinates[1]+e];	

				if(extent[0]<point[0]&&point[0]<extent[2]&&extent[1]<point[1]&&point[1]<extent[3]){
					return this;
				}
				else return false;
				
		}

    return Task;

});

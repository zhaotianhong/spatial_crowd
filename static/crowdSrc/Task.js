
define(['ol','toolkit'],function (ol,toolkit) {	
	Task=function(opt,feature){
			
			this.geojson={
				type:'task',
				geometry:{
					type:'point',
					coordinates:[parseInt(opt.x),parseInt(opt.y)]
						},
				properties:{
					id:toolkit.getTaskID(),
					time_a:opt.time_a,
					time_d:opt.time_d,
					volume:opt.volume
					},
				};
			this.view=this.createEle(opt);
			this.view.task=this;
			//this.point
			if(feature){
				this.feature=feature;
			}
			this.ModifyFeature();
				
		}
	//表单输入改变task
	Task.prototype.change=function(opt){
				var tID=this.getID();
				this.geojson.properties={
					id:tID,
					time_a:opt.time_a,
					time_d:opt.time_d,
					volume:opt.volume
				}
				this.ModifyFeature();
		}
	//创建对应task点 
	Task.prototype.ModifyFeature=function(){				
				if(!this.feature){
					var coo=this.geojson.geometry.coordinates;
					var point=new ol.geom.Point(coo);
					var style=new ol.style.Style({
						  fill: new ol.style.Fill({
							color:'rgba(190,9,9,1)'
						  }),
						  
						});
					this.feature=new ol.Feature(point);
				} 
				
				this.feature.task=this;
		}
	Task.prototype.createEle=function(opt){
				var tID=this.getID();
				var th=document.createElement("tr");
				var id_tr=document.createElement("th");
				var a_tr=document.createElement("th");
				var d_tr=document.createElement("th");
				id_tr.innerHTML=tID;
				a_tr.innerHTML=opt.time_a;
				d_tr.innerHTML=opt.time_d;
				
				th.appendChild(id_tr);
				th.appendChild(a_tr);
				th.appendChild(d_tr);
				return th;
		}
	Task.prototype.getID=function(){
				var id=this.geojson.properties.id;
				return id;
		}	
	

    return Task;

});

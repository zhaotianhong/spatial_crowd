
define(['ol','toolkit'],function (ol,toolkit) {	
	Worker=function(opt){
			
			this.geojson={
				type:'worker',
				properties:{
					id:toolkit.getWorkerID(),
					velocity:opt.velocity,
					volume:opt.volume,
					radius:opt.radius
					}
				};
			this.view=this.createEle(opt);
			this.view.worker=this;
				
		}
	//表单输入改变worker
	Worker.prototype.change=function(opt){
				this.geojson.properties={
					velocity:opt.velocity,
					volume:opt.volume,
					radius:opt.radius
				}
		}
	
	Worker.prototype.createEle=function(opt){
				var wID=this.getID();
				var th=document.createElement("tr");
				var id_tr=document.createElement("th");
				var v_tr=document.createElement("th");
				var vol_tr=document.createElement("th");			
				var r_tr=document.createElement("th");
				
				id_tr.innerHTML=wID;
				v_tr.innerHTML=opt.velocity;
				vol_tr.innerHTML=opt.volume;
				r_tr.innerHTML=opt.radius;
				
				th.appendChild(id_tr);
				th.appendChild(v_tr);
				th.appendChild(vol_tr);
				th.appendChild(r_tr);
				return th;
		}
	Worker.prototype.getID=function(){
				var id=this.geojson.properties.id;
				return id;
		}
	

    return Worker;

});

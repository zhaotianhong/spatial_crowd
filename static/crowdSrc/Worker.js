
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
				var tr=document.createElement("tr");				
				tr.className="app-worker-tr";
				tr.innerHTML="<th>"+this.getID()+"</th>"+"<th>"+opt.velocity+"</th>"+"<th>"+opt.radius+"</th>"+"<th><span class='glyphicon glyphicon-minus-sign app-worker-delete' aria-hidden='true'> </th>";
				
				return tr;
		}
	Worker.prototype.getID=function(){
				var id=this.geojson.properties.id;
				return id;
		}
	

    return Worker;

});

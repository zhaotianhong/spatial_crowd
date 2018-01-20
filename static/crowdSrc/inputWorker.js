
define(['toolkit'],function (toolkit) {//

    var inputWorker=toolkit.strToHtml("<div class='modal fade' id='app-input-worker' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>"+
"  <div class='modal-dialog app-modal-workersid' role='document'>"+
 "   <div class='modal-content'>"+
  "    <div class='modal-header'>"+
   "     <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
    "    <h4 class='modal-title' '>workers Information</h4>"+
     " </div>"+
      "<div class='modal-body'>"+
       "<div class='app-inputgroup-worker'>"+
"		<table>"+
"			<tr>"+
"				<th class='app-input-worker-th'>"+
"						<p class='app-float app-input-worker-p'>Velocity:</p>"+
"						<input type='text' class='form-control app-input-worker-big app-input-worker-velocity ' value='20' aria-describedby='basic-addon1'>"+
"				</th>"+
"				<th class='app-input-worker-th'>"+
"						<p class='app-float app-input-worker-p'>Volume:</p>"+
"						<input type='text' class='form-control app-input-worker-volume ' value='10'  aria-describedby='basic-addon1'>"+
"				</th>				"+
"			</tr>			"+
"			<tr>"+
"				<th class='app-input-worker-th' colspan='2>"+
"						<p class='app-float app-input-worker-p'>radius:</p>"+
"						<input type='text' class='form-control app-input-worker-big app-input-worker-radius ' value='1000' aria-describedby='basic-addon1'>"+
"				</th>"+
"			</tr>			"+
"		</table>"+
"</div>"+
     " </div>"+
      "<div class='modal-footer'>"+
      "  <button type='button' class='btn btn-default app-dropWorker' data-dismiss='modal'>Close</button>"+
       " <button type='button' class='btn btn-danger app-saveWorker'>Save</button>"+
    "  </div>"+
   " </div>"+
 " </div>"+
"</div>");
	/* 
	*listenning
	*/
	//
	inputWorker.elementListen = function(){
		
		
	}
	
	/* 
	*method
	*/
	

	
    return inputWorker;
});

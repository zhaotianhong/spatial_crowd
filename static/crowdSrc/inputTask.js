
define(['toolkit'],function (toolkit) {

    var inputTask=toolkit.strToHtml("<div class='modal fade' id='app-input-task' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>"+
"  <div class='modal-dialog app-modal-tasksid' role='document'>"+
 "   <div class='modal-content'>"+
  "    <div class='modal-header'>"+
   "     <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
    "    <h4 class='modal-title' '>Tasks Information</h4>"+
     " </div>"+
      "<div class='modal-body'>"+
       "<div class='app-inputgroup-Task'>"+
"		<table>"+
"			<tr>"+
"				<th class='app-input-task-th' colspan='2'>"+
"						<p class='app-float app-input-task-p'>Volume:</p>"+
"						<input type='text' class='form-control app-input-Task-volume '   aria-describedby='basic-addon1'>"+
"				</th>				"+
"			</tr>			"+
"			<tr>"+
"				<th class='app-input-task-th'>"+
"						<p class='app-float app-input-task-p'>Start Time:</p>"+
"						<input type='text' class='form-control app-input-Task-big ' id='app-input-task-timeA'  aria-describedby='basic-addon1'>"+
"				</th>"+
"				<th class='app-input-task-th'>"+
"						<p class=' app-float app-input-task-p'>End Time:</p>"+
"						<input type='text' class='form-control  ' id='app-input-task-timeD'  aria-describedby='basic-addon1'>"+
"				</th>"+
"			</tr>"+
"			<tr>"+
"				<th class='app-input-task-th' colspan='2' >"+
"						<p class=' app-input-task-p'>Address:</p>"+
"						<div class=''>" +
					 "    <input type='text' class='form-control app-input-task-testXY app-float' disabled='disabled' placeholder='x省x市x区x街x号'>" +
					 "      <span class='input-group-btn'>" +
					   "      <button class='btn btn-default app-input-task-testXYBtn' disabled='disabled' type='button'>Relocation</button>" +
						 "  </span>" +
						" </div>" +
"				</th>"+
"			</tr>"+
"			<tr>"+
"				<th class='app-input-task-th'>"+
"						<p class=' app-input-task-p'>X:</p>"+
"						<p class=' app-input-task-p app-input-task-X'></p>"+
"				</th>"+
"				<th class='app-input-task-th'>"+
"						<p class='  app-input-task-p'>Y:</p>"+
"						<p class=' app-input-task-p app-input-task-Y'></p>"+
"				</th>"+
"			</tr>"+
"		</table>"+
"</div>"+
     " </div>"+
      "<div class='modal-footer'>"+
      "  <button type='button' class='btn btn-default app-dropTask' data-dismiss='modal'>Close</button>"+
       " <button type='button' class='btn btn-danger app-saveTask'>Save</button>"+
    "  </div>"+
   " </div>"+
 " </div>"+
"</div>");
	/* 
	*listenning
	*/
	//
	inputTask.elementListen = function(){
		
		
	}
	
	/* 
	*method
	*/
	

	
    return inputTask;
});

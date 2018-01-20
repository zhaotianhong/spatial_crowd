
define(['toolkit'],function (toolkit) {

    var inputTID=toolkit.strToHtml("<div class='modal fade' id='app-TID' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>"+
"  <div class='modal-dialog app-modal-tasksid' role='document'>"+
 "   <div class='modal-content'>"+
  "    <div class='modal-header'>"+
   "     <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
    "    <h4 class='modal-title' id='myModalLabel'>TasksID should be inputed</h4>"+
     " </div>"+
      "<div class='modal-body'>"+
     " <div>"+
       " <div class='input-group'>"+
		"  <span class='input-group-addon' id='basic-addon1'>Tasks_</span>"+
		 " <input type='text' class='form-control app-inputTasksid' placeholder='only numbers,letters and underscore are allowed ' aria-describedby='basic-addon1' />"+
	"	</div><p></p>"+
		"<div class='app-randomTasksDIV'>"+
				  " <input class='app-randomTasks app-float' type='checkbox'/>"+
	 " </div>"+
	 " <div ><label><p class='app-float'>&nbsp &nbsp Generate Random</p><div class='app-tasksNum'>20</div><p class='app-float'>  tasks</p><label> "+
	 " </div>"+
     " </div>"+
     " </div>"+
      "<div class='modal-footer'>"+
      "  <button type='button' class='btn btn-default app-dropID' data-dismiss='modal'>Close</button>"+
       " <button type='button' class='btn btn-danger app-saveID'>Save</button>"+
    "  </div>"+
   " </div>"+
 " </div>"+
"</div>");
	/* 
	*listenning
	*/
	//
	inputTID.elementListen = function(){
		
		
	}
	
	/* 
	*method
	*/
	

	
    return inputTID;
});

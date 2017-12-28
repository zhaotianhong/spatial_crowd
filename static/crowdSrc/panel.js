define(['ol', 'toolkit', 'bootstrap', 'member'], function (ol, toolkit, bootstrap, member) {

    //注意：不要再借助其他改界面了
    var myElement = toolkit.strToHtml("<div  class='app-control app-hidden'>" +
        "<div class='app-menu'>" +
        "		  <div class='btn-group btn-group-justified app-menus-div' role='group' aria-label='...'>" +
        "			  <div class='btn-group '  role='group' id='app-Tasks'>" +
        "				<button type='button' class='btn btn-default active'>tasks</button>" +
        "			  </div>" +
        "			  <div class='btn-group' role='group' id='app-Workers'>" +
        "				<button type='button' class='btn btn-default'>Workers</button>" +
        "			  </div>" +
        "			  <div class='btn-group' role='group' id='app-Routes'>" +
        "				<button type='button' class='btn btn-default'>Route</button>" +
        "			  </div>" +
        "			</div>" +
        "		</div>" +
        "		<div class='app-content'>" +
        "			<div id='app-Tasks-view' class='app-subContent' >" +
        "	<div role='presentation' class='dropdown app-choseTasks' id='app-dropdiv1'>	" +
        "				<button id='app-drop' type='button' class='btn btn-danger dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><p class='app-float' style='margin:0'>Select Tasks </p>" +
        "						<div class='app-floatRight'><span class='caret '></span>" +
        "						<span class='sr-only '>Toggle Dropdown</span></div>" +
        "				</button>" +
        "				<ul id='app-tasksMenu' class='dropdown-menu' aria-labelledby='app-drop'>" +
        "				  <li><a href='#' data-toggle='modal' class='app-addTasks' data-target='#app-TID'>Add Tasks</a></li>" +

        "				</ul>" +
        "			  </div>" +
        "				<div class=' app-tablediv app-taskTableDiv'>" +
        "						<div class='app-tableAdd app-tabletaskAdd app-hidden'><span class='glyphicon glyphicon-plus app-task-add' aria-hidden='true'></span>" +
        "						<span class='glyphicon glyphicon-minus app-task-delete' aria-hidden='true'></span></div>" +
        "						 <table class='table app-tasksTable' >" +
        "							<tr>" +
        "							<th>ask_id</th>" +
        "							<th>start_time</th>" +
        "							<th>end_time</th>" +
        "							</tr>" +
        "						</table>" +
        "				</div>" +
        "				<div class='app-uploading'>" +
        "				    <p style='font-size: small;margin-bottom: 0px;' >Or Add A CSV File</p>" +
        "                   <input type='file' id='app-upCSV' class='dropify' data-max-file-size='2M' data-allowed-file-extensions='csv' />" +
        "				</div>" +
        "				<div class='app-Ok'>" +
        "					<button class='btn btn-default app-ok app-float app-hidden' type='submit'>OK</button>" +
        "					<button class='btn btn-default app-no app-hidden' type='submit'>cancel</button>" +
        "<button class='btn btn-default app-display app-hidden app-floatRight' >display</button>" +
        "				</div>" +
        "			</div>" +
        "			<div id='app-Workers-view' class='app-hidden app-subContent'>" +
        "				<div class=' app-tablediv app-workerTableDiv'>" +
        "						<div class='app-tableAdd '><span class='glyphicon glyphicon-plus app-worker-add' aria-hidden='true'></span>" +
        "						<span class='glyphicon glyphicon-minus app-worker-delete' aria-hidden='true'></span></div>" +
        "						 <table class='table app-workersTable' >" +
        "							<tr>" +
        "							<th>worker_id</th>" +
        "							<th>volume</th>" +
        "							<th>velocity</th>" +
        "							<th>radius</th>" +
        "							</tr>" +
        "						</table>" +
        "				</div>" +
        "</div>" +
        "			<div id='app-Routes-view' class='app-hidden app-subContent'>" +
        "<div ><p class='app-route-check-p'>wait...</p>" +
        " <button type='button' class='btn btn-danger app-route-check'>route</button>" +
        "  </div>" +
        "</div>" +
        "		</div>	" +
        "	</div>");
    var panel = new ol.control.Control({element: myElement});
    //此面板此时对应的Tasks
    panel.curentTasks = {};
    panel.draw = false;
    /*
    *listenning
    */
    //切换目录
    panel.elementListen = function (map) {
        //菜单切换
        $(".app-menus-div").click(function (event) {
            if (event.target.tagName == 'BUTTON') {
                var id = $(event.target).parent()[0].id;
                panel.toggleMenu(id);
            }
            panel.toggleDrop(0);
        });
        //点击弹出模态框输入tasksID
        $(".app-addTasks").click(function () {
            $('#app-TID').modal('show');
        });
        //展开下拉框
        $(".dropdown-toggle").click(function () {
            panel.toggleDrop();

        });
        //手动添加task
        $(".app-task-add").click(function () {
            $('#app-input-task').modal('show');

        });
        //手动删除task
        $(".app-task-delete").click(function () {

        });
        //选择tasks app-task-add
        $("#app-tasksMenu").click(function (event) {
            if (event.target.tagName == 'A' && event.target.innerText != "Add Tasks") {
                $("#app-drop").children()[0].innerText = event.target.innerText;
                var li = $(event.target).parent()[0];

                panel.refreashContent(li.collect_Tasks);
                //收尾工作
                panel.toggleDrop(0);
                panel.muteEditTasks();
                panel.toggleBtn(1);
                panel.endDraw(map);
            }

        });
        //新建tasks 1.打开面板
        $(".app-dropID").click(function () {

            $(".app-inputTasksid")[0].value = "";
            $("#app-TID").modal('hide');
        });
        //新建tasks 1.打开面板
        $(".app-saveID").click(function () {
            //获取id
            var tasksid = $(".app-inputTasksid")[0].value;
            $("#app-drop").children()[0].innerText = "tasks_" + tasksid;
            $(".app-inputTasksid")[0].value = "";
            $("#app-TID").modal('hide');
            //收尾工作，准备面板 确保面板。地图干净，启用面板，显示底部 ok'与cancel两个btn
            panel.refreashContent(0);
            panel.clearUpload();

            panel.initEditTasks();
            panel.toggleBtn(2);

            panel.endDraw(map);
            panel.startDraw(map);


        });
        //取消创建Task
        $(".app-dropTask").click(function () {

            panel.clearAddTask();
            $("#app-TID").modal('hide');
        });
        //
        $(".app-input-task-testXYBtn").click(function () {
            var adddress = $(".app-input-task-testXY")[0].value;
            var obj = toolkit.testXY(adddress);

            $(".app-input-task-X")[0].innerText = obj.X;
            $(".app-input-task-Y")[0].innerText = obj.Y;
        });
        $(".app-saveTask").click(function () {
            var volume = $(".app-input-Task-volume")[0].value;
            var timeA = $("#app-input-task-timeA")[0].value;
            var timeD = $("#app-input-task-timeD")[0].value;

            var X = $(".app-input-task-X")[0].innerText;
            var Y = $(".app-input-task-Y")[0].innerText;

            var opt = {
                x: X,
                y: Y,
                time_a: timeA,
                time_d: timeD
            };
            var task = new member.Task(opt);
            $($('.app-tasksTable').children()[0]).append(task.view);

            panel.clearAddTask();
            $("#app-input-task").modal('hide');

        });//app-input-task-testXY

        //新建tasks .2.若不保存新建
        $(".app-no").click(function () {
            //下拉框重新要求选取
            $("#app-drop").children()[0].innerText = "Select Tasks";
            //关闭面板
            panel.muteEditTasks();
            panel.toggleBtn(0);
            panel.clearUpload();
            panel.refreashContent(0);
            panel.endDraw(map);
        });
        //新建tasks .2.保存新建，若列表中有则去除然后，在列表中建立task列表，3关闭编辑面板
        $(".app-ok").click(function () {
            var files = $('input[id="app-upCSV"]').prop('files');//获取到文件列表
            var trs = $($('.app-tasksTable').children()[0]).children();
            if (files.length == 0 && trs.length == 1) {
                alert('Add some tasks please');
                return;
            }
            else {
                var id = $("#app-drop").children()[0].innerText;
                var newtasks = new member.Collect_Tasks(id);
                //先将表单中数据加入
                if (trs.length > 1) {
                    for (i = 1; i < trs.length; i++) {
                        newtasks.addTasks([trs[i].task]);
                    }
                }
                //再将上传文件中每个传入给
                if (files.length != 0) {
                    var reader = new FileReader();//新建一个FileReader
                    reader.readAsText(files[0]);//读取文件
                    reader.onload = function (evt) {//读取完文件之后会回来这里

                        var fileString = evt.target.result;
                        var ts = toolkit.parseTasksCsv(fileString, member);

                        newtasks.addTasks(ts);
                        for (i = 0; i < ts.length; i++) {
                            $($('.app-tasksTable').children()[0]).append(ts[i].view);
                        }
                    }
                }
                //
                //判断是不是初次添加
                if ($("#app-tasksMenu").children().length == 1) {
                    var line = toolkit.strToHtml("<li role='separator' class='divider'></li>");
                    $("#app-tasksMenu").append(line);
                }
                //收尾工作
                panel.curentTasks = newtasks;
                $("#app-tasksMenu").append(panel.curentTasks.view);
                panel.toggleBtn(1);
                panel.clearUpload();
                panel.muteEditTasks();
                panel.endDraw(map);
            }


        });
        $(".app-display").click(function () {
            if ($(".app-display")[0].innerText == 'display') {


                map.addLayer(panel.curentTasks.vectorLayer);
                $(".app-display")[0].innerText = 'undisplay';

            }
            else if ($(".app-display")[0].innerText == 'undisplay') {
                map.removeLayer(panel.curentTasks.vectorLayer);
                $(".app-display")[0].innerText = 'display';
            }

        });


        //***********************worker***********************************
        //手动添加worker
        $(".app-worker-add").click(function () {
            $('#app-input-worker').modal('show');

        });
        //取消添加worker
        $(".app-dropWorker").click(function () {

            panel.clearAddWorker();
            $("#app-input-worker").modal('hide');
        });
        //保存添加的worker
        $(".app-saveWorker").click(function () {
            var v = $(".app-input-worker-velocity")[0].value;
            var vol = $(".app-input-worker-volume")[0].value;
            var r = $(".app-input-worker-radius")[0].value

            var opt = {
                velocity: v,
                volume: vol,
                radius: r
            };
            var worker = new member.Worker(opt);
            $($('.app-workersTable').children()[0]).append(worker.view);

            panel.clearAddWorker();
            $("#app-input-worker").modal('hide');

        });


        //*****************************route**************************
        $(".app-route-check").click(function () {
            var data = {
            }
            $.ajax({
                type: 'GET',
                url: '/result/',
                data: data,
                success: function (data) {
                    console.log(data);
                },
                error: function (e) {
                    console.log(e);
                }
            });

            var taskcheck = "is ready";
            var workercheck = "is ready";
            if ($(".app-display").hasClass('app-hidden')) {
                taskcheck = "is NOT ready";
            }
            if ($($('.app-workersTable').children()[0]).children().length == 1) {
                workercheck = "is NOT ready";
            }
            $(".app-route-check-p")[0].innerText = "tasks " + taskcheck + "\n" + "workers " + workercheck;

        });
    }

    /*
    *method
    */
    //切换目录
    panel.toggleMenu = function (id) {
        var menu = "#" + id;
        var view = "#" + id + "-view";
        var menus = ['#app-Tasks', '#app-Workers', '#app-Routes'];
        var views = ['#app-Tasks-view', '#app-Workers-view', '#app-Routes-view'];
        for (i = 0; i < menus.length; i++) {
            var keyW = menus[i];
            var bt = $(keyW).children()[0];
            if ($(bt).hasClass('active')) {
                $(bt).removeClass('active');
            }
        }
        for (j = 0; j < views.length; j++) {
            var keyW = views[j];
            if (!($(keyW).hasClass('app-hidden'))) {
                $(keyW).addClass('app-hidden');
            }
        }
        var bt = $(menu).children()[0];
        $(bt).addClass('active');
        $(view).removeClass('app-hidden');

    };
    //展开下拉框
    panel.toggleDrop = function (boo) {
        //切换
        if ($("#app-dropdiv1").hasClass('open')) {
            $("#app-dropdiv1").removeClass('open');
            $(".dropdown-toggle")[0].attributes[5].value = false;
        }
        else {
            $("#app-dropdiv1").addClass('open');
            $(".dropdown-toggle")[0].attributes[5].value = true;
        }
        //有参数时候则判断，为0则关
        if (boo == 0 && $("#app-dropdiv1").hasClass('open')) {
            $("#app-dropdiv1").removeClass('open');
            $(".dropdown-toggle")[0].attributes[5].value = false;
        }

    };
    //禁用EditTasks
    panel.muteEditTasks = function () {
        var div = $('#app-upCSV').parent()[0];
        if ($(div).hasClass('dropify-wrapper')) {
            if (!$(div).hasClass('disabled')) {
                $(div).addClass('disabled')
                $('#app-upCSV').attr("disabled", true);
            }
        }
        if (!$(".app-tabletaskAdd").hasClass('app-hidden')) {
            $(".app-tabletaskAdd").addClass('app-hidden');
        }
        panel.clearUpload();
    };
    //启用EditTasks
    panel.initEditTasks = function () {
        //
        var div = $('#app-upCSV').parent()[0];
        if ($(div).hasClass('dropify-wrapper')) {
            if ($(div).hasClass('disabled')) {
                $(div).removeClass('disabled')
                $('#app-upCSV').attr("disabled", false);
            }
        }
        if ($(".app-tabletaskAdd").hasClass('app-hidden')) {
            $(".app-tabletaskAdd").removeClass('app-hidden');
        }
    };
    //控制下部按钮显示 1为display，2为save和cancel,0为都不显示
    panel.toggleBtn = function (boo) {
        var btns = ['.app-display', '.app-ok', '.app-no', '.app-undisplay'];
        for (i = 0; i < btns.length; i++) {
            var bt = btns[i];
            if (!$(bt).hasClass('app-hidden')) {
                $(bt).addClass('app-hidden');
            }
        }
        if (boo == 1) {
            $(".app-display").removeClass('app-hidden');
            $(".app-undisplay").removeClass('app-hidden');
        }
        if (boo == 2) {
            $(".app-ok").removeClass('app-hidden');
            $(".app-no").removeClass('app-hidden');
        }
    };
    //清空上传
    panel.clearUpload = function () {
        var remove = $('#app-upCSV').next();
        if (remove[0].innerText == "REMOVE") {
            $(remove).trigger("click");
        }
    };

    //控制如何刷新content（包括地图种图层），0，一切清空(面版+两个vector Layer)， 或为对应要选的collectTasks，并按照选中的collectTasks刷新
    panel.refreashContent = function (boo) {
        if (boo == 0) {
            $('.app-tasksTable').children()[0].innerHTML = "<tr><th>ask_id</th><th>start_time</th><th>end_time</th></tr>";
            if ($(".app-display") && $(".app-display")[0].innerText == 'undisplay') {
                $(".app-display").trigger("click");
            }
            if (member.source.getFeatures().length > 0) {
                member.source.clear();
            }

        }
        if (boo != 0) {

            if ($(".app-display") && $(".app-display")[0].innerText == 'undisplay') {
                $(".app-display").trigger("click");
            }
            panel.curentTasks = boo;
            $('.app-tasksTable').children()[0].innerHTML = "<tr><th>ask_id</th><th>start_time</th><th>end_time</th></tr>";
            var ts = panel.curentTasks.tasks;
            for (i = 0; i < ts.length; i++) {
                $($('.app-tasksTable').children()[0]).append(ts[i].view);
            }
            if (member.source.getFeatures().length > 0) {
                member.source.clear();
            }

        }
    };
    //清空addTask弹窗
    panel.clearAddTask = function () {
        $(".app-input-Task-volume")[0].value = "";
        $("#app-input-task-timeA")[0].value = "";
        $("#app-input-task-timeD")[0].value = "";
        $(".app-input-task-testXY")[0].value = "";

        $(".app-input-task-X")[0].innerText = "";
        $(".app-input-task-Y")[0].innerText = "";
    };
    //清空addTask弹窗
    panel.startDraw = function (map) {

        map.addInteraction(member.draw);
        //map.addInteraction(member.select);
    };
    panel.endDraw = function (map) {
        if (map.getInteractions().getLength() > 0) {
            if (member.source.getFeatures().length > 0) {
                member.source.clear();
            }
            map.removeInteraction(member.draw);

        }

    };

    //***********************************************worker****************************************
    //清空addTask弹窗
    panel.clearAddWorker = function () {
        $(".app-input-worker-velocity")[0].value = "";
        $(".app-input-worker-volume")[0].value = "";
        $(".app-input-worker-radius")[0].value = "";
    };


    return panel;
});

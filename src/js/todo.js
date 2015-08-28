define(['util', 'jquery'], function(_, $) {


    var testData = [{
        catename: "默认分类",
        subcate: [],
        tasks: [{
            taskname: "todo1",
            date: "2015-01-01",
            completed: false,
            taskcontent: "默认分类  todo1",
            task_id: 0,
            sub_id: -1,
            id: 0
        }, {
            taskname: "todo2",
            date: "2015-11-11",
            completed: false,
            taskcontent: "默认分类  todo2",
            task_id: 1,
            sub_id: -1,
            id: 0
        }],
        id: 0,
        count: 2
    }, {
        catename: "模块化",
        subcate: [{
            subcatename: "模块化子类",
            tasks: [{
                taskname: "学习requirejs",
                date: "2015-05-12",
                completed: false,
                taskcontent: "AMD",
                task_id: 0,
                sub_id: 0,
                id: 1
            }],
            count: 1,
            file_id: 1,
            sub_id: 0
        }],
        tasks: [],
        id: 1,
        count: 0
    }];

    if (!localStorage.getItem("testData")) {
        localStorage.setItem("testData", JSON.stringify(testData));
    }

    var localData = JSON.parse(localStorage.getItem("testData"));



    function init() {

        _.addEvent($('.addCategory')[0], "click", openDialog);
        _.addEvent($('.dialog-title>span')[0], "click", closeDialog);
        _.addEvent($('.dialog-ok .cancel')[0], "click", closeDialog);
        _.addEvent($('.dialog-ok .confirm')[0], "click", addCategory);
        _.addEvent($('.addTask')[0], "click", addTask);
        _.addEvent($('.edit')[0], "click", editTask);
        _.addEvent($('.complete')[0], "click", taskCompleted);
        // _.addEvent($('.all-category')[0],"click",allTaskShow);


        //载入localStorage中的数据
        for (var i = 0; i < localData.length; i++) {

            var cateUl = document.createElement("ul");
            // cateUl.innerHTML= '<div><img src="img/category.png">'+ localData[i].catename +' (<span class="?-num"></span>)<sapn class="delete">X</sapn></div>' ;
            cateUl.innerHTML = '<div><img src="src/img/category.png">' + localData[i].catename + ' (' + localData[i].tasks.length + ')<img class="delete" src="src/img/delete.png"></div>';

            $(".category-list")[0].appendChild(cateUl);
            _.addClass(cateUl, 'category-list-item');

            var cateOption = document.createElement("option");
            cateOption.innerHTML = '<option value="' + i + '">' + localData[i].catename + '</option>';
            $(".category-select")[0].appendChild(cateOption);

            if (localData[i].subcate.length != 0) {
                for (var j = 0; j < localData[i].subcate.length; j++) {

                    var subcateLi = document.createElement('li');
                    subcateLi.setAttribute('sub_id', localData[i].subcate[j].sub_id);
                    // subcateLi.innerHTML = '<img src="img/task.png">'+ localData[i].subcate[j].subcatename +' (<span class="?-num"></span>)<sapn class="delete">X</sapn>' ;
                    subcateLi.innerHTML = '<img src="src/img/task.png">' + localData[i].subcate[j].subcatename + ' (' + localData[i].subcate[j].tasks.length + ')<img class="delete" src="src/img/delete.png">';

                    cateUl.appendChild(subcateLi);


                }

            }

            $('.task-num')[0].innerHTML = countTask();
        }


    }
    // 打开分类弹窗
    function openDialog() {
        $('.error')[0].innerHTML = '';
        $('.mask')[0].style.display = 'block';
        $('.dialog')[0].style.display = 'block';
    }

    //关闭分类弹窗
    function closeDialog() {
        $('.mask')[0].style.display = 'none';
        $('.dialog')[0].style.display = 'none';
    }


    //添加分类
    function addCategory() {
        var cate_name = $('.category-name')[0].value.replace(/^\s+|\s+$/g, '');
        var file_name = $('.category-select')[0].value;
        //var localData = getLocalData();
        var i;

        if (cate_name.length === 0) { // 检测输入合法性
            $('.error')[0].innerHTML = '分类名称不能为空';
            return;
        } else if (cate_name.length >= 8) {
            $('.error')[0].innerHTML = '分类名称应小于8个字符';
            return;
        }
        if (cate_name) {
            if (file_name === 'new-category') {
                var newCate = {
                    'catename': cate_name,
                    'subcate': [],
                    'tasks': [],
                    'id': localData[localData.length - 1].id + 1,
                    'count': 0
                };
                if (_.getObjByKey(localData, 'catename', cate_name)) {
                    $('.error')[0].innerHTML = '相同名称的分类已存在';
                    return;
                }
                var cateUl = document.createElement("ul");
                // cateUl.innerHTML= '<div><img src="img/category.png"><span>'+ cate_name +'</span> (<span class="?-num"></span>)<sapn class="delete">X</sapn></div>' ;
                cateUl.innerHTML = '<div><img src="src/img/category.png">' + cate_name + ' (' + 0 + ')<img class="delete" src="src/img/delete.png"></div>';
                $(".category-list")[0].appendChild(cateUl);

                _.addClass(cateUl, 'category-list-item');
                localData.push(newCate);


                var cateOption = document.createElement("option");
                cateOption.innerHTML = '<option value="' + i + '">' + cate_name + '</option>';
                $(".category-select")[0].appendChild(cateOption);

            } else {
                var index = _.getIndexByKey(localData, 'catename', file_name);

                if (localData[index].subcate.length > 0) {
                    var newChild = {
                        'subcatename': cate_name,
                        'tasks': [],
                        'count': 0,
                        'file_id': index,
                        'sub_id': localData[index].subcate[localData[index].subcate.length - 1].sub_id + 1
                    }
                } else {
                    var newChild = {
                        'subcatename': cate_name,
                        'tasks': [],
                        'count': 0,
                        'file_id': index,
                        'sub_id': 0
                    }
                }
                if (_.getObjByKey(localData[index].subcate, 'subcatename', cate_name)) {
                    $('.error')[0].innerHTML = '相同名称的子类已存在';
                    return;
                }

                var subcateLi = document.createElement("li");
                subcateLi.setAttribute('sub_id', localData[index].subcate.length);

                subcateLi.innerHTML = '<img src="src/img/task.png">' + cate_name + '(' + 0 + ')<img class="delete" src="src/img/delete.png">';

                $(".category-list-item")[index].appendChild(subcateLi);

                localData[index].subcate.push(newChild);


            }
        }
        localStorage.testData = JSON.stringify(localData);
        taskListShow();
        Delete();
        closeDialog();

    }



    function categoryChosen(event) {
        event = event || window.event;
        window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止事件冒泡
        var target = event.target || event.srcElement;

        var otherChoose = target.parentNode.parentNode.getElementsByTagName('*');
        for (var i = 0; i < otherChoose.length; i++) {
            if (_.hasClass(otherChoose[i], 'isChosen')) {
                _.removeClass(otherChoose[i], 'isChosen');
                break;
            }
        }

        _.addClass(target, 'isChosen');
        var cateChosen = $(".isChosen")[0];
        var cateChosenName;
        if (cateChosen.innerText) {
            cateChosenName = cateChosen.innerText;
        } else {
            cateChosenName = cateChosen.textContent;
        }

        if (cateChosen.parentNode.innerText) {
            cateChosenNamep = cateChosen.parentNode.innerText;
        } else {
            cateChosenNamep = cateChosen.parentNode.textContent;
        }
        var eleTag = target.tagName.toLowerCase();
        var taskIdArr = [];
        switch (eleTag) {
            case "div": //父分类

                var file_name = (cateChosenName.split('(')[0]).replace(/^\s+|\s+$/g, '');

                var file = _.getObjByKey(localData, 'catename', file_name);
                var file_id = file.id;

                $('.task-list')[0].innerHTML = "";
                if (file.tasks.length > 0) {
                    for (var j = 0; j < file.tasks.length; j++) {
                        taskIdArr.push(file.tasks[j]);

                    }
                }
                makeTaskById(taskIdArr);
                break;


            case "li": //子分类
                var file_name = (cateChosenNamep.split('(')[0]).replace(/^\s+|\s+$/g, '');
                var file = _.getObjByKey(localData, 'catename', file_name);
                var file_id = file.id;

                var sub_name = (cateChosenName.split('(')[0]).replace(/^\s+|\s+$/g, '');
                var sub = _.getObjByKey(file.subcate, 'subcatename', sub_name);
                var sub_id = sub.sub_id;

                $('.task-list')[0].innerHTML = "";
                for (var j = 0; j < sub.tasks.length; j++) {
                    taskIdArr.push(sub.tasks[j]);

                }

                makeTaskById(taskIdArr);
                break;
            case "img":
                _.removeClass(target, 'isChosen');
                break;
            case "ul":

                _.removeClass(target, 'isChosen');
                break;
        }


        var arr = [file_id, sub_id];
        return (arr);

    }
    //生产任务列表
    function makeTaskById(taskIdArr) {
        var date = [];
        var taskObj;

        var c = findChosenInCatalog();

        var file_id = c[0];
        var sub_id = c[1];
        if (!(file_id || sub_id)) {
            file_id = 0;
            sub_id = -1;
        }
        if (sub_id !== -1) {
            var file = _.getObjByKey(localData, 'id', file_id);
            var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);


            for (var i = 0; i < taskIdArr.length; i++) {

                taskObj = _.getObjByKey(sub.tasks, 'task_id', taskIdArr[i].task_id);
                date.push(taskObj.date);
            }
        } else {

            var file = _.getObjByKey(localData, 'id', file_id);
            for (var i = 0; i < taskIdArr.length; i++) {

                taskObj = _.getObjByKey(file.tasks, 'task_id', taskIdArr[i].task_id);
                date.push(taskObj.date);
            }
        }
        date = _.uniqArray(date);
        date = _.sortDate(date); // 排序


        for (var i = 0; i < date.length; i++) {

            var taskList = document.createElement('ul');
            _.addClass(taskList, 'task-list-item');
            taskList.innerHTML = '<div class="task-date">' + date[i] + '</div>';

            for (var j = 0; j < taskIdArr.length; j++) {
                if (sub_id !== -1) {
                    var file = _.getObjByKey(localData, 'id', file_id);
                    var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);

                    taskObj = _.getObjByKey(sub.tasks, 'task_id', taskIdArr[j].task_id);

                } else {

                    var file = _.getObjByKey(localData, 'id', file_id);
                    taskObj = _.getObjByKey(file.tasks, 'task_id', taskIdArr[j].task_id);

                }

                if (taskObj.date === date[i]) {
                    if (taskObj.completed === true) {
                        var taskListName = document.createElement('li');
                        _.addClass(taskListName, 'task-list-name completed');
                        taskListName.innerHTML = taskObj.taskname + '<img class="delete" src="src/img/delete.png">'
                    } else if (taskObj.completed === false) {
                        var taskListName = document.createElement('li');
                        _.addClass(taskListName, 'task-list-name');
                        taskListName.innerHTML = taskObj.taskname + '<img class="delete" src="src/img/delete.png">'

                    }

                    taskList.appendChild(taskListName);

                }
            }

            $('.task-list')[0].appendChild(taskList);
        }



    }

    function findChosenInCatalog() {
        var chosen = $(".isChosen")[0];
        var current;
        var cateChosenName;

        if (chosen.innerText) {
            chosenName = chosen.innerText;
        } else {
            chosenName = chosen.textContent;
        }

        if (chosen.parentNode.innerText) {
            chosenNamep = chosen.parentNode.innerText;
        } else {
            chosenNamep = chosen.parentNode.textContent;
        }

        if (chosen == null)
            return {};
        if (chosen.tagName.toLowerCase() == "div") { //choose catalog
            var file_name = (chosenName.split('(')[0]).replace(/^\s+|\s+$/g, '');
            var file = _.getObjByKey(localData, 'catename', file_name);
            var file_id = file.id;
            // if catalog contains todos(suppose catalog can only contains todos or tasks)
            current = [file_id, -1];
            //current=localData[file_id];
        } else {
            var file_name = (chosenNamep.split('(')[0]).replace(/^\s+|\s+$/g, '');
            var file = _.getObjByKey(localData, 'catename', file_name);
            var file_id = file.id;
            var sub_id = parseInt(chosen.getAttribute("sub_id"));
            current = [file_id, sub_id];
            //current=localData[file_id].subcate[sub_id];
        }
        return current;
    }


    //删除
    function Delete(event) {
        var cateDel = $('.category-list-item .delete');
        for (var i = 0; i < cateDel.length; i++) {
            _.addEvent(cateDel[i], "click", categoryDelete);

        }
    }

    //删除类别
    function categoryDelete(event) {
        event = event || window.event;
        window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止事件冒泡
        var con = confirm("确定要删除该类别吗？");
        if (!con) {
            return;
        } else {
            taskListShow();
        }
        var target = event.target || event.srcElement;
        var eleTag = target.parentNode.tagName.toLowerCase();
        switch (eleTag) {
            case "div": //父分类
                var file_name = ((target.parentNode.innerText).split('(')[0]).replace(/^\s+|\s+$/g, '');
                var file = _.getObjByKey(localData, 'catename', file_name);
                var file_id = file.id;
                for (var i = 0; i < localData.length; i++) {
                    if (localData[i].id == file_id) {
                        localData.splice(i, 1);
                    }
                }
                // if(file_id==localData[localData.length-1].id){
                //         localData.splice(file_id,1);
                //     }
                $('.category-list')[0].innerHTML = '分类列表';
                localStorage.testData = JSON.stringify(localData);
                init();

                break;
            case "li":
                var file_name = ((target.parentNode.parentNode.innerText).split('(')[0]).replace(/^\s+|\s+$/g, '');
                var file = _.getObjByKey(localData, 'catename', file_name);
                var file_id = file.id;
                var sub_name = ((target.parentNode.innerText).split('(')[0]).replace(/^\s+|\s+$/g, '');
                var sub = _.getObjByKey(file.subcate, 'subcatename', sub_name);
                var sub_id = sub.sub_id;

                for (var i = 0; i < file.subcate.length; i++) {
                    if (file.subcate[i].sub_id == sub_id) {
                        file.subcate.splice(i, 1);

                    }
                }

                $('.category-list')[0].innerHTML = '分类列表';
                localStorage.testData = JSON.stringify(localData);
                init();
                break;
        }
        taskListShow();
        Delete();
    }

    function countTask() {
        var total;
        var sum1 = 0;
        var sum2 = 0;

        for (var i = 0; i < localData.length; i++) {

            sum1 += localData[i].tasks.length;

            if (localData[i].subcate.length !== 0) {
                for (var k = 0; k < localData[i].subcate.length; k++) {
                    sum2 += localData[i].subcate[k].tasks.length;
                }

            }

        }
        total = sum1 + sum2;
        return total;
    }

    function allTaskShow() {
        var taskIdArr = [];
        for (var i = 0; i < localData.length; i++) {
            for (var j = 0; j < localData[i].tasks.length; j++) {
                taskIdArr.push(localData[i].tasks[j].task_id);
            }


            if (localData[i].subcate.length !== 0) {
                for (var k = 0; k < localData[i].subcate.length; k++) {
                    for (var l = 0; l < localData[i].subcate[k].tasks.length; l++) {
                        taskIdArr.push(localData[i].subcate[k].tasks[l].task_id);
                    }

                }

            }

        }
        makeTaskById(taskIdArr);
    }


    //选中分类栏的类别呈现对应的任务列表
    function taskListShow() {
        var category_lists = $('.category-list-item');
        for (var i = 0; i < category_lists.length; i++) {
            _.addEvent(category_lists[i], "click", categoryChosen);
        }



    }

    function taskContentShow() {

        var task_lists = $('.task-list');
        for (var i = 0; i < task_lists.length; i++) {
            _.addEvent(task_lists[i], "click", taskContent);

        }

    }

    function statusShow() {
        var status = $('.status li');
        for (var i = 0; i < status.length; i++) {
            _.addEvent(status[i], "click", statusClick)
        }
    }

    //任务状态
    function statusClick(event) {
        event = event || window.event;
        window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止事件冒泡
        var target = event.target || event.srcElement;

        var otherChoose = target.parentNode.parentNode.getElementsByTagName('*');
        for (var i = 0; i < otherChoose.length; i++) {
            if (_.hasClass(otherChoose[i], 'active')) {
                _.removeClass(otherChoose[i], 'active');
                break;
            }
        }
        _.addClass(target, 'active');
        var oli = $(".active")[0];
        var allTask = $('.task-list-name');

        var statusname = (oli.innerText).replace(/^\s+|\s+$/g, '');
        if (statusname.indexOf('所有') !== -1) {
            for (var i = 0; i < allTask.length; i++) {
                allTask[i].style.display = 'block';
                allTask[i].parentNode.style.display = 'block';
            }

        } else if (statusname.indexOf('未完成') !== -1) {
            for (var i = 0; i < allTask.length; i++) {
                allTask[i].style.display = 'none';
                allTask[i].parentNode.style.display = 'none';
            }
            for (var i = 0; i < allTask.length; i++) {
                if (allTask[i].className.indexOf('completed') === -1) {
                    allTask[i].style.display = 'block';
                    allTask[i].parentNode.style.display = 'block';
                }
            }


        } else if (statusname.indexOf('已完成') !== -1) {
            for (var i = 0; i < allTask.length; i++) {
                allTask[i].style.display = 'none';
                allTask[i].parentNode.style.display = 'none';
            }
            for (var i = 0; i < allTask.length; i++) {
                if (allTask[i].className.indexOf('completed') !== -1) {
                    allTask[i].style.display = 'block';
                    allTask[i].parentNode.style.display = 'block';
                }
            }
        }


    }
    //点击任务名称显示任务的具体内容
    function taskContent(event) {

        $('.tips')[0].style.display = 'none';
        readTask();
        var c = findChosenInCatalog();

        var file_id = c[0];
        var sub_id = c[1];

        event = event || window.event;
        // window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止事件冒泡
        var target = event.target || event.srcElement;

        var otherChoose = target.parentNode.parentNode.getElementsByTagName('*');
        for (var i = 0; i < otherChoose.length; i++) {
            if (_.hasClass(otherChoose[i], 'isSelected')) {
                _.removeClass(otherChoose[i], 'isSelected');
                break;
            }
        }
        _.addClass(target, 'isSelected');
        var Chosen = $(".isSelected")[0];

        if (Chosen.innerText) {
            chosenName = Chosen.innerText;
        } else {
            chosenName = Chosen.textContent;
        }


        //alert(this); // ul
        var eleTag = target.tagName.toLowerCase();
        // if (!(file_id || sub_id)) {
        //     file_id = 0;
        //     sub_id = -1;
        // }
        switch (eleTag) {
            case "li": //父分类
                var task_name = chosenName.replace(/^\s+|\s+$/g, '');
                if (sub_id !== -1) {
                    var file = _.getObjByKey(localData, 'id', file_id);
                    var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
                    var taskObj = _.getObjByKey(sub.tasks, 'taskname', task_name);

                    var task_id = taskObj.task_id;
                    var task_title = taskObj.taskname;
                    var task_date = taskObj.date;
                    var task_details = taskObj.taskcontent;
                    // var task_id = _.getIndexByKey(localData[file_id].subcate[sub_id].tasks, 'taskname', task_name);

                    // var task_title = localData[file_id].subcate[sub_id].tasks[task_id].taskname;
                    // var task_date = localData[file_id].subcate[sub_id].tasks[task_id].date;
                    // var task_details = localData[file_id].subcate[sub_id].tasks[task_id].taskcontent;


                } else {
                    var file = _.getObjByKey(localData, 'id', file_id);

                    var taskObj = _.getObjByKey(file.tasks, 'taskname', task_name);

                    var task_id = taskObj.task_id;
                    var task_title = taskObj.taskname;
                    var task_date = taskObj.date;
                    var task_details = taskObj.taskcontent;
                    // var task_id = _.getIndexByKey(localData[file_id].tasks, 'taskname', task_name);

                    //     var task_title = localData[file_id].tasks[task_id].taskname;
                    //     var task_date = localData[file_id].tasks[task_id].date;
                    //     var task_details = localData[file_id].tasks[task_id].taskcontent;


                }
                $('.content input')[0].value = task_title;
                $('.content input')[1].value = task_date;
                $('.content textarea')[0].value = task_details;
                break;

            case "div":
                _.removeClass(target, 'isSelected');
                return false;
                break;

            case "ul":
                _.removeClass(target, 'isSelected');
                return false;
                break;

            case "img":
                $(target).onclick = taskDelete();
                break;

        }

    }



    //将task标注为完成
    function taskCompleted() {

        var selecting = $('.isSelected')[0];
        if (selecting) {
            var task_name = (selecting.innerText).replace(/^\s+|\s+$/g, '');

            var c = findChosenInCatalog();

            var file_id = c[0];
            var sub_id = c[1];


            var task_name = (selecting.innerText).replace(/^\s+|\s+$/g, '');

            if (sub_id !== -1) {
                var file = _.getObjByKey(localData, 'id', file_id);
                var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
                var taskObj = _.getObjByKey(sub.tasks, 'taskname', task_name);
                if (taskObj.completed) {
                    alert("任务已完成！");
                    return;
                }
                var con = confirm("确定任务已完成吗？");
                if (!con) {
                    return;
                }
                taskObj.completed = true;
                _.addClass(selecting, 'completed');
                // _.removeClass(selecting,'isSelected');

            } else {
                var file = _.getObjByKey(localData, 'id', file_id);
                var taskObj = _.getObjByKey(file.tasks, 'taskname', task_name);
                if (taskObj.completed) {
                    alert("任务已完成！");
                    return;
                }
                var con = confirm("确定任务已完成吗？");
                if (!con) {
                    return;
                }
                taskObj.completed = true;
                _.addClass(selecting, 'completed');
                // _.removeClass(selecting,'isSelected');


            }
            localStorage.testData = JSON.stringify(localData);
            readTask();
        }


    }


    //删除任务
    function taskDelete(event) {

        event = event || window.event;
        // window.event ? window.event.cancelBubble = true : event.stopPropagation(); // 阻止事件冒泡
        var con = confirm("确定要删除该任务吗？");
        if (!con) {
            return;
        }
        var target = event.target || event.srcElement;

        var c = findChosenInCatalog();

        var file_id = c[0];
        var sub_id = c[1];
        var taskIdArr = [];

        var task_name = (target.parentNode.innerText).replace(/^\s+|\s+$/g, '');
        if (!(file_id || sub_id)) {
            file_id = 0;
            sub_id = -1;
        }
        if (sub_id !== -1) {
            var file = _.getObjByKey(localData, 'id', file_id);
            var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
            index = _.getIndexByKey(sub.tasks, 'taskname', task_name);

            sub.tasks.splice(index, 1);
            localStorage.testData = JSON.stringify(localData);

            $('.task-list')[0].innerHTML = '';
            for (var j = 0; j < sub.tasks.length; j++) {
                taskIdArr.push(sub.tasks[j]);
            }

            makeTaskById(taskIdArr);

        } else {
            var file = _.getObjByKey(localData, 'id', file_id);
            index = _.getIndexByKey(file.tasks, 'taskname', task_name);

            file.tasks.splice(index, 1);

            localStorage.testData = JSON.stringify(localData);
            $('.task-list')[0].innerHTML = '';

            if (file.tasks.length > 0) {
                for (var j = 0; j < file.tasks.length; j++) {
                    taskIdArr.push(file.tasks[j]);
                }
            }
            makeTaskById(taskIdArr);

        }
        $('.category-list')[0].innerHTML = '分类列表';
        localStorage.testData = JSON.stringify(localData);
        init();
        taskListShow();
        Delete();
        readTask();

    }

    //添加任务模式
    function addTask() {

        _.addEvent($('.btn-save')[0], "click", saveTask);
        _.addEvent($('.btn-cancel')[0], "click", cancelTask);
        $('.content input')[0].disabled = false;
        $('.content input')[1].disabled = false;
        $('.content textarea')[0].disabled = false;
        $('.content input')[0].value = '';
        $('.content input')[1].value = '';
        $('.content textarea')[0].value = '';
        _.addClass($('.content input')[0], 'task-editing');
        _.addClass($('.content input')[1], 'task-editing');
        _.addClass($('.content textarea')[0], 'task-editing');
        $('.edit')[0].style.display = 'none';
        $('.complete')[0].style.display = 'none';
        $('.btn-save')[0].style.display = 'inline';
        $('.btn-cancel')[0].style.display = 'inline';
        $('.tips')[0].style.display = 'inline';
        $('.tips')[0].innerHTML = '';
    }

    //不可编辑任务模式
    function readTask() {
        $('.content input')[0].disabled = true;
        $('.content input')[1].disabled = true;
        $('.content textarea')[0].disabled = true;

        _.removeClass($('.content input')[0], 'task-editing');
        _.removeClass($('.content input')[1], 'task-editing');
        _.removeClass($('.content textarea')[0], 'task-editing');
        $('.edit')[0].style.display = 'inline';
        $('.complete')[0].style.display = 'inline';
        $('.btn-save')[0].style.display = 'none';
        $('.btn-cancel')[0].style.display = 'none';
        $('.tips')[0].innerHTML = '';
    }

    function cancelTask() { //放弃编辑任务
        readTask();
        var c = findChosenInCatalog();

        var file_id = c[0];
        var sub_id = c[1];

        var selecting = $('.isSelected')[0];
        var task_name = (selecting.innerText).replace(/^\s+|\s+$/g, '');
        if (sub_id !== -1) {
            var file = _.getObjByKey(localData, 'id', file_id);
            var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
            var taskObj = _.getObjByKey(sub.tasks, 'taskname', task_name);

        } else {
            var file = _.getObjByKey(localData, 'id', file_id);
            var taskObj = _.getObjByKey(file.tasks, 'taskname', task_name);


        }
        var task_title = taskObj.taskname;
        var task_date = taskObj.date;
        var task_details = taskObj.taskcontent;

        $('.content input')[0].value = task_title;
        $('.content input')[1].value = task_date;
        $('.content textarea')[0].value = task_details;

    }
    //编辑任务
    function editTask() {
        $('.btn-save')[0].onclick = '';
        _.addEvent($('.btn-save')[0], "click", taskChange);
        _.addEvent($('.btn-cancel')[0], "click", cancelTask);
        var c = findChosenInCatalog();
        var file_id = c[0];
        var sub_id = c[1];
        var selecting = $('.isSelected')[0];
        if ((file_id || sub_id) && selecting) {
            $('.content input')[0].disabled = true;
            $('.content input')[1].disabled = false;
            $('.content textarea')[0].disabled = false;
            // _.addClass($('.content input')[0], 'task-editing');
            _.addClass($('.content input')[1], 'task-editing');
            _.addClass($('.content textarea')[0], 'task-editing');
            $('.complete')[0].style.display = 'none';
            $('.edit')[0].style.display = 'none';
            $('.btn-save')[0].style.display = 'inline';
            $('.btn-cancel')[0].style.display = 'inline';

            $('.tips')[0].style.display = 'inline';
        }

    }
    //保存任务
    function saveTask() {
        var c = findChosenInCatalog();

        var file_id = c[0];
        var sub_id = c[1];
        var taskIdArr = [];

        var task_title = $('.task-info .task-title')[0].value;
        var task_date = $('.task-info .task-date')[0].value;
        var task_details = $('.task-details')[0].value;
        var dateSplit = task_date.split('-');
        if (task_title.length === 0) {
            $('.tips')[0].innerHTML = '任务标题不能为空';
            return;
        } else if (task_date.length === 0) {
            $('.tips')[0].innerHTML = '任务日期不能为空';
            return;
        } else if (!task_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            $('.tips')[0].innerHTML = '任务日期格式错误';
            return;
        } else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
            $('.tips')[0].innerHTML = '日期超出范围';
            return;
        }
        if (!(file_id || sub_id)) {
            file_id = 0;
            sub_id = -1;
        }

        if (sub_id !== -1) {
            var file = _.getObjByKey(localData, 'id', file_id);

            var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
            if (sub.tasks.length > 0) {
                var newTask = {
                    'taskname': task_title,
                    'date': task_date,
                    'completed': false,
                    'taskcontent': task_details,
                    'task_id': sub.tasks[sub.tasks.length - 1].task_id + 1,
                    'sub_id': sub_id,
                    'id': file_id
                        // 'task_id':0
                };
            } else {
                var newTask = {
                    'taskname': task_title,
                    'date': task_date,
                    'completed': false,
                    'taskcontent': task_details,
                    'task_id': 0,
                    'sub_id': -1,
                    'id': file_id
                };
            }

            if (_.getObjByKey(sub.tasks, 'taskname', task_title)) {
                $('.tips')[0].innerHTML = '相同名称的任务已存在';
                return;
            }
            if (_.getObjByKey(file.tasks, 'taskname', task_title)) {
                $('.tips')[0].innerHTML = '在父类中相同名称的任务已存在';
                return;
            }

            sub.tasks.push(newTask);
            for (var j = 0; j < sub.tasks.length; j++) {
                taskIdArr.push(sub.tasks[j]);

            }
            $('.task-list')[0].innerHTML = '';
            makeTaskById(taskIdArr);


        } else {
            var file = _.getObjByKey(localData, 'id', file_id);
            if (file.tasks.length > 0) {
                var newTask = {
                    'taskname': task_title,
                    'date': task_date,
                    'completed': false,
                    'taskcontent': task_details,
                    //'task_id':0
                    'task_id': file.tasks[file.tasks.length - 1].task_id + 1,
                    'sub_id': sub_id,
                    'id': file_id
                };
            } else {
                var newTask = {
                    'taskname': task_title,
                    'date': task_date,
                    'completed': false,
                    'taskcontent': task_details,
                    'task_id': 0,
                    'sub_id': -1,
                    'id': file_id

                };
            }
            if (_.getObjByKey(file.tasks, 'taskname', task_title)) {
                $('.tips')[0].innerHTML = '相同名称的任务已存在';
                return;
            }
            if (_.getObjByKey(file.tasks, 'taskname', task_title)) {
                $('.tips')[0].innerHTML = '在父类中相同名称的任务已存在';
                return;
            }
            file.tasks.push(newTask);


            if (file.tasks.length > 0) {
                for (var j = 0; j < file.tasks.length; j++) {
                    taskIdArr.push(file.tasks[j]);
                }
            }
            $('.task-list')[0].innerHTML = '';
            makeTaskById(taskIdArr);


        }

        $('.category-list')[0].innerHTML = '分类列表';

        localStorage.testData = JSON.stringify(localData);
        init();



        taskListShow();
        Delete();
        readTask();


    }

    //修改任务
    function taskChange() {

        var c = findChosenInCatalog();

        var taskIdArr = [];
        var file_id = c[0];
        var sub_id = c[1];
        taskListShow();


        var task_title = $('.task-info .task-title')[0].value;
        var task_date = $('.task-info .task-date')[0].value;
        var task_details = $('.task-details')[0].value;
        var selecting = $('.isSelected')[0];

        var selectingName;
        if (selecting.innerText) {
            selectingName = selecting.innerText;
        } else {
            selectingName= selecting.textContent;
        }


        if (selecting) {
            var task_name = selectingName.replace(/^\s+|\s+$/g, '');
        }



        var dateSplit = task_date.split('-');
        if (task_date.length === 0) {
            $('.tips')[0].innerHTML = '任务标题不能为空';
            return;

        } else if (!task_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            $('.tips')[0].innerHTML = '任务日期格式错误';
            return;
        } else if (dateSplit[1] < 1 || dateSplit[1] > 12 || dateSplit[2] < 1 || dateSplit[2] > 31) {
            $('.tips')[0].innerHTML = '超出日期范围';
            return;
        }
        if (sub_id !== -1) {
            var file = _.getObjByKey(localData, 'id', file_id);
            var sub = _.getObjByKey(file.subcate, 'sub_id', sub_id);
            var taskObj = _.getObjByKey(sub.tasks, 'taskname', task_name);



        } else {
            var file = _.getObjByKey(localData, 'id', file_id);
            var taskObj = _.getObjByKey(file.tasks, 'taskname', task_name);


        }
        taskObj.taskname = task_title;
        taskObj.date = task_date;
        taskObj.completed = false;
        taskObj.taskcontent = task_details;

        localStorage.testData = JSON.stringify(localData);
        readTask();

    }



    return {

        init: init,
        taskListShow: taskListShow,
        taskContentShow: taskContentShow,
        statusShow: statusShow,
        Delete: Delete

    }

});
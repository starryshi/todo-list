//自己封装的常用函数
define(function() {

    var addEvent = function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        }
        // 为element增加一个样式名为newClassName的新样式
    var hasClass = function(element, className) {
        var name = element.className.split(' ');
        if (name.indexOf(className) !== -1) {
            return true;
        }
        return false;

    }

    var addClass = function(element, newClassName) {
        var oldClassName = element.className; //获取旧的样式类
        element.className = oldClassName === "" ? newClassName : oldClassName + " " + newClassName;
    };

    var removeClass = function(element, oldClassName) {
            if (hasClass(element, oldClassName)) {
                element.className = element.className.replace(oldClassName, '');
            }
        }
        // 根据某对象的某属性得到某对象
    var getObjByKey = function(obj, key, value) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][key] === value) {
                    return obj[i];
                }
            }
        }
        // 根据某对象的某属性得到某对象的序号
    var getIndexByKey = function(obj, key, value) {
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][key] === value) {
                    return i;
                }
            }
        }
        // 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
    var uniqArray = function(arr) {
            var new_array = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] !== '' && new_array.indexOf(arr[i]) < 0) {
                    new_array.push(arr[i]);
                }
            }
            return new_array;
        }
        // 对任务时间进行排序
    var sortDate = function(date) {
        return date.sort(function(a, b) {
            return a.replace(/-/g, '') - b.replace(/-/g, '');
           
        });
    }

    return {
        addEvent: addEvent,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getObjByKey: getObjByKey,
        getIndexByKey: getIndexByKey,
        uniqArray: uniqArray,
        sortDate: sortDate
    }


});
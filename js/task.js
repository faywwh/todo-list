class Task {
  constructor(id) {
    this.box = document.querySelector(id);
    this.taskText = this.box.querySelector('.task-text');
    this.taskTable = this.box.querySelector('.task-table');
    this.taskBtn = this.box.querySelector('.task-btn');
    this.delBtn = this.box.querySelectorAll('.del-task-btn');
    this.tdNum = this.taskTable.children[0].children.length;
    this.taskList = [];
    this.curIndex = -1;
    this.init();
  }

  init() {
    this.taskText.addEventListener('keydown', (e) => {
      this.keydown(e);
    });
    this.taskBtn.addEventListener('click', (e) => {
      if (this.taskText.value == '') {
        alert('请输入事件');
      } else if (this.taskText.value.length > 20) {
        alert('标题长度过长，请重新输入');
      } else {
        // 储存数据
        var taskObj = {
          title: this.taskText.value,
          remindTime: '',
          status: '0',
          detailText: '',
        };
        this.taskList.push(taskObj);
        this.localSetItem('todoList', this.taskList);
        // 渲染列表
        this.addTask(taskObj, this.taskList.length - 1);
        this.taskText.value = '';
      }
    });
    this.initTask();
  }
  // 初始化任务列表
  initTask() {
    this.taskList = this.localGetItem('todoList') || [];
    this.renderTask();
  }

  // 渲染列表
  renderTask() {
    this.taskList.forEach((item, index) => {
      this.addTask(item, index);
    });
  }

  addTask(item, index) {
    var confirmBtn = document.querySelector('.confirmBtn');
    var cancelBtn = document.querySelector('.cancelBtn');
    var overlay = document.querySelector('.overlay');
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var td5 = document.createElement('td');
    var td6 = document.createElement('td');
    var td7 = document.createElement('td');
    var delButton = document.createElement('button');
    var setRemindBtn = document.createElement('button');
    var taskComplete = document.createElement('button');
    var detailBtn = document.createElement('button');
    var timer = null;

    // 添加详情
    var _this = this;
    detailBtn.onclick = function (e) {
      _this.curIndex = e.target.parentNode.parentNode.getAttribute(
        'data-index'
      );
      overlay.querySelector('.title').innerText =
        _this.taskList[_this.curIndex].title;

      overlay.querySelector('textarea').value =
        _this.taskList[_this.curIndex].detailText;
      overlay.classList.add('active');
    };

    // 确认
    confirmBtn.onclick = function () {
      var detailText = document.querySelector('textarea');
      _this.taskList[_this.curIndex].detailText = detailText.value;
      _this.localSetItem('todoList', _this.taskList);
      overlay.classList.remove('active');
      detailText.value = '';
      document.querySelectorAll('.task-table tbody .td7')[
        _this.curIndex
      ].innerText = _this.taskList[_this.curIndex].detailText;
    };
    // 取消
    cancelBtn.onclick = function () {
      overlay.classList.remove('active');
    };

    // 添加删除事件
    delButton.addEventListener('click', (e) => {
      var confirmDel = confirm('请确认是否删除本事件？');
      if (confirmDel) {
        this.deleteTask(e);
      }
    });
    // 添加设置提醒事件
    setRemindBtn.addEventListener('click', (e) => {
      this.setRemind(e);
    });
    // 初始化定时任务
    if (item.remindTime && +new Date() < +new Date(item.remindTime)) {
      timer = setInterval(() => {
        var nowDate = +new Date();
        if (+new Date(item.remindTime) <= nowDate) {
          clearInterval(timer);
          alert(item.title);
        }
      }, 1000);
    }
    // 事件完成
    taskComplete.addEventListener('click', (e) => {
      var index = e.target.parentNode.parentNode.getAttribute('data-index');
      td1.classList.toggle('active');
      taskComplete.classList.toggle('taskComplete');
      if (taskComplete.getAttribute('class') == 'taskComplete') {
        taskComplete.innerText = '已完成';
        this.taskList[index].status = '1';
      } else {
        taskComplete.innerText = '未完成';
        this.taskList[index].status = '0';
      }
      this.localSetItem('todoList', this.taskList);
    });
    delButton.innerText = '删除事件';
    setRemindBtn.innerText = '设置提醒';
    detailBtn.innerText = '详情';
    if (item.status == '0') {
      taskComplete.innerText = '未完成';
    } else {
      taskComplete.innerText = '已完成';
      taskComplete.classList.add('taskComplete');
      td1.classList.add('active');
    }
    tr.classList.add('tr');
    // tr增加索引
    tr.setAttribute('data-index', index);
    td1.classList.add('td1');
    td2.classList.add('td2');
    td3.classList.add('td3');
    td4.classList.add('td4');
    td5.classList.add('td5');
    td6.classList.add('td6');
    td7.classList.add('td7');
    detailBtn.classList.add('detailBtn');
    td1.innerHTML = item.title;
    td2.innerHTML =
      '<input class="time" type="text" placeholder="例：2020/8/31 14:30" value="' +
      item.remindTime +
      '"/>';
    td3.appendChild(setRemindBtn);
    td4.appendChild(delButton);
    td5.appendChild(taskComplete);
    td6.appendChild(detailBtn);
    td7.innerHTML = item.detailText;
    tr.appendChild(td1);
    tr.appendChild(td7);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    this.taskTable.children[1].appendChild(tr);
  }

  deleteTask(event) {
    var parentNode = event.target.parentNode.parentNode;
    var index = parentNode.getAttribute('data-index');
    this.taskList.splice(index, 1);
    this.localSetItem('todoList', this.taskList);
    parentNode.remove();
    var tr = this.box.querySelectorAll('.tr');
    // for (var i = 0; i < this.taskList.length; i++) {
    //   tr[i].setAttribute('data-index', i);
    // }
    this.taskList.forEach(function (item, index) {
      tr[index].setAttribute('data-index', index);
    });
  }

  // 设置提醒
  // setRemind(event) {
  //   var parentNode = event.target.parentNode.parentNode;
  //   var td1Text = parentNode.querySelector('.td1').innerText;
  //   var nowDate = new Date();
  //   var time = parentNode.querySelector('.time').value;
  //   var timeArr = time.trim().split(/[/]|:|[ ]/);
  //   var inputTime =
  //     parseInt(timeArr[0]) * 525600 +
  //     parseInt(timeArr[1]) * 43800 +
  //     parseInt(timeArr[2]) * 1440 +
  //     parseInt(timeArr[3]) * 60 +
  //     parseInt(timeArr[4]);
  //   var localTime =
  //     nowDate.getFullYear() * 525600 +
  //     (nowDate.getMonth() + 1) * 43800 +
  //     nowDate.getDate() * 1440 +
  //     nowDate.getHours() * 60 +
  //     nowDate.getMinutes();
  //   if (
  //     timeArr.length != 5 ||
  //     timeArr[1] > 12 ||
  //     timeArr[1] < 1 ||
  //     timeArr[2] > 31 ||
  //     timeArr[2] < 1 ||
  //     timeArr[3] > 24 ||
  //     timeArr[3] < 0 ||
  //     timeArr[4] > 59 ||
  //     timeArr[4] < 0 ||
  //     timeArr[0] == '' ||
  //     timeArr[1] == '' ||
  //     timeArr[2] == '' ||
  //     timeArr[3] == '' ||
  //     timeArr[4] == ''
  //   ) {
  //     alert('输入日期格式错误！正确格式为yyyy/mm/dd xx:xx');
  //   } else if (inputTime < localTime) {
  //     alert('设置当前时间错误，请确认输入时间为当前时间之后');
  //   } else {
  //     function timeRemind() {
  //       var nowDate = new Date();
  //       if (
  //         timeArr[0] == nowDate.getFullYear() &&
  //         timeArr[1] == nowDate.getMonth() + 1 &&
  //         timeArr[2] == nowDate.getDate() &&
  //         timeArr[3] == nowDate.getHours() &&
  //         timeArr[4] == nowDate.getMinutes()
  //       ) {
  //         clearInterval(timer);
  //         alert(td1Text);
  //       }
  //     }
  //     var timer = setInterval(timeRemind, 1000);
  //     var index = parentNode.getAttribute('data-index');
  //     this.taskList[index].remindTime = time;
  //     this.localSetItem('todoList', this.taskList);
  //     alert(
  //       '已设置提醒时间为：' +
  //         timeArr[0] +
  //         '年' +
  //         timeArr[1] +
  //         '月' +
  //         timeArr[2] +
  //         '日' +
  //         timeArr[3] +
  //         '时' +
  //         timeArr[4] +
  //         '分'
  //     );
  //   }
  // }

  // 设置提醒
  setRemind(event) {
    var parentNode = event.target.parentNode.parentNode;
    var index = parentNode.getAttribute('data-index');
    var td1Text = parentNode.querySelector('.td1').innerText;
    var nowDate = +new Date();
    var time = parentNode.querySelector('.time').value;
    var timeStamp = +new Date(time);
    var timer = null;
    if (isNaN(timeStamp)) {
      alert('输入日期格式错误！正确格式为yyyy/mm/dd xx:xx');
    } else if (timeStamp <= nowDate) {
      alert('设置当前时间错误，请确认输入时间为当前时间之后');
    } else {
      // 设置成功
      alert('已设置提醒时间为：' + time);
      this.taskList[index].remindTime = time;
      this.localSetItem('todoList', this.taskList);
      var timer = setInterval(() => {
        timeRemind(timeStamp);
      }, 1000);
      function timeRemind(remindTime) {
        var nowDate = +new Date();
        if (remindTime <= nowDate) {
          clearInterval(timer);
          alert(td1Text);
        }
      }
    }
  }

  localGetItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  localSetItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  keydown(e) {
    if (e.keyCode == 108 || e.keyCode == 13) {
      this.taskBtn.click();
    }
  }
}

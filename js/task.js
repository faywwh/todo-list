class Task {
  constructor(id) {
    this.box = document.querySelector(id);
    this.taskText = this.box.querySelector('.task-text');
    this.taskTable = this.box.querySelector('.task-table');
    this.taskBtn = this.box.querySelector('.task-btn');
    this.delBtn = this.box.querySelectorAll('.del-task-btn');
    this.tdNum = this.taskTable.children[0].children.length;
    this.init();
  }

  init() {
    this.taskBtn.addEventListener('click', (e) => {
      this.addTask();
    });
  }

  addTask() {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');
    var delButton = document.createElement('button');
    var setRemindBtn = document.createElement('button');
    // 添加删除事件
    delButton.addEventListener('click', (e) => {
      this.deleteTask(e);
    });
    // 添加设置提醒事件
    setRemindBtn.addEventListener('click', (e) => {
      this.setRemind(e);
    });

    delButton.innerText = '删除事件';
    setRemindBtn.innerText = '设置提醒';
    tr.classList.add('tr');
    td1.classList.add('td1');
    td2.classList.add('td2');
    td3.classList.add('td3');
    td4.classList.add('td4');
    td1.innerHTML = this.taskText.value;
    td2.innerHTML =
      '<input class="time" type="text" placeholder="例：2020/8/31 14:30" />';
    td3.appendChild(setRemindBtn);
    td4.appendChild(delButton);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    this.taskTable.children[0].appendChild(tr);
    this.taskText.value = '';
  }

  deleteTask(event) {
    event.target.parentNode.parentNode.remove();
  }

  setRemind(event) {
    var td1Text =
      event.target.parentNode.previousSibling.previousSibling.innerText;
    var nowDate = new Date();
    var time = event.target.parentNode.previousSibling.children[0].value;
    var timeArr = time.split(/[/]|:|[ ]/);
    if (timeArr[0] < nowDate.getFullYear()) {
      alert('输入日期错误！');
    }
    function timeRemind() {
      var nowDate = new Date();
      if (
        timeArr[0] == nowDate.getFullYear() &&
        timeArr[1] == nowDate.getMonth() + 1 &&
        timeArr[2] == nowDate.getDate() &&
        timeArr[3] == nowDate.getHours() &&
        timeArr[4] == nowDate.getMinutes()
      ) {
        clearInterval(timer);
        alert(td1Text);
      }
    }
    var timer = setInterval(timeRemind, 1000);
  }
}

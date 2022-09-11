const body = document.querySelector("body");
const taskCreator = document.getElementById("taskCreator");
const outputBox = document.getElementById("output-box");
const taskBox = document.getElementById("task-box");
const todate = document.getElementById("todate");
const taskName = document.getElementById("taskName");
const taskDesc = document.getElementById("taskDesc");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskSubmit = document.getElementById("taskSubmit");

let tasksArr = [];
let valid;
let taskID = 0;

const today = new Date();
let time =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
new Date().getTime();
Date.now();
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;
let today2 = day + "." + month + "." + year;

todate.innerText = today2;
taskDate.innerHTML = today2;
taskDate.valueAsDate = new Date();

function clean() {
  localStorage.removeItem("tasks");
  taskBox.innerHTML = "";
  tasksArr = [];
}

// try to run on all 3 in one code
function validate() {
  if (!taskName.value) {
    outputBox.innerHTML = "the Task name is empty ";
    outputBox.style.color = "#dc3545";
    taskName.style.borderColor = "#dc3545";
    return !valid;
  }
  if (!taskDesc.value) {
    outputBox.innerHTML = "the Task Description is empty ";
    outputBox.style.color = "#dc3545";
    taskDesc.style.borderColor = "#dc3545";
    return !valid;
  }
  if (!taskDate.value) {
    outputBox.innerHTML = "the Task Date is empty ";
    outputBox.style.color = "#dc3545";
    taskDate.style.borderColor = "#dc3545";
    return !valid;
  } else {
    return (valid = true);
  }
}

// you need to send a task to arr and iterate from there
function populateArr(){
  if (!valid){return}
  let taskData = {
    task_name: taskName.value,
    task_description: taskDesc.value,
    task_date: taskDate.value,
    task_time: taskTime.value,
  };
  tasksArr.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function draw() {
  
  taskBox.innerHTML = '';
  taskID++;
  const title4 = '<p class="title is-4">';
  const title4cl = "</p>";
  const divClose = "</div></div>";
  const br = "<br/>";

  let div1 = `<div class="column card is-4" id="taskno-${taskID}"><div class="card-content">`;
  let close = `<button class="delete is-medium" id="closeno-${taskID}" onclick="deleteMe(this)"></button>`;
  outputBox.innerHTML = `New task: ${taskName.value} created on ${time}`;
  outputBox.style.color = "#000";
  taskDate.style.borderColor = "initial";
  taskDesc.style.borderColor = "initial";
  taskName.style.borderColor = "initial";

  for (let i = 0; i < tasksArr.length; i++) {
    const task = tasksArr[i];

    taskBox.innerHTML +=
      div1 +
      close +
      br +
      title4 +
      task.task_name +
      title4cl +
      br +
      task.task_description +
      br +
      task.task_time +
      br +
      task.task_date +
      divClose;
  }
}

// activators - either by click or memory:
let storageTasks = localStorage.getItem("tasks");
if (storageTasks) {
  tasksArr = JSON.parse(storageTasks);
  draw()
}

taskSubmit.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    validate();
    populateArr()
    draw();
  },
  false
);

function deleteMe(obj) {
  let objnum = obj.parentNode.id.split("-");
  let num = Number(objnum[1]);
  num--;
  tasksArr.splice(num, 1);
  obj.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode);
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(tasksArr));

}
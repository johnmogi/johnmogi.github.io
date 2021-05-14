// the following section was extra and removed since I couldn't solve some issues on redraw, etc.

const butC = document.createElement('button');
butC.innerHTML = '<i class="far fa-check-circle"></i>';
butC.addEventListener('click', function () {
    completeTask(returnedArray[i].id);
});
butC.className = 'Complete';
div.append(butC);


function completeTask(id) {
    const compBut = document.getElementById('note' + id);
    compBut.style.opacity = '0.5';
    let obj = returnedArray.find(obj => obj.id == id);
    obj.status = "complete"
    const objId = document.getElementById("note" + id);
    objId.classList.add("completed");
    // console.log(obj);
}

function filterC() {
    const completedTasks = document.getElementsByClassName("completed")
    console.log(completedTasks)
};

function filterI() {
    const completedTasks = document.getElementsByClassName("completed")
    console.log(completedTasks)
};

function filterA() {
    const completedTasks = document.getElementsByClassName("completed")
    console.log(completedTasks)
};


const completed = document.getElementById('completed');
const incomplete = document.getElementById('incomplete');
const all = document.getElementById('all');

completed.addEventListener("click", filterC)


function filterCompletyedTasks() {
    for (let i = 0; i < returnedArray.length; i++) {
        let obj = returnedArray.find(obj => obj.status == "complete");
        // let objId = document.getElementById("note" + Object.id);
        obj.classList.add("completed");
        obj.id++
        // console.log(obj);

    }
}

filterCompletyedTasks()
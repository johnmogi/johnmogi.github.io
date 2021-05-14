function deleteTask(id) {
	const delBut = document.getElementById('note' + id);
	delBut.remove();
	returnedArray.splice(id);
	localStorage.removeItem(id);
	returnedArray.length = 0;
	redraw();
	//   deleteCard();
}



function buildTask() {
	if (checkValid === false) {
		return;
	}
	for (let t = -1; t < returnedArray.length; t++) {
		TASK_DOM = {
			// id: parseInt(Math.floor(100 + Math.random() * 900) + i),
			id: t + 2,
			Name: document.getElementById('taskName').value,
			Date: document.getElementById('dueDate').value,
			Detail: document.getElementById('taskDetail').value,
			Time: document.getElementById('timepicker5').value,
			status: 'active'
		};
		// if (!TASK_DOM[i].id === ""){ returnedArray.splice(0) }
	}
	returnedArray.push(TASK_DOM);

	for (let i = 0; i < returnedArray.length; i++) {
		// localStorage.setItem(JSON.stringify(taskArray));
		localStorage.setItem(JSON.stringify(returnedArray[i].id), JSON.stringify(returnedArray[i]));
	}
}

function redraw() {
	if (localStorage.length < 1) {
		return;
	}
	if (returnedArray.length > 1) {
		return;
	}
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var item = JSON.parse(localStorage.getItem(key));
		// if (item == "") {return}

		returnedArray.push(item);
	}
	returnedArray.reverse();
	generate();
}

function draw() {
	validate();
	if (checkValid === false) {
		returnedArray.length = 0;
		// creator.preventDefault();
		// creator.stopPropagation();
		return;
	}
	// timeValid()
	buildTask();
	setTimeout(() => {
		generate();

	}, 500);
	// filterCompletyedTasks()
}
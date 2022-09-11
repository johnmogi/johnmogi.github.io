function smallClear() {
	stage.innerHTML = '';
	dueDate.style.border = '1px solid #000;';
	messageBoard.innerText = 'When adding a task make sure to include all the info:';
	messageBoard.style.color = '#000';
}

function clear() {
	smallClear();
	localStorage.clear();
	taskArray.length = 0;
	returnedArray.length = 0;
}

function validate() {
	if (!taskName.value || !taskDetail.value || !dueDate.value) {
		creator.classList.add('was-validated');
		messageBoard.innerText = 'Please Fill All Inputs';
		messageBoard.style.color = '#dc3545';
		checkValid = false;
	} else {
		messageBoard.innerText = "...I'm Listening...";
		messageBoard.style.color = '#000';
		creator.classList.add('needs-validation');
		checkValid = true;
	}
	checkTimeForValid();
}

function checkTimeForValid() {
	let date = new Date();
	console.info(+date);
	var myDate = dueDate.value;
	var myTime = +timepicker5.value;
	var myDateUpdate = new Date(myDate);
	console.info(+myDateUpdate);
	var myTimeUpdate = date.getTime();

	if (myDateUpdate < date || !myDateUpdate == date) {
		// console.error('false');
		// console.info(+myDateUpdate);
		checkValid === false;
		dueDate.style.border = '1px solid #dc3545';
		messageBoard.innerText = 'please choose a future date';
		messageBoard.style.color = '#dc3545';

		console.info('false');
		if (today2 == dueDate.value) {
			checkValid === true;
			dueDate.style.border = '1px solid #bee5eb';
			messageBoard.innerText = 'A task for today? a bit risky but go ahead...';
			messageBoard.style.color = '#004085';
		}
	} else {
		checkValid === true;
		dueDate.style.border = '';
		dueDate.style.border = '1px solid #000;';
		console.info('true');
	}
}
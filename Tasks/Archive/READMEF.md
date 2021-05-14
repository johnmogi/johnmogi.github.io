glyphs are inserted from bootstrap 3:
https://glyphicons.bootstrapcheatsheets.com/#home



  <div class="row">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      One of three columns
    </div>

  </div>


function timeValid(){
 let datenow =  dueDate.value.split("-")
 let  yearFromInput= parseInt(datenow[0])
 let dayFromInput  = parseInt(datenow[2])
 let monthFromInput = parseInt(datenow[1])

//  console.log(yearFromInput, dayFromInput, monthFromInput)
//  console.log(yyyy, dd, mm)
 if (yearFromInput < yyyy || monthFromInput < mm ){
  alert("please choose a future date")
// didn't complete day validation... yet
}
// console.log(dayFromInput,yearFromInput,monthFromInput)

}


validate time:
const timer5 = timepicker5.value.split(" ")

const timer10 = timer5[0].split(":")


const TASK_DOM= {
id:  parseInt(Math.floor(1000 + Math.random() * 9000)),
name: taskName.value,
date:dueDate.value,
details: taskDetail.value,
time: timepicker5.value

};


1. biggest issue is onload document- regarding global variables
2. secondary issue is date validation
3. adding multiple cards to dom

// console.info(myDateUpdate);
// myDate = myDate.split('-');
// new Date(parseInt(myDate[2], 10), parseInt(myDate[1], 10) - 1, parseInt(myDate[0]), 10).getTime();

// const datenow = dueDate.value.split("-");

function timeValid() {
	let checkValid = false;

	if ((dueDate.value == '', yearFromInput > yyyy)) {
		// yearFromInput < yyyy ||
		// monthFromInput < mm,
		// yearFromInput = yyyy &&
		// monthFromInput < mm)
		// ,
		// yearFromInput == yyyy &&
		// monthFromInput == mm &&
		// dayFromInput < dd) {
		//    if (monthFromInput >= mm) {
		//  {

		vaildBypass.innerText = 'please choose a future date';
		vaildBypass.style.color = '#dc3545';
		// dueDate.style.background = "#dc3545"
		checkValid = false;
	} else {
		checkValid = true;
	}
}

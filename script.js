var table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
var waitingDisplay = document.getElementById('waiting-queue');
var finishedDisplay = document.getElementById('finished-queue');
var cpuDisplay = document.getElementById('cpu');

   //waiting queue, finished queue, cpu queue
var wQueue = [];
var fQueue = [];
var cpu = [];

var timerInterval;
var seconds = 0;
var numOfProcesses = 0;

var randomColor;

var availableID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

   //process object
var process = {
    processID: document.getElementById('process-id'),
    arrivalTime: document.getElementById('arrival-time'),
    burstTime: document.getElementById('burst-time'),
};

   /*
   //Push the given process to the wQueue to keep track of it
   //and append a process element child to waitingDisplay so it can be displayed.
   */
function addToWaitingQueue(process, processElement) {
   wQueue.push(process);
   waitingDisplay.appendChild(processElement); 
}

   /*
   //Push the given process to the fQueue to keep track of it
   //and append a process element child to finishedDisplay so it can be displayed.
   */
function addToFinishedQueue(process, processElement) {
   fQueue.push(process);
   finishedDisplay.appendChild(processElement);
}

   /*
   //If the CPU is empty, remove the process from waitingDisplay,
   //push the given process to the cpu to keep track of it
   //and append a process element child to cpuDisplay so it can be displayed.
   */
function addToCPU(process, processElement) {
   if (cpu.length < 1) {
      cpu.push(process);
      cpuDisplay.appendChild(processElement);
   }
}


function updateCPU() {
   // console.log("cpu - process:" + cpu[0].id + ", burst:" + cpu[0].burstTime);
   var process = cpu[0];
   var processElement = document.getElementById("P" + process.processID);
   if (cpu[0].burstTime <= 0) {
      cpu.pop();
      addToFinishedQueue(process, processElement);
   } else {
      cpu[0].burstTime--;
   }
}

   /*
   //Once all inputs are validated, add a new row with 3 columns
   //to the table. Insert the correct values in each of the 3 columns.
   //Then add the process to the waiting queue and updated the number
   //of processes that are completed
   */
// function addProcess() {
//   validateInput(process.processID, true);
//   validateInput(process.arrivalTime, false);
//   validateInput(process.burstTime, false);

//    if (validateInput(process.processID, true) && validateInput(process.arrivalTime, false) && validateInput(process.burstTime, false)){
//       var newRow = table.insertRow(table.rows.length);
//       newRow.id = "P" + process.processID.value;

//       var cell1 = newRow.insertCell(0);
//       var cell2 = newRow.insertCell(1);
//       var cell3 = newRow.insertCell(2);

//       cell1.innerHTML = process.processID.value;
//       cell2.innerHTML = process.arrivalTime.value;
//       cell3.innerHTML = process.burstTime.value;

//       numOfProcesses++;
//    }
// }

//automatic
// function addProcess() {
//    var id;

//    for (var i = 0; i < 4; i++) {
//       var randomIndex = Math.floor(Math.random() * availableID.length);
//       var selectedID = availableID.splice(randomIndex, 1)[0];
//       id = selectedID;

//       var newRow = table.insertRow(table.rows.length);

//       newRow.id = "P" + id;

//       var cell1 = newRow.insertCell(0);
//       var cell2 = newRow.insertCell(1);
//       var cell3 = newRow.insertCell(2);

//       cell1.innerHTML = id;
//       cell2.innerHTML = Math.floor(Math.random() * 10) + 1;
//       cell3.innerHTML = Math.floor(Math.random() * 10) + 1;

//       numOfProcesses++;
//    }
// }

//test
function addProcess() {
   var id;

   var newRow1 = table.insertRow(table.rows.length);
   newRow1.id = "P" + 6;
   var cell1 = newRow1.insertCell(0);
   var cell2 = newRow1.insertCell(1);
   var cell3 = newRow1.insertCell(2);
   cell1.innerHTML = 6;
   cell2.innerHTML = 6;
   cell3.innerHTML = 2;

   var newRow2 = table.insertRow(table.rows.length);
   newRow2.id = "P" + 9;
   var cell1 = newRow2.insertCell(0);
   var cell2 = newRow2.insertCell(1);
   var cell3 = newRow2.insertCell(2);
   cell1.innerHTML = 9;
   cell2.innerHTML = 4;
   cell3.innerHTML = 2;
   
   var newRow3 = table.insertRow(table.rows.length);
   newRow3.id = "P" + 5;
   var cell1 = newRow3.insertCell(0);
   var cell2 = newRow3.insertCell(1);
   var cell3 = newRow3.insertCell(2);
   cell1.innerHTML = 5;
   cell2.innerHTML = 4;
   cell3.innerHTML = 2;

   var newRow3 = table.insertRow(table.rows.length);
   newRow3.id = "P" + 10;
   var cell1 = newRow3.insertCell(0);
   var cell2 = newRow3.insertCell(1);
   var cell3 = newRow3.insertCell(2);
   cell1.innerHTML = 10;
   cell2.innerHTML = 3;
   cell3.innerHTML = 2;

   var newRow3 = table.insertRow(table.rows.length);
   newRow3.id = "P" + 4;
   var cell1 = newRow3.insertCell(0);
   var cell2 = newRow3.insertCell(1);
   var cell3 = newRow3.insertCell(2);
   cell1.innerHTML = 4;
   cell2.innerHTML = 3;
   cell3.innerHTML = 2;
   
   numOfProcesses+= 5;
}

   /*
   //To remove a process, find the parent of
   //the child node that matches the given id then
   //remove the child from the parent.
   */
function removeProcess(childID) {
   var child = document.getElementById(childID);
   child.parentNode.removeChild(child);
}

   /*
   //Create a new div with the class name of process-element.
   //Give it a text that matches the id found on the given process
   //and give it a random color.
   */
function createProcessElement(process) {
   randomColor = getRandomColor();

   var processElement = document.createElement('div');
   processElement.className = 'process-element';
   processElement.textContent = "P" + process.processID;
   processElement.style.backgroundColor = randomColor;
   processElement.style.color = getTextColor(randomColor);

   processElement.id = "P" + process.processID;

   return processElement;
}

   /*
   //An input is invalid if it is empty, a negative number, or a fractional number.
   //If the input is a id, it must also be unique.
   */
function validateInput(element, isID) {
   /*
   //When validating ids
   //If there are previous entries in the table, check to make sure
   //the id of the new process isn't equal to an id of an existing process
   */
   if ((table.rows.length > 0 && isID) || isID) {
      if ((element.value === "" || parseFloat(element.value) < 0 || !/^[0-9]+$/.test(element.value))) {
         element.classList.add("error");
         return false;
      }

      for (var i = 0; i < table.rows.length; i++) {
         var existingID = table.rows[i].cells[0].innerHTML;

         if (existingID === element.value) {
            element.classList.add("error");
            return false;
         } 
      }
   }

   //when validating any input other than id.
   if ((element.value === "" || parseFloat(element.value) < 0 || !/^[0-9]+$/.test(element.value)) && !isID) {
      element.classList.add("error");
      return false;
   } else {
      element.classList.remove("error");
      return true;
   }
}

   /*
   //Used to keep track of how many processes are finished and how many are waiting
   */
function getNumCompleted() {
   var completed = document.getElementById('completed');
   completed.textContent = "Completed: " + fQueue.length + " / " + numOfProcesses;

   if (fQueue.length == numOfProcesses) {
      stopTimer();
   }
}

   /*
   //Returns a random hexadecimal formatted string
   */
function getRandomColor() {
   var letter = '0123456789ABCDEF';
   var color = '#';
   for (var i = 0; i < 6; i++) {
      color += letter[Math.floor(Math.random() * 16)];
   }

   return color;
}

   /*
   //Used to set either a black or white color for the
   //text written on the process-element depending
   //on the brightness of the process-element's color.
   */
function getTextColor(bgColor) {
   // Convert the hexadecimal color to RGB
   var hexColor = bgColor.substring(1);
   var rgb = parseInt(hexColor, 16);
   var r = (rgb >> 16) & 0xff;
   var g = (rgb >>  8) & 0xff;
   var b = (rgb >>  0) & 0xff;

   // Calculate the brightness
   var brightness = (r * 299 + g * 587 + b * 114) / 1000;

   // Choose text color based on brightness
   return brightness > 128 ? '#000' : '#fff';
}

function start() {
   var selectedAlgo = document.getElementById("algo-select");
   var algorithm = selectedAlgo.value;

   if (table.rows.length != 0) {
      switch (algorithm) {
         case "fcfs":
            startTimer(algorithm);
            fcfs();
            break;
         case "sjf":
            sjf();
            break;
         case "rr":
            rr();
            break;
         default:
            alert("invalid algorithm");
      }
   } else {
      alert("Add Process Before Starting");
   }
}

function sortDivsById() {
   var container = waitingDisplay;
   var divs = container.getElementsByClassName("process-element");

   // Convert the HTMLCollection to an array for sorting
   var divArray = Array.from(divs);

   // Sort the array of divs based on their id attribute
   divArray.sort(function (a, b) {
       var idA = a.id.toLowerCase();
       var idB = b.id.toLowerCase();
       return idA.localeCompare(idB);
   });

   // Clear the container
   container.innerHTML = "";

   // Append the sorted divs back to the container
   divArray.forEach(function (div) {
       container.appendChild(div);
   });

   //sort waiting queue so it matches waiting display sorting
   wQueue.sort(function(a, b) {
      console.log("sorted - " + a.id + " & " + b.id);
      return a.id - b.id;
   });
}

function startTimer(algorithm) {
   clearInterval(timerInterval);
   timerInterval = setInterval(function () {
      updateTimer(algorithm);

      if (cpu.length == 1) {
          updateCPU();
      }

      if (algorithm == "fcfs" ){fcfs();}

   }, 1000);
}

function stopTimer() {
   clearInterval(timerInterval);
}

function updateTimer(algorithm) {
//    document.getElementById('time').textContext = formatTime(seconds);
   var timer = document.getElementById('time');
   timer.textContent = "Time: " + formatTime(seconds);


   seconds++;
}

function formatTime(seconds) {
   var minutes = Math.floor(seconds / 60);
   var remainingSeconds = seconds % 60;

   return (minutes < 10 ? "0" : "") + minutes + ":" + 
            (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}
//============================================================================================================================================
function fcfs() {
   getNumCompleted();
   
   var list = [];

   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML
      };
      process.id = process.processID;

      list.push(process);
   }
   
   
   // list.forEach(function (process) {
   //    var processElement = createProcessElement(process);
      
   //    if (process.arrivalTime == seconds) {
   //       if (cpu.length < 1) {
   //          addToCPU(process, processElement);
   //          removeProcess(processElement.textContent);
   //       } else {
   //             addToWaitingQueue(process, processElement);
   //             removeProcess(processElement.textContent);
   //       }
   //    }
   // });

   // if ((wQueue.length != 0) && (cpu.length == 0)) {
   //    var process = wQueue[0];
   //    var processElement = document.getElementById("P" + process.processID);
   //    addToCPU(process, processElement);
   //    wQueue.splice(0, 1);
   // }
   var count = 0;

   list.forEach(function (process) {
      var processElement = createProcessElement(process);
      
      if (process.arrivalTime == seconds) {
         addToWaitingQueue(process, processElement);
         removeProcess(processElement.textContent);
         

         count++;
         if (wQueue.length <= (count + 1)) {
            sortDivsById();
         }
         // sortDivsById();
      } 
   });
   // console.log("0 - " + wQueue[0]);
   
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }
   
}
//============================================================================================================================================
function sjf() {
   alert("sjf");
}

function rr() {
   alert("rr");
}

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

var running = false;

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
function addToWaitingQueue(process) {
   var processElement = createProcessElement(process);
   wQueue.push(process);
   waitingDisplay.appendChild(processElement);
   removeProcess(processElement.textContent);

   
}

   /*
   //Push the given process to the fQueue to keep track of it
   //and append a process element child to finishedDisplay so it can be displayed.
   */
function addToFinishedQueue(process) {
   var processElement = createProcessElement(process);
   fQueue.push(process);
   finishedDisplay.appendChild(processElement);
   removeProcess(processElement.textContent);
}

   /*
   //If the CPU is empty, remove the process from waitingDisplay,
   //push the given process to the cpu to keep track of it
   //and append a process element child to cpuDisplay so it can be displayed.
   */
function addToCPU(process) {
   // if (cpu.length < 1) {
   //    var processElement = createProcessElement(process);
   //    cpu.push(process);
   //    cpuDisplay.appendChild(processElement);
   //    removeProcess(processElement.textContent);
   //    process.burstTime--;
   // }

   if (cpu.length < 1) {
      var processElement = createProcessElement(process);
      cpu.push(process);
      cpuDisplay.appendChild(processElement);
      removeProcess(processElement.textContent);
   }
}

function updateCPU() {
   if (cpu.length != 0) {
      // process = cpu[0];
      // if (process.burstTime > 0) {
      //    console.log("cpu - process:" + process.processID + ", burst:" + process.burstTime);
      //    process.burstTime--;
      // } else {
      //    removeProcess(process);
      // }

      cpu.forEach(function (element) {
         if (element.burstTime <= 0) {
            addToFinishedQueue(element);
         } else {
            element.burstTime--;
            console.log("cpu - process:" + element.processID + ", burst:" + element.burstTime);
            }
      });
      
   }
}

   /*
   //Once all inputs are validated, add a new row with 3 columns
   //to the table. Insert the correct values in each of the 3 columns.
   //Then add the process to the waiting queue and updated the number
   //of processes that are completed
   */
function addProcess() {
  validateInput(process.processID, true);
  validateInput(process.arrivalTime, false);
  validateInput(process.burstTime, false);

   if (validateInput(process.processID, true) && validateInput(process.arrivalTime, false) && validateInput(process.burstTime, false)){
      var newRow = table.insertRow(table.rows.length);
      newRow.id = "P" + process.processID.value;

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = process.processID.value;
      cell2.innerHTML = process.arrivalTime.value;
      cell3.innerHTML = process.burstTime.value;

      // addToWaitingQueue(process);

      // getNumCompleted(); 
      numOfProcesses++;
   }
}

//automatic
// function addProcess() {
//    var id;

//    for (var i = 0; i < 2; i++) {
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
   // var randomColor = getRandomColor();

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

   getNumCompleted();

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

function startTimer(algorithm) {
   clearInterval(timerInterval);
   timerInterval = setInterval(function () {
       updateTimer(algorithm);
      //  updateCPU();
   }, 1000);
}

function stopTimer() {
   clearInterval(timerInterval);
}

function updateTimer(algorithm) {
//    document.getElementById('time').textContext = formatTime(seconds);
   var timer = document.getElementById('time');
   timer.textContent = "Time: " + formatTime(seconds);

   if (algorithm == "fcfs" ){fcfs();}

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
   var list = [];

   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML
      };

      list.push(process);
   }

   list.forEach(function (element) {
      randomColor = getRandomColor();

      if (element.arrivalTime == seconds) {
         if (cpu.length < 1) {
            addToCPU(element);
         } else {
            addToWaitingQueue(element);
         }
      }
   });
      
}
//============================================================================================================================================
function sjf() {
   alert("sjf");
}

function rr() {
   alert("rr");
}
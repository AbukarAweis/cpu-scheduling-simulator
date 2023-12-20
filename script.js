
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

var running = false;

var randomColor;

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
}

   /*
   //Push the given process to the fQueue to keep track of it
   //and append a process element child to finishedDisplay so it can be displayed.
   */
function addToFinishedQueue(process) {
   var processElement = createProcessElement(process);
   fQueue.push(process);
   finishedDisplay.appendChild(processElement);
}

   /*
   //If the CPU is empty, remove the process from waitingDisplay,
   //push the given process to the cpu to keep track of it
   //and append a process element child to cpuDisplay so it can be displayed.
   */
function addToCPU(process) {
   if (cpu.length < 1) {
      var processElement = createProcessElement(process);
      cpu.push(process);
      cpuDisplay.appendChild(processElement);
      removeProcess(processElement.textContent);
   }
}

   /*
   //Once all inputs are validated, add a new row with 3 columns
   //to the table. Insert the correct values in each of the 3 columns.
   //Then add the process to the waiting queue and updated the number
   //of processes that are completed
   */
function addProcess() {

  validateInput(process.processID);
  validateInput(process.arrivalTime);
  validateInput(process.burstTime);

  randomColor = getRandomColor();

   if (validateInput(process.processID) && validateInput(process.arrivalTime) && validateInput(process.burstTime)){
      var newRow = table.insertRow(table.rows.length);

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = process.processID.value;
      cell2.innerHTML = process.arrivalTime.value;
      cell3.innerHTML = process.burstTime.value;

      addToWaitingQueue(process);

      getNumCompleted();
   }
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
   // var randomColor = getRandomColor();

   var processElement = document.createElement('div');
   processElement.className = 'process-element';
   processElement.textContent = "P" + process.processID.value;
   processElement.style.backgroundColor = randomColor;
   processElement.style.color = getTextColor(randomColor);

   processElement.id = "P" + process.processID.value;

   return processElement;
}

   /*
   //An input is invalid if it is empty, a negative number, or a fractional number.
   */
function validateInput(element) {
   if (element.value === "" || parseFloat(element.value) < 0 || !/^[0-9]+$/.test(element.value)) {
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
   completed.textContent = "Completed: " + fQueue.length + " / " + wQueue.length;
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

   //startTimer();

   switch (algorithm) {
      case "fcfs":
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
}

function startTimer() {
   clearInterval(timerInterval);
   timerInterval = setInterval(function () {
       updateTimer();
   }, 1000);
}

function stopTimer() {
   clearInterval(timerInterval);
}

function updateTimer() {
//    document.getElementById('time').textContext = formatTime(seconds);
   var timer = document.getElementById('time');
   timer.textContent = "Time: " + formatTime(seconds);

   if (wQueue.length !== 0) {
      for (var process of wQueue) {
         if (process.arrivalTime.value == seconds) {
            addToCPU(process);
         }
      }
   }

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
   if (table.children.length != 0) {
      startTimer();
   } else {
      alert("Add Process Before Starting");
   }
}
//============================================================================================================================================
function sjf() {
   alert("sjf");
}

function rr() {
   alert("rr");
}
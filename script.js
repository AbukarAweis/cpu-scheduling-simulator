
var table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
// var processID = document.getElementById('process-id');
// var arrivalTime = document.getElementById('arrival-time');
// var burstTime = document.getElementById('burst-time');

var wQElement = document.getElementById('waiting-queue');
var fQElement = document.getElementById('finished-queue');
var cpuElement = document.getElementById('cpu');

var wQueue = [];
var fQueue = [];
var cpu = [];

var timerInterval;
var seconds = 0;

var process = {
    processID: document.getElementById('process-id'),
    arrivalTime: document.getElementById('arrival-time'),
    burstTime: document.getElementById('burst-time'),
};

function addToWaitingQueue(process) {
   var randomColor = getRandomColor();

   var processElement = document.createElement('div');
   processElement.className = 'process-element';
   processElement.textContent = "P" + process.processID.value;
   processElement.style.backgroundColor = randomColor;
   processElement.style.color = getTextColor(randomColor);

   wQueue.push(process);
   wQElement.appendChild(processElement);
}

function addToFinishedQueue(process) {
   var randomColor = getRandomColor();

   var processElement = document.createElement('div');
   processElement.className = 'process-element';
   processElement.textContent = "P" + process.processID.value;
   processElement.style.backgroundColor = randomColor;
   processElement.style.color = getTextColor(randomColor);

   fQueue.push(process);
   fQElement.appendChild(processElement);
}

function addToCPU(process) {
   var randomColor = getRandomColor();

   var processElement = document.createElement('div');
   processElement.className = 'process-element';
   processElement.textContent = "P" + process.processID.value;
   processElement.style.backgroundColor = randomColor;
   processElement.style.color = getTextColor(randomColor);

   cpu.push(process);
   cpuElement.appendChild(processElement);
}

function addProcess() {
   /*
   If all inputs are valid, add a new row with three cells to the table.
   Set the content of each cell as the inputs, respectively.
   */
//    alert(process.arrivalTime.value);
  validateInput(process.processID);
  validateInput(process.arrivalTime);
  validateInput(process.burstTime);


   if (validateInput(process.processID) && validateInput(process.arrivalTime) && validateInput(process.burstTime)){
      var newRow = table.insertRow(table.rows.length);

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = process.processID.value;
      cell2.innerHTML = process.arrivalTime.value;
      cell3.innerHTML = process.burstTime.value;

      addToWaitingQueue(process);
    //   alert(wQueue.join(', '));
    //   alert(wQueue[0]);
    //   addToFinishedQueue(process);
    //   alert("fq " + fQueue.join(', '));
    //   alert(fQueue.length);
      // add();
      // alert(seconds);
      //finish();
      
    //   alert(wQueue[0].arrivalTime.value);
    // if (wQueue[0].arrivalTime.value == seconds) {
    //     alert(wQueue[0].arrivalTime.value + " " + seconds);
    //  addToFinishedQueue(wQueue[0]);
    // }
    
   }

   getNumCompleted();
   // alert(table.textContent);
   
}

/*
An input is invalid if it is empty, a negative number, or a fractional number.
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

function getNumCompleted() {
   var completed = document.getElementById('completed');

   completed.textContent = "Completed: " + fQueue.length + " / " + wQueue.length;
}

function getRandomColor() {
   var letter = '0123456789ABCDEF';
   var color = '#';
   for (var i = 0; i < 6; i++) {
      color += letter[Math.floor(Math.random() * 16)];
   }

   return color;
}

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
   alert(table.textContent);
   var selectedAlgo = document.getElementById("algo-select");
   var algorithm = selectedAlgo.value;

   startTimer();

   
   


   // switch (algorithm) {
   //    case "fcfs":
   //       fcfs();
   //       break;
   //    case "sjf":
   //       sjf();
   //       break;
   //    case "rr":
   //       rr();
   //       break;
   //    default:
   //       alert("invalid algorithm");
   // }
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
   
   //if (wQueue.length !== 0) {
    // for (var i = 0; i < wQueue.length; i++) {
        
    // }  
   // }

    // for (var element in wQueue) {
        if (wQueue[0].arrivalTime.value == seconds) {
            addToCPU(wQueue[0]);
        }
    // }
    seconds++;
}

function formatTime(seconds) {
   var minutes = Math.floor(seconds / 60);
   var remainingSeconds = seconds % 60;

   return (minutes < 10 ? "0" : "") + minutes + ":" + 
            (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}

function fcfs() {
   alert("fcfs");
}

function sjf() {
   alert("sjf");
}

function rr() {
   alert("rr");
}
var table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
var summaryTable = document.getElementById('summary-table').getElementsByTagName('tbody')[0];
var summaryLog = document.getElementById('summary-log');

var waitingDisplay = document.getElementById('waiting-queue');
var finishedDisplay = document.getElementById('finished-queue');
var cpuDisplay = document.getElementById('cpu');

var wlabel = document.getElementById("waiting-label");
var flabel = document.getElementById("finished-label");
var clabel = document.getElementById("cpu-label");

var timer = document.getElementById('time');
var statusDiv = document.getElementById("status");
var workingOn = document.getElementById("working-on");

var genButton = document.getElementById("gen-button");
var addButton = document.getElementById("add-button");
var startButton = document.getElementById("start-button");
var pauseButton = document.getElementById("pause-button");
var resumeButton = document.getElementById("resume-button");
var resetButton = document.getElementById("reset-button");

var errorMessage = document.getElementById("error-message");

var selectedAlgo = document.getElementById("select");
var algoDiv = document.getElementById("algorithm");

var quantumInput = document.getElementById("quantum-input");
var qTime = document.getElementById("quantum");

var progress = document.getElementById("progress");
var progressPercent = document.getElementById("progress-percent");

var algorithm;
var running = false;

var wQueue = [];
var fQueue = [];
var cpu = [];

var timerInterval;
var seconds = 0;
var numOfProcesses = 0;

var randomColor;
var burstCopy;
var exitTime;

   //max exit time and min arrival time are used to calculate throughput
var maxET = Number.MIN_SAFE_INTEGER;
var minAT = Number.MAX_SAFE_INTEGER;

   //keep track of turnaround time, wait time, and non-idle time to calculate cpu utilization
var totalTAT = 0;
var totalWT = 0;
var totalNIT = 0;

var availableID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

percentage = 0;

function createProgressSections() {
   for (let i = 0; i < numOfProcesses; i++) {
      const section = document.createElement('div');
      section.className = 'progress-section';
      section.style.width = `${100 / numOfProcesses}%`
      section.style.background = "white";
      progress.appendChild(section);
   }
}

function updateProgress() {
   const sections = document.querySelectorAll('.progress-section');

   percentage += (100 / numOfProcesses);

   sections.forEach((section, index) => {
      section.style.width = `${percentage / sections.length * (index + 1)}%`;
      section.style.backgroundColor = "#3498db";
   });

   progressPercent.textContent = `${percentage.toFixed(2)}%`;
}

   //process object
var process = {
    processID: document.getElementById('process-id'),
    arrivalTime: document.getElementById('arrival-time'),
    burstTime: document.getElementById('burst-time'),
};

function toggleVisibility() {
   if (selectedAlgo.value === "rr") {
      qTime.classList.add("show");
   } else {
      qTime.classList.remove("show");
      quantumInput.classList.remove("error");
   }
}

   /*
   //Push the given process to the wQueue to keep track of it
   //and append a process element child to waitingDisplay so it can be displayed.
   //Update the summary log using waiting queue's color
   */
function addToWaitingQueue(process, processElement) {
   wQueue.push(process);
   waitingDisplay.appendChild(processElement);

   updateSummaryLog(process.processID + " -- Waiting", "#006400");
   processElement.classList.remove("roll");
}

function addToWaitingQueueAt(process, processElement, index) {
   if (index < 0) {index = index + wQueue.length};

   wQueue.splice(index, 0, process);
   waitingDisplay.insertBefore(processElement, waitingDisplay.children[index]);

   updateSummaryLog(process.processID + " -- Waiting", "#006400");
}

   /*
   //Push the given process to the fQueue to keep track of it
   //and append a process element child to finishedDisplay so it can be displayed.
   //Update the summary log using finishing queue's color
   */
function addToFinishedQueue(process, processElement) {
   fQueue.push(process);
   finishedDisplay.appendChild(processElement);

   exitTime = seconds;

   addSummaryTable(process);
   updateProgress();
   updateSummaryLog(process.processID + " -- Finished", "#0E6BA8");

   processElement.classList.remove("roll");
}

   /*
   //If the burstTime is zero, add to the finishedQueue instead of adding to CPU.
   //If the CPU is empty, remove the process from waitingDisplay,
   //push the given process to the cpu to keep track of it
   //and append a process element child to cpuDisplay so it can be displayed.
   //Update summary log using CPU's color
   */
  function addToCPU(process, processElement) {
     cpuDisplay.classList.add("col-change");
     if (process.burstTime == 0) {
        addToFinishedQueue(process, processElement);
      } else if (cpu.length < 1) {

      cpu.push(process);
      cpuDisplay.appendChild(processElement);
      
         //update the status of what the CPU is working on
      statusDiv.style.backgroundColor = "#C04ABC";
      statusDiv.classList.add('col-change-2');

      statusDiv.addEventListener('animationend', function () {
         statusDiv.classList.remove('col-change-2');
      });

      if (process.burstTime != 0 && process.arrivalTime != 0) {
         workingOn.textContent = "P" + process.processID + " Burst: " + (process.burstTime) + "/" + process.burstCopy;
      } else {
         workingOn.textContent = "P" + process.processID + " Burst: " + (process.burstTime) + "/" + process.burstCopy;
      }

      processElement.classList.add("roll");
      updateSummaryLog(process.processID + " > CPU", "#FFBA49");
   }
}

   /*
   //The burst time of the process in the CPU is decremented by 1 every second.
   //If the burst time reaches zero, the process is taken out of the cpu and
   //added to the finished queue. 
   //Non-idle time is incremented whenever the cpu is updated.
   */
function updateCPU() {
   var process = cpu[0];
   var processElement = document.getElementById("P" + process.processID);
   process.burstTime--;
   workingOn.textContent = "P" + process.processID + " Burst: " + process.burstTime + "/" + process.burstCopy;
   
   if (process.burstTime <= 0) {
      cpu.pop();
      addToFinishedQueue(process, processElement);
      statusDiv.style.backgroundColor = "gray";
      workingOn.textContent = "< IDLE >";
   } 
   
   clabel.textContent = "CPU (" + cpu.length + "/1)";
   totalNIT++;
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

         //disable generate button and reset all values to placeholder
      genButton.disabled = true;
      process.processID.value = process.processID.placeholder;
      process.arrivalTime.value = process.arrivalTime.placeholder;
      process.burstTime.value = process.burstTime.placeholder;
      numOfProcesses++;
   }
}

   /*
   //Automatically generate 10 processes that have a unique id from 1-10
   */
function generate() {
   var id;

   for (var i = 0; i < 10; i++) {
      var randomIndex = Math.floor(Math.random() * availableID.length);
      var selectedID = availableID.splice(randomIndex, 1)[0];
      id = selectedID;

      var newRow = table.insertRow(table.rows.length);

      newRow.id = "P" + id;

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = id;
      cell2.innerHTML = Math.floor(Math.random() * 10) + 1;
      cell3.innerHTML = Math.floor(Math.random() * 10) + 1;

      numOfProcesses++;
   }

      //If there are any errors displayed, remove them
      //disable the generate button
   removeErrors();
   genButton.disabled = true;
}

   /*
   //Used to output the results of the simulation in real time.
   */
function updateSummaryLog(content, color) {

      //span elements used to change color of the text
   var contentElement = document.createElement("p");
   var first = document.createElement("span");
   var second = document.createElement("span");
   var third = document.createElement("span");

      //the content is split into three parts using a whitespace
      //each part is styled and colored if needed
   const wordsArray = content.split(' ');

   first.textContent = " P" + wordsArray[0] + " ";
   first.style.fontWeight = "bold";

   second.textContent = wordsArray[1] + " ";

   third.textContent = wordsArray[2];
   third.style.color = color;
   third.style.fontWeight = "bold";

      //each part is added to the paragraph element
      //which is then appended to the summary log location
   contentElement.textContent = "@ " + formatTime(seconds);
   contentElement.appendChild(first);
   contentElement.appendChild(second);
   contentElement.appendChild(third);

   summaryLog.appendChild(contentElement);
   summaryLog.scrollTop = summaryLog.scrollHeight;
}

   /*
   //Create the ending message of the summary log by
   //calculating all values listed and appending them
   //to the summary log.
   */
function endSummaryLog() {
   var endSummary = document.createElement("p");
   var numProc = document.createElement("p");
   var totalTime = document.createElement("p");
   var throughputElement = document.createElement("p");
   var avgWTElement = document.createElement("p");
   var avgTATElement = document.createElement("p");
   var cpuUtilElement = document.createElement("p");

   var throughput = (numOfProcesses / (seconds - 1)).toFixed(2);
   var cpuUtilization = ((totalNIT / (seconds)) * 100).toFixed(2);

   endSummary.textContent = "***" + algorithm.toUpperCase() + " SIMULATION COMPLETE***";
   numProc.textContent = "# of Processes: " + numOfProcesses;
   totalTime.textContent = "Total Duration: " + (formatTime(seconds - 1));
   avgWTElement.textContent = "Avg. Waiting Time: " + formatTime((totalWT / numOfProcesses).toFixed(2));
   avgTATElement.textContent = "Avg. Turnaround Time: " + formatTime((totalTAT / numOfProcesses).toFixed(2));
   throughputElement.textContent = "Throughput: " + ((throughput != Infinity) ? throughput : 0);
   cpuUtilElement.textContent = "CPU Utilization: " + ((cpuUtilization > 100) ? 100 : cpuUtilization) + "%";
   
   endSummary.style.fontWeight = "bold";
   numProc.style.fontWeight = "bold";
   totalTime.style.fontWeight = "bold";
   avgWTElement.style.fontWeight = "bold";
   avgTATElement.style.fontWeight = "bold";
   throughputElement.style.fontWeight = "bold";
   cpuUtilElement.style.fontWeight = "bold";

   summaryLog.appendChild(endSummary);
   summaryLog.appendChild(numProc);
   summaryLog.appendChild(totalTime);
   summaryLog.appendChild(avgWTElement);
   summaryLog.appendChild(avgTATElement);
   summaryLog.appendChild(throughputElement);
   summaryLog.appendChild(cpuUtilElement);
   summaryLog.scrollTop = summaryLog.scrollHeight;
}

   //used to add a process and all of its simulation results
   //to the summary table
function addSummaryTable(process) {
   var newRow = summaryTable.insertRow(summaryTable.rows.length);
   var turnAroundTime = exitTime - process.arrivalTime;
   var waitingTime = turnAroundTime - process.burstCopy;
   
   newRow.id = "row" + process.processID;
   
   var cell1 = newRow.insertCell(0);
   var cell2 = newRow.insertCell(1);
   var cell3 = newRow.insertCell(2);
   var cell4 = newRow.insertCell(3);
   var cell5 = newRow.insertCell(4);
   var cell6 = newRow.insertCell(5);
   
   cell1.innerHTML = process.processID;
   cell2.innerHTML = process.arrivalTime;
   cell3.innerHTML = process.burstCopy;
   cell4.innerHTML = formatTime(exitTime);
   cell5.innerHTML = formatTime(waitingTime);
   cell6.innerHTML = formatTime(turnAroundTime);

   totalWT += waitingTime;
   totalTAT += turnAroundTime;

      //used to keep track of the maximum exit time
   if (exitTime > maxET) {
      maxET = exitTime;
   }

      //used to keep track of the minimum arrival time
   if (process.arrivalTime < minAT) {
      minAT = process.arrivalTime;
   }

   newRow.classList.add('highlighted-row');
   
   // Remove the 'highlighted-row' class after the animation completes
   newRow.addEventListener('animationend', function () {
      newRow.classList.remove('highlighted-row');
   });

   sortTable();
}

function sortTable() {
   var table = document.getElementById('summary-table');
   var tbody = table.querySelector('tbody');
   var rows = Array.from(tbody.getElementsByTagName('tr'));

   var info = document.getElementById('info');
   info.style.visibility = "visible";

   // Sort the rows based on the id attribute
   rows.sort(function (a, b) {
     var aId = parseInt(a.id.substring(3)); // Assuming ids start with "row" followed by a number
     var bId = parseInt(b.id.substring(3));
     return aId - bId;
   });

   // Remove existing rows from the tbody
   tbody.innerHTML = '';

   // Append the sorted rows back to the tbody
   rows.forEach(function (row) {
     tbody.appendChild(row);
   });
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

function showError(error_num) {
   errorMessage.textContent = "";
   p = document.createElement("p");
   p2 = document.createElement("p");
   p3 = document.createElement("p");

   switch (error_num) {
      case 1:
         p.textContent = "Please Ensure That: ";
         p2.textContent = "(1) All Inputs Are Positive Integers";
         p3.textContent = "(2) Each Process Has A Unique ID";
         break;
      case 2:
         p.textContent = "There Must Be At Least One Valid Process";
         p2.textContent = "Before The Simulation Can Begin";
         break;
      case 3:
         p.textContent = "The Time Quantum Must Be A Positive Integer";
         break;
      default:
         alert("Invalid Error Message");
   }

   
   errorMessage.appendChild(p);
   errorMessage.appendChild(p2);
   errorMessage.appendChild(p3);
   errorMessage.style.visibility = "visible";
}

function removeErrors() {
   errorMessage.style.visibility = "hidden";
   process.processID.classList.remove("error");
   process.arrivalTime.classList.remove("error");
   process.burstTime.classList.remove("error");

   process.processID.value = process.processID.placeholder;
   process.arrivalTime.value = process.arrivalTime.placeholder;
   process.burstTime.value = process.burstTime.placeholder;
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
         showError(1);
         return false;
      }

      for (var i = 0; i < table.rows.length; i++) {
         var existingID = table.rows[i].cells[0].innerHTML;

         if (existingID === element.value) {
            element.classList.add("error");
            showError(1);
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
      errorMessage.style.visibility = "hidden";
      return true;
   }
}

   /*
   //Used to keep track of progress
   //and update accordinly if progress is at 100%
   */
function getPercentComplete() {
   if (progressPercent.textContent == "100.00%") {
      pauseButton.disabled = true;
      resumeButton.disabled = true;
      
      stopTimer();
      endSummaryLog();
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

function reset() {
   location.reload();
}

function start() { 
   algorithm = selectedAlgo.value;

   if (table.rows.length != 0) {

      switch (algorithm) {
         case "fcfs":
         case "sjf":
            var startSummary = document.createElement("p");
            startSummary.textContent = "***" + algorithm.toUpperCase() + " SIMULATION BEGIN***";
            startSummary.style.fontWeight = "bold";
            summaryLog.appendChild(startSummary);
            createProgressSections();

            startTimer(algorithm);
            running = true;
            break;

         case "rr":
            if (validateInput(quantumInput, false)) {

               var startSummary = document.createElement("p");
               startSummary.textContent = "***" + algorithm.toUpperCase() + " SIMULATION BEGIN***";
               startSummary.style.fontWeight = "bold";
               summaryLog.appendChild(startSummary);
               createProgressSections();

               startTimer(algorithm);
               running = true;
               quantumInput.disabled = true;
            } else {
               showError(3);
            }
            break;
         default:
            alert("invalid algorithm");
      }

      if (running) {

         //Setting the algorithm to the text content of selected option
         var algoText = document.createElement('span');
         algoText.textContent = selectedAlgo.options[(selectedAlgo.selectedIndex)].textContent;
         algoText.style.fontStyle = "italic";
         algoDiv.textContent = "Algorithm: "
         algoDiv.appendChild(algoText);
   
         genButton.disabled = true;
         addButton.disabled = true;
         startButton.disabled = true;
         selectedAlgo.disabled = true;
         process.processID.disabled = true;
         process.arrivalTime.disabled = true;
         process.burstTime.disabled = true;

         startButton.style.visibility = "hidden";
         pauseButton.style.visibility = "visible";

         removeErrors();
      }
   } else {
      removeErrors();
      showError(2)
   }
}

function startTimer(algorithm) {
   clearInterval(timerInterval);
   timerInterval = setInterval(function () {
      
      if (cpu.length == 1) {
         updateCPU();
      }
      
      if (algorithm == "fcfs" ){fcfs();}
      if (algorithm == "sjf"){sjf();}
      if (algorithm == "rr"){rr();}
      
      updateTimer();
      getPercentComplete();
   }, 1000);
}

function stopTimer() {
   pauseButton.style.visibility = "hidden";
   resumeButton.style.visibility = "visible";

   clearInterval(timerInterval);

   if (cpu.length > 0) {
      var c = cpu[0];
      var cur = document.getElementById("P" + c.id);
      cur.classList.remove("roll");
   }
   cpuDisplay.classList.remove("col-change");
}

function updateTimer() {
   timer.textContent = "Time: " + formatTime(seconds);
   seconds++;

   if (cpu.length == 0) {
      cpuDisplay.classList.remove("col-change");
   }

   wlabel.textContent = "Waiting (" + wQueue.length + "/" + numOfProcesses + ")";
   flabel.textContent = "Finished (" + fQueue.length + "/" + numOfProcesses + ")";
   clabel.textContent = "CPU (" + cpu.length + "/1)"; 
}

function resumeTimer() {
   resumeButton.style.visibility = "hidden";
   pauseButton.style.visibility = "visible";
   startTimer(algorithm);

   if (cpu.length > 0) {
      var p = cpu[0];
      var cur = document.getElementById("P" + p.id);
      cur.classList.add("roll");

      cpuDisplay.classList.add("col-change");
   }
}

function formatTime(seconds) {
   var minutes = Math.floor(seconds / 60);
   var remainingSeconds = seconds % 60;

   return minutes + ":" + 
            (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}
//============================================================================================================================================
   /*
   //NON PRE-EMPTIVE FCFS APPROACH
   //The first come first serve algorithm takes the first process in the waiting queue and sends it
   //to the cpu until it's finished processing (burst time equals zero), then sends it to the finished queue
   */
function fcfs() {
   
   /*
   //all[] is used to store all the processes.
   //filter[] is used to filter all processes.
   //In this algorithm, if 2 more more process enter the waiting queue at the same time, the one with
   //the higher priority is the one that has a lower id number.
   */
   var all = [];
   var filter = [];

   //a process is made for every entry in the table then pushed to all[]
   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML,
         burstCopy: table.rows[i].cells[2].innerHTML
      };
      process.id = process.processID;

      all.push(process);
   }
   
   /*
   //for each process in all[] if its arrival time matches the current time, push it to filter[]
   //and sort all processes in filter by their id in ascending order.
   */
   all.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.id - b.id;
         }); 
      }
   });

   /*
   //for each process in filter[], create a processElement for it,
   //add the process and its element to the waiting queue,
   //and remove the entry for the process in the table
   */
   filter.forEach(function (process) {
         var processElement = createProcessElement(process);
         addToWaitingQueue(process, processElement);
         removeProcess(processElement.textContent);
   });

   /*
   //if there are processes waiting and the cpu is empty,
   //add the first process in the waiting queue to the cpu
   //and remove that process from teh waiting queue
   */
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }
}
//============================================================================================================================================
//NON PRE-EMPTIVE SJF APPROACH
//If the cpu is empty, the process with the shortest job will be executed until the burst is finished
//temp is used to copy all[]
var temp = [];
function sjf() {
   /*
   //all[] is used to store all the processes.
   //filter[] is used to filter all processes.
   */
  var all = [];
  var filter = [];

   //a process is made for every entry in the table then pushed to all[]
   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML,
         burstCopy: table.rows[i].cells[2].innerHTML
      };
      process.id = process.processID;

      /*
      //the processes are sorted by their burst time 
      */
      all.push(process);
      all.sort(function (a, b) {
         return a.burstTime - b.burstTime;
      });

      /*
      //temp is mapped to every processes all[] and their indices
      */
      if (temp.length < all.length) {
         temp = all.map((process, index) => ({index, ...process}));
      }
   }

   /*
   //each process in temp[] is sent to filter[] if its arrival time is reached.
   //filter[] is then sorted by burst time
   */
   temp.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.burstTime - b.burstTime;
         });
      }
   });
   
   /*
   //a process element is created for each process in filter[].
   //if filter > 1 (more than 1 process arrived at the same time),
   //waiting queue is updated using the order of processes in filter[]
   //else, waiting queue is updated using the order of process in wQueue[]
   */
   filter.forEach(function (process) {
      var processElement = createProcessElement(process);

      if (filter.length > 1) {
         addToWaitingQueueAt(process, processElement, filter.indexOf(filter[process.index]))
      } else {
         wQueue.sort((a, b) => a.index - b.index);
         addToWaitingQueueAt(process, processElement, wQueue.indexOf(wQueue[process.index]));
      }

      removeProcess(processElement.textContent);
   });

   /*
   //if there are processes waiting and the cpu is empty,
   //add the first process in the waiting queue to the cpu
   //and remove that process from teh waiting queue
   */
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }
}
//============================================================================================================================================
var currentTime = 0;

function rr() {
   var all = [];
   var filter = [];

   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML,
         burstCopy: table.rows[i].cells[2].innerHTML
      };
      process.id = process.processID;
      
      all.push(process);
   }
   
   all.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.id - b.id;
         }); 
      }  
   });

   filter.forEach(function (process) {
      var processElement = createProcessElement(process);
      addToWaitingQueue(process, processElement);
      removeProcess(processElement.textContent);
   });

   cpu.forEach(function (process) {
      if (seconds == ((Number(quantumInput.value)) + currentTime) && (wQueue.length != 0)) {
         currentTime = seconds;
         var processElement = document.getElementById("P" + process.processID);
         cpu.pop();
         addToWaitingQueue(process, processElement);
      }
   })
   
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      currentTime = seconds;
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }  
}
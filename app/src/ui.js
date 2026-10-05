// DOM references
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

// Process input fields
var process = {
    processID: document.getElementById('process-id'),
    arrivalTime: document.getElementById('arrival-time'),
    burstTime: document.getElementById('burst-time'),
};


// Progress display
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


// Round Robin quantum display
function toggleVisibility() {
   if (selectedAlgo.value === "rr") {
      qTime.classList.add("show");
   } else {
      qTime.classList.remove("show");
      quantumInput.classList.remove("error");
   }
}


// Simulation log
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


// Summary table
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

   if (exitTime > maxET) {
      maxET = exitTime;
   }

   if (process.arrivalTime < minAT) {
      minAT = process.arrivalTime;
   }

   newRow.classList.add('highlighted-row');
   
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


// Error display
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


// Progress completion
function getPercentComplete() {
   if (progressPercent.textContent == "100.00%") {
      pauseButton.disabled = true;
      resumeButton.disabled = true;
      
      stopTimer();
      endSummaryLog();
   }
}


// Time display formatting
function formatTime(seconds) {
   var minutes = Math.floor(seconds / 60);
   var remainingSeconds = seconds % 60;

   return minutes + ":" + 
            (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
}
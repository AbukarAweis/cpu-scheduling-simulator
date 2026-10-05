// Waiting queue
function addToWaitingQueue(process, processElement) {
   wQueue.push(process);
   waitingDisplay.appendChild(processElement);

   updateSummaryLog(process.processID + " → Waiting", "#006400");
   processElement.classList.remove("roll");
}

function addToWaitingQueueAt(process, processElement, index) {
   if (index < 0) {index = index + wQueue.length};

   wQueue.splice(index, 0, process);
   waitingDisplay.insertBefore(processElement, waitingDisplay.children[index]);

   updateSummaryLog(process.processID + " → Waiting", "#006400");
}


// Finished queue
function addToFinishedQueue(process, processElement) {
   fQueue.push(process);
   finishedDisplay.appendChild(processElement);

   exitTime = seconds;

   addSummaryTable(process);
   updateProgress();
   updateSummaryLog(process.processID + " → Finished", "#0E6BA8");

   processElement.classList.remove("roll");
}


// CPU
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
    updateSummaryLog(process.processID + " → CPU", "#C96F00");
   }
}

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


// Manual process creation
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


// Automatically generate processes
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


// Remove process element
function removeProcess(childID) {
   var child = document.getElementById(childID);
   child.parentNode.removeChild(child);
}


// Create visual process element
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


// Validate process input
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
   //when validating any input other than id.
   if ((element.value === "" || parseFloat(element.value) < 0 || !/^[0-9]+$/.test(element.value)) && !isID) {
      element.classList.add("error");
      showError(1);
      return false;
   } else {
      element.classList.remove("error");
      errorMessage.style.visibility = "hidden";
      return true;
   }
}


// Process colors
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
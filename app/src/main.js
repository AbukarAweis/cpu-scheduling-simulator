// Reset the simulator
function reset() {
   location.reload();
}


// Start the selected scheduling simulation
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

         // Display the selected algorithm.
         var algoText = document.createElement('span');
         algoText.textContent = selectedAlgo.options[(selectedAlgo.selectedIndex)].textContent;
         algoText.style.fontStyle = "italic";
         algoDiv.textContent = "Algorithm: ";
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


// Run the selected scheduling algorithm once per second
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


// Pause the simulation timer
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


// Update the displayed time and queue counts
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


// Resume the simulation timer
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
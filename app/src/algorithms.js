// First Come First Serve (FCFS)
// Non-preemptive scheduling. Processes are handled in arrival order.
// If multiple processes arrive at the same time, the lower process ID is prioritized.
function fcfs() {

   var all = [];
   var filter = [];

   // Build process objects from the process table.
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

   // Select processes that have reached their arrival time.
   // Same-time arrivals are ordered by process ID.
   all.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.id - b.id;
         }); 
      }
   });

   // Move newly arrived processes into the waiting queue.
   filter.forEach(function (process) {
         var processElement = createProcessElement(process);
         addToWaitingQueue(process, processElement);
         removeProcess(processElement.textContent);
   });

   // Send the next waiting process to the CPU when it is available.
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }
}

//======================================================================================
// Shortest Job First (SJF)
// Non-preemptive scheduling. The available process with the shortest
// burst time is selected when the CPU becomes available.
function sjf() {

  var all = [];
  var filter = [];

   // Build process objects from the process table.
   for (var i = 0; i < table.rows.length; i++) {
      var process = {
         processID: table.rows[i].cells[0].innerHTML,
         arrivalTime: table.rows[i].cells[1].innerHTML,
         burstTime: table.rows[i].cells[2].innerHTML,
         burstCopy: table.rows[i].cells[2].innerHTML
      };
      process.id = process.processID;

      // Keep processes ordered by burst time.
      all.push(process);
      all.sort(function (a, b) {
         return a.burstTime - b.burstTime;
      });

      // Store each process with its index.
      if (temp.length < all.length) {
         temp = all.map((process, index) => ({index, ...process}));
      }
   }

   // Select processes that have reached their arrival time.
   // Newly available processes are ordered by burst time.
   temp.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.burstTime - b.burstTime;
         });
      }
   });

   // Add newly arrived processes to the waiting queue
   // while preserving the intended SJF ordering.
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

   // Send the next waiting process to the CPU when it is available.
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }
}

//======================================================================================
// Round Robin (RR)
// Preemptive scheduling. Each process receives CPU time for the selected
// time quantum before returning to the waiting queue if it is unfinished.
function rr() {
   var all = [];
   var filter = [];

   // Build process objects from the process table.
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

   // Select processes that have reached their arrival time.
   // Same-time arrivals are ordered by process ID.
   all.forEach(function (process) {
      if (process.arrivalTime == seconds) {
         filter.push(process);
         filter.sort(function (a, b) {
            return a.id - b.id;
         }); 
      }  
   });

   // Move newly arrived processes into the waiting queue.
   filter.forEach(function (process) {
      var processElement = createProcessElement(process);
      addToWaitingQueue(process, processElement);
      removeProcess(processElement.textContent);
   });

   // Return the current process to the waiting queue
   // when its time quantum expires and another process is waiting.
   cpu.forEach(function (process) {
      if (seconds == ((Number(quantumInput.value)) + currentTime) && (wQueue.length != 0)) {
         currentTime = seconds;
         var processElement = document.getElementById("P" + process.processID);
         cpu.pop();
         addToWaitingQueue(process, processElement);
      }
   })
   
   // Send the next waiting process to the CPU when it is available.
   if ((wQueue.length != 0) && (cpu.length == 0)) {
      var process = wQueue[0];
      var processElement = document.getElementById("P" + process.processID);
      currentTime = seconds;
      addToCPU(process, processElement);
      wQueue.splice(0, 1);
   }  
}
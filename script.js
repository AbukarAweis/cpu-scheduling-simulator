function addProcess() {
   var table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
   var processID = document.getElementById('process-id');
   var arrivalTime = document.getElementById('arrival-time');
   var burstTime = document.getElementById('burst-time');

   // alert(processID.classList.toString);
   
   // if (processID.value !== "" && arrivalTime.value !== "" && burstTime.value !== "")  {
      // if (validateInput(processID) || validateInput(arrivalTime) || validateInput(burstTime)){
         if(validateInput(processID,arrivalTime,burstTime)){
      // processID.classList.remove("error");
      // arrivalTime.classList.remove("error");
      // burstTime.classList.remove("error");

      var newRow = table.insertRow(table.rows.length);

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = processID.value;
      cell2.innerHTML = arrivalTime.value;
      cell3.innerHTML = burstTime.value;
   }
}

function validateInput(element) {
   if (element.value === "" || parseFloat(element.value) < 0 || !/^[0-9]+$/.test(element.value)) {
      element.classList.add("error");
      return false;
   } else {
      element.classList.remove("error");
      return true;
   }
}

function validateInputs(processID, arrivalTime, burstTime) {
   if (processID.value === "" || parseFloat(processID.value) < 0 || !/^[0-9]+$/.test(processID.value)) {
      element.classList.add("error");
      return false;
   } else {
      element.classList.remove("error");
      return true;
   }
}
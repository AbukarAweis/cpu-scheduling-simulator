function addProcess() {
   var table = document.getElementById('process-table').getElementsByTagName('tbody')[0];
   var processID = document.getElementById('process-id');
   var arrivalTime = document.getElementById('arrival-time');
   var burstTime = document.getElementById('burst-time');

   /*
   If all inputs are valid, add a new row with three cells to the table.
   Set the content of the columns as the inputs, respectively.
   */
  validateInput(processID);
  validateInput(arrivalTime);
  validateInput(burstTime);

   if (validateInput(arrivalTime) && validateInput(processID) && validateInput(burstTime)){
      var newRow = table.insertRow(table.rows.length);

      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);

      cell1.innerHTML = processID.value;
      cell2.innerHTML = arrivalTime.value;
      cell3.innerHTML = burstTime.value;
   }
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
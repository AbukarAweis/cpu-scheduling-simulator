function validateInput() {
    const inputElement = document.getElementById("myInput");
    const errorTooltip = document.getElementById("errorTooltip");
    const inputValue = inputElement.value.trim();

    // Your validation logic here
    if (inputValue === "") {
        // Show error tooltip
        showErrorTooltip(inputElement, "Please enter a valid value.");
    } else {
        // Hide the tooltip if the input is valid
        hideErrorTooltip(errorTooltip);
        
        // Continue with your logic for valid input
        alert("Input is valid: " + inputValue);
    }
}

function showErrorTooltip(element, message) {
    const errorTooltip = document.getElementById("errorTooltip");

    // Set tooltip content
    errorTooltip.textContent = message;

    // Position the tooltip near the input field
    const rect = element.getBoundingClientRect();
    errorTooltip.style.top = rect.top + window.scrollY - errorTooltip.offsetHeight - 5 + "px";
    errorTooltip.style.left = rect.left + window.scrollX + "px";

    // Show the tooltip
    errorTooltip.style.display = "block";
}

function hideErrorTooltip(errorTooltip) {
    // Hide the tooltip
    errorTooltip.style.display = "none";
}

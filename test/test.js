function validateForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorContainer = document.getElementById("errorContainer");

    // Reset the error container
    errorContainer.style.display = "none";
    errorContainer.textContent = "";

    // Your validation logic here
    if (username.trim() === "") {
        showError("Please enter a username.", errorContainer);
        return false;
    }

    if (password.trim() === "") {
        showError("Please enter a password.", errorContainer);
        return false;
    }

    // If the form is valid, you can proceed with other actions
    return true;
}

function showError(message, container) {
    // Display the error message in the container
    container.textContent = message;
    container.style.display = "block";
}

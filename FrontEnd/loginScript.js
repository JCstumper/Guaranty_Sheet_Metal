// Get references to the form and input fields
const form = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

// Add event listener for form submission
form.addEventListener('submit', function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the values entered by the user
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    console.log('Entered Username:', username);
    console.log('Entered Password:', password);

    // Check if the entered credentials are valid
    if (username === 'username' && password === 'password') {
        console.log('Credentials are valid. Redirecting to home page...');
        // If the credentials are valid, redirect to the home page
        window.location.href = 'dashboard.html';
    } else {
        // If the credentials are not valid, display an error message
        alert('Invalid username or password. Please try again.');
    }
});

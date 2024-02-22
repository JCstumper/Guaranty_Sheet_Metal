document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('authForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission
        login();
    });

    document.getElementById('registerBtn').addEventListener('click', function() {
        register();
    });
});

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(handleResponse)
    .catch(handleError);
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value; // Get the email value

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
    })
    .then(response => response.json())
    .then(handleResponse)
    .catch(handleError);
}

function handleResponse(data) {
    if (data.message) {
        alert(data.message);
    } else {
        // Successful registration or login
        alert('Success!');
        // Redirect or update UI as needed
    }
}

function handleError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
}


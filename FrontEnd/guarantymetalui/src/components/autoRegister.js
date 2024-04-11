// AutoRegister.js
const registerUser = async (username, password, email, role, setIsLoading, setAuth, navigate) => {
    try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

        // Include the role in the request body
        const body = { username, password, email, role };
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const parseRes = await response.json();

        if (parseRes.token) {
            console.log(`Registration successful for ${role}`, parseRes);
            // Optionally, set auth state, navigate, or handle the token here
            // For example:
            // setAuth(true);
            // navigate("/dashboard"); // Navigate to dashboard or another page as required
        } else {
            console.log(`Registration failed for ${role}`, parseRes);
        }
    } catch (error) {
        console.error(`Registration error for ${role}:`, error);
    }
};

const autoRegisterUsers = async (setIsLoading, setAuth, navigate) => {
    // Register the admin user
    await registerUser("admin", "Admin123!", "admin@gmail.com", "admin", setIsLoading, setAuth, navigate);

    // Auto-register another user with the role of "employee"
    await registerUser("employee", "Employee123!", "employee@example.com", "employee", setIsLoading, setAuth, navigate);
};

// Example usage:
// autoRegisterUsers(setIsLoading, setAuth, navigate);


export default registerUser;

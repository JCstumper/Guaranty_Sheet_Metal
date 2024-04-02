// AutoRegister.js
const registerUser = async (setIsLoading, setAuth, navigate) => {
    const username = "admin"; // Replace with desired username
    const password = "Admin123!"; // Replace with desired password
    const email = "admin@gmail.com"; // Replace with desired email address

    try {

        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

        const body = { username, password, email };
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const parseRes = await response.json();

        if (parseRes.token) {
            console.log("Registration successful", parseRes);
        } else {
            console.log("Registration failed", parseRes);
        }
    } catch (error) {
        console.error("Registration error:", error);
    }
};

export default registerUser;

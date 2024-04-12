// AutoRegister.js
const registerUsers = async (setIsLoading, setAuth, navigate) => {
    const users = [
        { username: "admin", password: "Admin123!", email: "admin@gmail.com", role: "admin" },
        { username: "employee", password: "Employee123!", email: "employee@gmail.com", role: "employee" }
    ];

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

    for (const user of users) {
        try {
            // Include the role in the request body
            const body = { ...user };
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();

            if (parseRes.token) {
                console.log(`Registration successful `);
            } else {
                console.log(`Registration failed`);
            }
        } catch (error) {
            console.error(`Registration error `);
        }
    }
};

export default registerUsers;

// AutoRegister.js
const registerUsers = async (setIsLoading, setAuth, navigate) => {
    const users = [
        { username: "admin", password: "Admin123!", email: "admin@gmail.com", role: "admin" },
    ];

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost/api';

    for (const user of users) {
        try {
            // Include the role in the request body
            const body = { ...user };
            await fetch(`${API_BASE_URL}/auth/firstregister`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });

        } catch (error) {
            console.error(`Registration error for ${user.role}:`, error);
        }
    }
};

export default registerUsers;

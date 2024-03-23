// AutoRegister.js
const registerUser = async (setIsLoading, setAuth, navigate) => {
    const username = "admin"; // Replace with desired username
    const password = "Admin123!"; // Replace with desired password
    const email = "admin@gmail.com"; // Replace with desired email address

    try {
        const body = { username, password, email };
        const response = await fetch("https://localhost/api/auth/register", {
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

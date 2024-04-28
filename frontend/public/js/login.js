import { serverUrl, databaseUrl } from "./env.js";

// Function to handle login form submission
async function login(event) { 
     // Prevents the default form submission behavior
    event.preventDefault();
    console.log("hi");
    // Constructs the data object with username and password from the form inputs
    const data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    };

    try {
        // Sends a POST request to the login endpoint with the provided data
        const response = await fetch(databaseUrl + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        });
        // Handles different response statuses
        if (response.status == 401) {
            alert("You are not authenticated.");
        } else if (response.status == 403) {
            alert("The token is invalid.");
        }

        const account = await response.json();
        // Checks the status in the response and takes appropriate actions
        if (account.status === "0") {
            alert("Incorrect username or password");
        } else if (account.status === "1") {
            localStorage.setItem("access_token", account.access_token);
            localStorage.setItem("acc_id", account.acc_id);
            window.location.href = serverUrl + "/account-management";
        }
    } catch (error) { console.error("Error:", error); }
}
// Event listener triggered when the window is fully loaded
window.onload = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
        // Value exists in localStorage
        window.location.href = serverUrl + "/account-management";
    }
};
// Event listener triggered when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", (event) => login(event));
});
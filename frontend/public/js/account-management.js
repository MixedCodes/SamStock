import { serverUrl, databaseUrl, accountsUrl } from "./env.js";
import { openModal } from "./utils.js";
const redirectUrl = serverUrl + "/account-management";
const loginUrl = serverUrl + "/login";
const existingIds = [];

async function getAccounts() {
    try {
        const response = await fetch(databaseUrl + "/accounts");
        let accounts = await response.json();
        if (accounts.hasOwnProperty("data")) { accounts = accounts.data; }

        const tableBody = document.getElementById("table-body");
        for (let i = 0; i < accounts.length; i++) {
            existingIds.push(accounts[i].acc_id);

            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
                <td class="id-row">${accounts[i].acc_id}</td>
                <td>${accounts[i].acc_fname}</td>
                <td>${accounts[i].acc_lname}</td>
                <td>${accounts[i].login_username}</td>
                <td>${accounts[i].acc_email}</td>
                <td>${accounts[i].acc_address}</td>
                <td>
                    <div class="button-cell">
                        <button class="delete-button"><img src="images/delete-icon.svg" alt="delete" width="16" height="16"/></button>
                        <button class="edit-button"><img src="images/settings-icon.svg" alt="settings" width="16" height="16"/></button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tableRow);
        }

        const editButtons = document.getElementsByClassName("edit-button");
        for (let i = 0; i < editButtons.length; i++) {
            editButtons[i].addEventListener("click", () => {
                const accountId = accounts[i].acc_id;
                getEditInfo(accountId);
            });
        }

        const deleteButtons = document.getElementsByClassName("delete-button");
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", () => {
                const accountId = accounts[i].acc_id;
                deleteAccount(accountId);
            });
        }
    } catch (error) { throw error; }
}

async function getEditInfo(accountId) {
    try {
        const response = await fetch(`${accountsUrl}/${accountId}`);
        let account = await response.json();
        if (account.hasOwnProperty("data")) { account = account.data; }

        document.getElementById("edit-id").value = accountId;

        document.getElementById("edit-fname").value = account[0].acc_fname;
        document.getElementById("edit-lname").value = account[0].acc_lname;
        document.getElementById("edit-email").value = account[0].acc_email;
        document.getElementById("edit-address").value = account[0].acc_address;

        document.getElementById("edit-username").value = account[0].login_username;
        document.getElementById("edit-password").value = account[0].login_password;

        document.getElementById("delete").addEventListener("click", () => deleteAccount(accountId));

        const editModal = document.getElementById("edit-modal");
        openModal(editModal);
    } catch (error) { throw error; }
}

async function handleFormMethods(event) {
    event.preventDefault();
    if (!localStorage.getItem("access_token")) {
        alert("You are not authenticated.");
        window.location.href = loginUrl;
    }

    const form = event.target;
    let action = accountsUrl;
    const method = form.getAttribute("method");

    const formData = new FormData(form);
    const body = JSON.stringify(Object.fromEntries(formData));
   
    let accountId = document.getElementById("edit-id").value;
    if (method === "PUT" || method === "DELETE") { action += `/${accountId}`; } 
    else if (method == "POST") {
        accountId = document.getElementById("add-id").value;
        if (accountId !== "" && (isNaN(accountId) || parseInt(accountId) < 1)) {
            alert("The ID must be a positive number or blank for auto-increment.");
            document.getElementById("add-id").focus();
            return;
        }

        if (accountId !== "" && existingIds.includes(parseInt(accountId))) {
            alert(`The ID ${accountId} already exists.`);
            document.getElementById("add-id").focus();
            return;
        }
    }

    try {
        const response = await fetch(action, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }, 
            body: body
        });

        if (response.status === 403) {
            alert("You are not a superuser; you are not allowed to edit this account.");
        }

        const data = await response.json();

        if (data.error === false) {
            window.location.href = redirectUrl;
        } else if (!data.hasOwnProperty("error")) {
            window.location.href = redirectUrl;
        }
    } catch (error) { throw error; }
}

async function deleteAccount(accountId) {
    if (!localStorage.getItem("access_token")) {
        alert("You are not authenticated.");
        window.location.href = loginUrl;
    }

    try {
        const response = await fetch(`${accountsUrl}/${accountId}`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            } 
        });

        if (response.status === 403) {
            alert("You are not a superuser; you are not allowed to delete this account.");
        }

        const data = await response.json();

        if (data.error === false) {
            window.location.href = redirectUrl;
        } else if (!data.hasOwnProperty("error")) {
            window.location.href = redirectUrl;
        }
    } catch (error) { throw error; }
}

window.onload = async () => {
    try {
        const response = await fetch(databaseUrl + "/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        });

        if (response.status == 400) {
            alert ("Incorrect username or password.")
            window.location.href = loginUrl;
        } else if (response.status == 401) {
            alert("You are not authenticated.");
            window.location.href = loginUrl;
        } else if (response.status == 403) {
            alert("The token is invalid.");
            window.location.href = loginUrl;
        }

        // Check if request is empty.
        const account = await response.json();
        if (!account) { window.location.href = loginUrl; }
    } catch (error) { console.error("Error:", error); }
};

document.addEventListener("DOMContentLoaded", () => {
    getAccounts();
    const addForm = document.getElementById("add-form");
    addForm.addEventListener("submit", (event) => handleFormMethods(event));

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", (event) => handleFormMethods(event));
});
import { serverUrl, databaseUrl, productsUrl } from "./env.js";
import { openModal, getBrands, getCategories } from "./utils.js";
const redirectUrl = serverUrl + "/product-management";
const existingIds = [];
// Function to fetch and display products
async function getProducts() {
    try {
        const response = await fetch(productsUrl);
        let products = await response.json();
        if (products.hasOwnProperty("data")) { products = products.data; }

        const tableBody = document.getElementById("table-body");
        for (let i = 0; i < products.length; i++) {
            existingIds.push(products[i].prod_id);

            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
                <td class="id-row">${products[i].prod_id}</td>
                <td>${products[i].prod_name}</td>
                <td>${products[i].brand_name}</td>
                <td>${products[i].category_name}</td>
                <td>${products[i].prod_price}</td>
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
                const productId = products[i].prod_id;
                getEditInfo(productId);
            });
        }

        const deleteButtons = document.getElementsByClassName("delete-button");
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", () => {
                const productId = products[i].prod_id;
                deleteProduct(productId);
            });
        }
    } catch (error) { throw error; }
}
// Function to fetch sizes and populate size input fields
async function getSizes(sizeContainer) {
    try {
        const response = await fetch(databaseUrl + "/sizes");
        let sizes = await response.json();
        if (sizes.hasOwnProperty("data")) { sizes = sizes.data; }


        for (let i = 0; i < sizes.length; i++) {    
            const sizeInput = document.createElement("div");
            sizeInput.innerHTML = `
                <label for="${sizeContainer.id}-${i}">${sizes[i].size_name}</label><br>
                <input type="number" id="${sizeContainer.id}-${i}" name="size-${i}" value="0" autocomplete="off" pattern="[0-9]+" required/>
            `

            sizeContainer.appendChild(sizeInput);
        }
    } catch (error) { throw error; }
}
// Function to fetch product information for editing
async function getEditInfo(productId) {
    try {
        let response = await fetch(`${productsUrl}/${productId}`);
        let product = await response.json();
        if (product.hasOwnProperty("data")) { product = product.data; }

        document.getElementById("edit-id").value = productId;
        document.getElementById("edit-name").value = product[0].prod_name;
        document.getElementById("edit-gender").value = product[0].prod_gender;
        document.getElementById("edit-price").value = product[0].prod_price;
        document.getElementById("edit-image").value = product[0].prod_image;
        document.getElementById("edit-desc").value = product[0].prod_desc;
        document.getElementById("edit-brand").value = product[0].brand_id;
        document.getElementById("edit-category").value = product[0].category_id;
        
        response = await fetch(`${databaseUrl}/product-items/${productId}`);
        let productItems = await response.json();
        if (productItems.hasOwnProperty("data")) { productItems = productItems.data; } 

        for (let i = 0; i < productItems.length; i++) {
            document.getElementById(`edit-size-${productItems[i].size_id - 1}`).value = productItems[i].quantity;
        }

        document.getElementById("delete").addEventListener("click", () => deleteProduct(productId));

        const editModal = document.getElementById("edit-modal");
        openModal(editModal);
    } catch (error) { throw error; }
}
// Function to handle form submission for adding and editing products
async function handleFormMethods(event) {
    event.preventDefault();
    if (!localStorage.getItem("access_token")) {
        alert("You are not authenticated.");
        window.location.href = loginUrl;
    }

    const form = event.target;
    let action = productsUrl;
    const method = form.getAttribute("method");
    const formData = new FormData(form);

    const values = [];
    let i = 0;
    formData.forEach((key) => values[i++] = key);

    let productId, body, nextIndex;
    if (method === "PUT") {
        productId = document.getElementById("edit-id").value;
        body = {
            "name": values[0],
            "price": values[1],
            "category": values[2],
            "gender": values[3],
            "brand": values[4],
            "desc": values[5],
            "image": values[6],
            "sizes": {}
        }

        nextIndex = 7;
    } else if (method === "POST") {
        productId = document.getElementById("add-id").value;
        if (productId !== "" && (isNaN(productId) || parseInt(productId) < 1)) {
            alert("The ID must be a positive number or blank for auto-increment.");
            document.getElementById("add-id").focus();
            return;
        }

        if (productId !== "" && existingIds.includes(parseInt(productId))) {
            alert(`The ID ${productId} already exists.`);
            document.getElementById("add-id").focus();
            return;
        }

        body = {
            "id": values[0],
            "name": values[1],
            "price": values[2],
            "category": values[3],
            "gender": values[4],
            "brand": values[5],
            "desc": values[6],
            "image": values[7],
            "sizes": {}
        }
        
        nextIndex = 8;
    }

    // size-id starts from 1 and not 0; hence deducing the initial index with (nextIndex - 1) instead of (nextIndex)
    for (let i = nextIndex; i < values.length; i++) {
        body.sizes[i - (nextIndex - 1)] = values[i];
    }
   
    if (method === "PUT" || method === "DELETE") {
        action += `/${productId}`
    }

    try {
        const response = await fetch(action, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (data.error === false) {
            window.location.href = redirectUrl;
        } else if (!data.hasOwnProperty("error")) {
            window.location.href = redirectUrl;
        }
    } catch (error) { throw error; }
}

async function deleteProduct(productId) {
    if (!localStorage.getItem("access_token")) {
        alert("You are not authenticated.");
        window.location.href = loginUrl;
    }

    try {
        const response = await fetch(`${productsUrl}/${productId}`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("access_token")
            }
        });
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
            window.location.href = loginurl;
        } else if (response.status == 401) {
            alert("You are not authenticated.");
            window.location.href = loginurl;
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
    getProducts();

    getCategories(document.getElementById("add-category"));
    getCategories(document.getElementById("edit-category"));

    getBrands(document.getElementById("add-brand"));
    getBrands(document.getElementById("edit-brand"));

    getSizes(document.getElementById("add-size"));
    getSizes(document.getElementById("edit-size")); 

    const addForm = document.getElementById("add-form");
    addForm.addEventListener("submit", (event) => handleFormMethods(event));

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", (event) => handleFormMethods(event));
});
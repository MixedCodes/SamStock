import { serverUrl, databaseUrl } from "./env.js";
import { getBrands, getCategories } from "./utils.js";

const selectedSizes = [];
const sizeInput = document.getElementById("size");
// Object mapping category IDs to category names
const categories = {
    "1": "Sneakers",
    "2": "Sports",
    "3": "Dressed",
    "4": "Sandals",
    "" : "All"
};
// Object mapping brand IDs to brand names
const brands = {
    "1": "Nike",
    "2": "Adidas",
    "3": "Birkenstock",
    "4": "Palm Angels",
    "5": "Burberry",
    "6": "Crocs",
    "7": "Chanel",
    "8": "Alexander McQueen",
    "9": "Gucci",
    "10": 'Hermes',
    "11": "Bottega Veneta",
    "12": "Balenciaga",
    "13": 'Dr. Martens',
    "" : "All",
};
// Function to handle size selection
function selectSize(sizeButton) {
    const size = parseInt(sizeButton.value);

    if (!sizeButton.classList.contains("selected")) {
        if (selectedSizes.indexOf(size) === -1) { selectedSizes.push(size); }
        sizeButton.classList.add("selected");
    } else {
        const index = selectedSizes.indexOf(size);
        if (index > -1) { selectedSizes.splice(index, 1); }
        sizeButton.classList.remove("selected");
    }
    sizeInput.value = selectedSizes.join(',');
}
// Function to fetch sizes and create size selection buttons
async function getSizes(sizeContainer) {
    try {
        const response = await fetch(databaseUrl + "/sizes");
        let sizes = await response.json();
        if (sizes.hasOwnProperty("data")) { sizes = sizes.data; }

        for (let i = 0; i < sizes.length; i++) {    
            const sizeButton = document.createElement("button");
            sizeButton.value = sizes[i].size_id;
            sizeButton.innerHTML = sizes[i].size_name;
            sizeButton.setAttribute("type", "button");
            sizeButton.addEventListener("click", () => selectSize(sizeButton));
            sizeContainer.append(sizeButton);
        }
    } catch (error) { throw error; }
}
// Function to handle search form submission
async function searchProducts(event) {
    event.preventDefault();
    const form = event.target;
    const action = form.getAttribute("action");
    const formData = new FormData(form);

    // Construct searchUrl here
    const searchUrl = new URL(action);
    searchUrl.search = new URLSearchParams(formData).toString();
    console.log(searchUrl);

    try {
        const response = await fetch(searchUrl);
        let products = await response.json();
        if (products.hasOwnProperty("data")) { products = products.data; }

        // Sort products based on selected sorting option
        sortingProducts(products);

        const resultCountElement = document.getElementById("result-count");
        resultCountElement.textContent = `${products.length} results`; // Update result count

        const searchQuery = document.getElementById("selector");
        searchQuery.innerHTML = ""; // Clear previous search query

        const query = searchUrl.search.split("?").pop().split("&");

        // Rendering search query
        for (let i = 0; i < query.length; i++) {
            let currentQuery = query[i].split("=").pop();

            if (i === 1) {
                const brandName = brands[currentQuery];
                currentQuery = brandName;
            }

            if (i == 2) {
                const categoryName = categories[currentQuery];
                currentQuery = categoryName;
            }

            if (i == 3) {
                if (currentQuery == "M") {
                    currentQuery = "Men";
                } else if (currentQuery == "W") {
                    currentQuery = "Women";
                } else if (currentQuery == "U") {
                    currentQuery = "Unisex";
                } else if (currentQuery == "") {
                    currentQuery = "All";
                }     
            }
            
            if (i === 4) {
                continue; // Skip appending size-related information
            }
                      
            else if (isValidQuery(currentQuery)) {
                    searchQuery.innerText += `${cleanQuery(currentQuery)}`;
                    if (i !== query.length - 1) {
                        searchQuery.innerText += " > ";
                    }
                }
                continue; // Skip appending size-related logic below
        }

        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = ""; // Clear previous search results
        
        // Rendering search results
        for (let i = 0; i < products.length; i++) {
            const card = document.createElement("div");
            card.style.cursor = "pointer";
            card.addEventListener("click", () => window.location.href = `${serverUrl}/products/${products[i].prod_id}`);

            card.classList.add("card");
            card.innerHTML = `
                <div class='img-container'>
                    <img src="${products[i].prod_image}" style="width: 200px; height: auto;">
                </div>
                <p>${products[i].prod_name}</p>
                <p class="price">฿ ${products[i].prod_price}</p>
            `;
            cardContainer.appendChild(card);
        }
        renderProducts(products); // Render sorted products in card container
    } catch (error) {
        console.error("Error searching products:", error);
    }
}

// Helper function to check if the query is valid (not empty or only spaces)
function isValidQuery(query) {
    return query.trim() !== "";
}

// Helper function to clean up the query value (remove unwanted characters)
function cleanQuery(query) {
    return query.replace(/[+]/g, " ").trim(); // Replace '+' with space and trim
}
// sortingProducts function sorts the array of products based on the selected sorting option.
function sortingProducts(products) {
    const sortOption = document.getElementById("dropdown").value;
    switch (sortOption) {
        case "Newest":
            products.sort((a, b) => b.prod_id - a.prod_id);
            break;
        case "Ascending price":
            products.sort((a, b) => a.prod_price - b.prod_price);
            break;
        case "Descending price":
            products.sort((a, b) => b.prod_price - a.prod_price);
            break;
        default:
            break;
    }
}
// renderProducts function renders the sorted products in the card container.
function renderProducts(products) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; // Clear previous cards

    // Rendering sorted products
    for (let i = 0; i < products.length; i++) {
        const card = document.createElement("div");
        card.style.cursor = "pointer";
        card.addEventListener("click", () => window.location.href = `${serverUrl}/products/${products[i].prod_id}`);

        card.classList.add("card");
        card.innerHTML = `
            <div class='img-container'>
                <img src="${products[i].prod_image}" style="width: 200px; height: auto;">
            </div>
            <p>${products[i].prod_name}</p>
            <p class="price">฿ ${products[i].prod_price}</p>
        `;
        cardContainer.appendChild(card);
    }
}
// The event listener for DOMContentLoaded ensures that the document is fully loaded before executing the code.
document.addEventListener("DOMContentLoaded", () => {
    const categoryContainer = document.getElementById("category");
    getCategories(categoryContainer);
    const brandContainer = document.getElementById("brand");
    getBrands(brandContainer);

    const sizeContainer = document.getElementById("size-container");
    getSizes(sizeContainer);

    document.getElementById("search-form").addEventListener("submit", (event) => searchProducts(event));
});
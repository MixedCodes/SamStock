import { databaseUrl, productsUrl } from "./env.js";
const productId = window.location.href.split('/').pop();

// Retrieves product details and updates the product page
async function getProduct() {
    try {
        const response = await fetch(`${productsUrl}/${productId}`);
        let product = await response.json();    
        if (product.hasOwnProperty("data")) { product = product.data; }

        const image = document.getElementById("product-image");
        image.src = product[0].prod_image;
        image.width = 400;
        image.heigth = 440;

        const name = document.getElementById("name");
        name.innerText = product[0].prod_name;;

        const price = document.getElementById("price");
        price.innerText = `THB ${product[0].prod_price}`;

        const description = document.getElementById("desc");
        description.innerText = product[0].prod_desc;
    } catch (error) { throw error; }
}

// Retrieves available sizes for the product and populates the size dropdown
async function getSizes() {
    try {
        const response = await fetch(`${databaseUrl}/product-items/${productId}`);
        let sizes = await response.json();
        if (sizes.hasOwnProperty("data")) { sizes = sizes.data; }

        const sizeContainer = document.getElementById("size");

        for (let i = 0; i < sizes.length; i++) {             
            const option = document.createElement("option");
            option.value = sizes[i].size_id;
            option.innerHTML = sizes[i].size_name;
            sizeContainer.append(option);
        }
    } catch (error) { throw error; }
}

// When the DOM content is loaded, fetches product details and available sizes
document.addEventListener("DOMContentLoaded", () => {
    getProduct();
    getSizes();
});
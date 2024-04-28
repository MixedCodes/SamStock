// Used for recurring functions for example getProducts getBrands, etc.

import { serverUrl, databaseUrl } from "./env.js";

export async function getProducts(url, cardContainer, limit = 0) {
    try {
        const response = await fetch(url);
        let products = await response.json();
        if (products.hasOwnProperty("data")) { products = products.data; }

        if (products.length < limit || limit < 1) { limit = products.length; }

        for (let i = 0; i < limit; i++) {
            const card = document.createElement("div");
            card.style.cursor = "pointer";
            card.addEventListener("click", () => window.location.href = `${serverUrl}/products/${products[i].prod_id}`);
            card.classList.add("card");
            card.innerHTML = `
                <div class="img-container">
                    <img src="${products[i].prod_image}" style="width: 200px; height: auto;">
                </div>
                <p>${products[i].prod_name}</p>
                <p class="price">฿ ${products[i].prod_price}</p>
            `;
            cardContainer.appendChild(card);
        }
    } catch (error) { throw error; }
}

export async function getBrands(brandContainer) {
	try {
		const response = await fetch(databaseUrl + "/brands");
		let brands = await response.json();
		if (brands.hasOwnProperty("data")) { brands = brands.data; }

		for (let i = 0; i < brands.length; i++) {	
			const option = document.createElement("option");
			option.value = brands[i].brand_id; 
			option.innerHTML = brands[i].brand_name;
			brandContainer.append(option);
		}
	} catch (error) { throw error; }
}

export async function getCategories(categoryContainer) {
	try {
		const response = await fetch(databaseUrl + "/categories");
		let categories = await response.json();
        if (categories.hasOwnProperty("data")) { categories = categories.data; }

		for (let i = 0; i < categories.length; i++) {	
			const option = document.createElement("option");
			option.value = categories[i].category_id; 
			option.innerHTML = categories[i].category_name;
			categoryContainer.append(option);
		}
	} catch (error) { throw error; }
}

export function openModal(modal) { modal.classList.add("open"); }
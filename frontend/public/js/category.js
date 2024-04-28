import { databaseUrl, productsUrl } from "./env.js";
import { getProducts } from "./utils.js";

// Extracts the category name from the URL and maps it to its corresponding ID
const categoryName = window.location.href.split("/").pop();
const categories = {
    "sneakers": 1,
    "sports": 2,
    "dressed": 3,
    "sandals": 4
};
const categoryId = categories[categoryName];
const sort = "random"

// Array to store banner images and tracks the current page for banner rotation
const banners = [];
let currentPage = 1;
// Changes the banner image and updates the active dot indicator
function changeBanner(bannerDiv, page) {
    if (page > banners.length) {
        console.log("Invalid Page");
    }

    document.querySelector(".active").classList.remove("active");
    document.querySelector(`.dot${page}`).classList.add("active");

    currentPage = page;
    bannerDiv.style.backgroundImage = `url(${banners[page - 1]})`;
}

// Retrieves banner images for the specified category and sets up banner rotation
async function getBanners(bannerUrl, bannerDiv, dotWrapper) {
    try {
        const response = await fetch(bannerUrl);
        let images = await response.json();
        if (images.hasOwnProperty("data")) { images = images.data; }

        for (let i = 0; i < images.length; i++) {
            banners.push(images[i].category_image);

            const dot = document.createElement("button");
            dot.classList.add("dot", `dot${i + 1}`);
            if (i === 0) {
                dot.classList.add("active");
            }
            dot.addEventListener("click", () => changeBanner(bannerDiv, i + 1));
            dotWrapper.appendChild(dot);    
        }

        if (images.length > 0) {
            bannerDiv.style.backgroundImage = `url(${banners[0]})`;
            currentPage = 1;
        }

        document.getElementById("left").addEventListener("click", () => {
            let page = currentPage - 1;
            if (page < 1) { page = banners.length - page; }
            changeBanner(bannerDiv, page);
        });
        document.getElementById("right").addEventListener("click", () => {
            let page = currentPage + 1;
            if (page > banners.length) { page = page % banners.length; }
            changeBanner(bannerDiv, page);
        });
    } catch (error) { throw error; }
}

// When the DOM content is loaded, initializes the category title, fetches products, and sets up banner rotation
document.addEventListener("DOMContentLoaded", () => {
    const categoryTitle = document.getElementById("category-title");
    categoryTitle.innerText = categoryName.charAt(0).toUpperCase() + categoryName.substring(1, categoryName.length)
    
    const cardContainer = document.getElementById("card-container");
    const url = `${productsUrl}?category=${categoryId}&sort=random`;
    getProducts(url, cardContainer);

    const banners = [];
    const bannerUrl = `${databaseUrl}/category-images/${categoryId}`;
    const bannerDiv = document.getElementById("banner");
    const dotWrapper = document.getElementById("dots-list"); 
    getBanners(bannerUrl, bannerDiv, dotWrapper);
});
category.js
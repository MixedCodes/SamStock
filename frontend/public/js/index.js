import { productsUrl } from "./env.js";
import { getProducts } from "./utils.js";
const url = productsUrl + "?&sort=random";

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    document.getElementById("banner").style.backgroundImage = "url(https://images-ext-1.discordapp.net/external/aayZf6-IKjIpV9YagCMIIv0HeeNfmyPVSl5rA0SOjdg/%3Fformat%3Djpg%26crop%3D4666%2C4663%2Cx154%2Cy651%2Csafe%26height%3D416%26width%3D416%26fit%3Dbounds/https/imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=webp&width=832&height=832)";
    getProducts(url, cardContainer, 12);
});
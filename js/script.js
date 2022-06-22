import { data } from "../data.js";
const carts = document.querySelector(".carts");

const startHandler = (item) => {
    return Array(item.stars).fill().map((_, i) => {
        return `<span class="stars">⭐</span>`
    })
}

const showData = () => {
    const renderData = data.map((item) => {
        return `
        <div class="cart">
        <img src="${item.imageURL}" alt="${item.name}">
        <div class="details">
            <h1>${item.name}</h1>
            <p class="price">$${item.price}</p>
            ${(startHandler(item)).join("")}
        </div>
        <div class="icons">
            <button class="basket"><i class="fa-solid fa-cart-shopping"></i></button>
            <button class="watch"><i class="fa-solid fa-eye"></i></button>
        </div>
        </div>
        `
    });
    carts.innerHTML = (renderData).join("");
}



// when browser is loaded 
window.addEventListener("DOMContentLoaded", () => {
    showData();
})
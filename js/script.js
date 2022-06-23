import { data } from "../data.js";
const carts = document.querySelector(".carts");
const shops = document.querySelector(".shops");
const shopDetails = document.querySelector(".shop-details");
const layer = document.querySelector(".layer");

// cart array 
let cart = getStorage();
cart.forEach(() => addToCart());

// star symbols 
const starHandler = (item) => {
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
            ${(starHandler(item)).join("")}
        </div>
        <div class="icons">
            <button class="basket" data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i></button>
            <button class="watch" data-id="${item.id}"><i class="fa-solid fa-eye"></i></button>
        </div>
        </div>
        `
    });
    carts.innerHTML = (renderData).join("");
}

// show single details

function showDetails(){
    const watchBtn = [...document.querySelectorAll(".watch")];
    watchBtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const getId = btn.dataset.id;
            const matchId = data.find((item) => item.id === +getId);
            details(matchId);
            layer.classList.add("active");
            shopDetails.classList.add("active");
        })
    });
}

function details(item){
    let singleItem = [];
    for (const index of item.description) {
        singleItem += `
            <ul class="description">
                <li>${index}</li>
            </ul>
        `
    }
    const detail = `
    <button class="close"><i class="fa-solid fa-square-xmark"></i></button>
    <div class="contents">
        <img src="${item.imageURL}" alt="${item.name}">
        <h1>${item.name}</h1>
        <h2 class="price">$${item.price}</h2>
        <h1>Description:</h1>
        ${singleItem}
        ${starHandler(item).join(" ")}
    </div>
    `
    shopDetails.innerHTML = detail;
}

// close detail page 
shopDetails.addEventListener("click", (e) => {
    if(e.target.classList.contains("fa-square-xmark")){
        layer.classList.remove("active")
        shopDetails.classList.remove("active")
    }
})

// push carts to array. 
function addItem(){
    const allBtn = [...document.querySelectorAll(".basket")]
    allBtn.forEach((btn) => {
        const getId = btn.dataset.id;
        let getCart = data.find((item) => item.id === +getId);
        let matchCartId = cart.find((item) => item.id === +getId);
        if(matchCartId){
            btn.disabled = true;
            btn.style.color = "rgba(255, 255, 255, 0.400)";
        }
        if(cart.length < 1){
            shops.innerHTML = `<h1 class="text">Your shopping cart is Empty!!!</h1>`
        }
        btn.addEventListener("click", ({target}) => {
            target.disabled = true;
            target.style.color = "rgba(255, 255, 255, 0.400)";
            cart.push(getCart);
            addToCart();
            setStorage(cart);
        })
    })
}

// add data to cart 
function addToCart(){
    shops.innerHTML = ""
    const addCart = cart.map((item) => {
        const {price, imageURL, name, disc, id} = item;
        return  `
        <div class="shop">
        <div class="shop-detail">
            <img src="${item.imageURL}" alt="${name}">
            <div class="shop-texts">
                <h1>${name}</h1>
            <p>${disc.substring(0,300)}...</p>
                <h3 class="shop-price">$${price}</h3>
                <div class="shop-btns">
                    <button class="increase"><i class="fa-solid fa-plus"></i></button>
                    <span>0</span>
                    <button class="decrease"><i class="fa-solid fa-minus"></i></button>
                </div>
                <button class="delete" data-id="${id}">Delete</button>
            </div>
        </div>
        </div>
        `
    });
    shops.innerHTML = (addCart).join(" ");
}

// delete handler 
shops.addEventListener("click", ({target}) => {
    if(target.classList.contains("delete")){
        target.parentElement.parentElement.parentElement.remove();
        removeStorage(target);
    }
});

function removeStorage(target){
    const deleteId = target.dataset.id;
    cart = cart.filter((item) => item.id !== +deleteId);
    setStorage(cart);
}

// localStorage 
function setStorage(item){
    const store = localStorage.setItem("shop", JSON.stringify(item));
    return store;
}

function getStorage(){
    const store = localStorage.getItem("shop");
    if(store === null) return []
    return JSON.parse(store);
}

// when browser is loaded 
window.addEventListener("DOMContentLoaded", () => {
    showData();
    addItem();
    showDetails()
})
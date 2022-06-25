import { data } from "../data.js";
const carts = document.querySelector(".carts");
const shops = document.querySelector(".shops");
const shopDetails = document.querySelector(".shop-details");
const layer = document.querySelector(".layer");
const subtotal = document.querySelector(".subtotal");

// cart array 
let cart = getStorage();
cart.forEach(() => addToCart())

// star symbols 
const starHandler = (item) => {
    return Array(item.stars).fill().map((_, i) => {
        return `<span class="stars">⭐</span>`
    })
}
const showData = () => {
    data.forEach((item) => {
        carts.innerHTML += `
        <div class="cart">
        <img src="${item.imageURL}" alt="${item.name}">
        <div class="details">
            <h1>${item.name}</h1>
            <p class="price">$${item.price}</p>
            ${(starHandler(item)).join("")}
        </div>
        <div class="icons">
            <button class="basket"
            data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i></button>
            <button class="watch" data-id="${item.id}"><i class="fa-solid fa-eye"></i></button>
        </div>
        </div>
        `
    });
}
showData();
addItem();

// push carts to array. 
function addItem(){
    const allBtn = [...document.querySelectorAll(".basket")]
    allBtn.forEach((btn) => {
        const getId = btn.dataset.id;
        let getCart = data.find((item) => item.id === +getId);
        let matchCartId = cart.find((item) => item.id === +getId);
        if(cart.length < 1){
            shops.innerHTML = `<h1 class="text">Your shopping cart is Empty!!!</h1>`
        }
        if(matchCartId){
            btn.disabled = true;
            btn.style.color = "rgba(255, 255, 255, 0.400)";
        }
        btn.addEventListener("click", ({target}) => {
            btn.disabled = true;
            btn.style.color = "rgba(255, 255, 255, 0.400)";
            // push to cart array 
            cart.push({
                ...getCart,
                qty : 1
            });
            // show cart dom 
            // get Total price 
            update();
        })
    })
}

function update(){
    addToCart();
    totalPrice();
    // save in local Storage 
    setStorage(cart);
}

// add data to cart 
function addToCart(){
    shops.innerHTML = ""
    cart.forEach((item) => {
        const {price, imageURL, name, disc, id, qty} = item;
        shops.innerHTML +=  `
        <div class="shop">
        <div class="shop-detail">
            <img src="${imageURL}" alt="${name}">
            <div class="shop-texts">
                <h1>${name}</h1>
            <p>${disc}...</p>
                <h3 class="shop-price">$${price}</h3>
                <div class="shop-btns">
                <button class="decrease"
                data-id="${id}"
                ><i class="fa-solid fa-minus"></i></button>
                <span>${qty}</span>
                <button class="increase"
                data-id="${id}"
                ><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="delete" data-id="${id}">Delete</button>
            </div>
        </div>
        </div>
        `
    });
}

// delete handler 
shops.addEventListener("click", ({target}) => {
    if(target.classList.contains("delete")){
        target.parentElement.parentElement.parentElement.remove();
        removeStorage(target);
        update();
    }
});

// remove from localStorage.
function removeStorage(target){
    const deleteId = target.dataset.id;
    cart = cart.filter((item) => item.id !== +deleteId);
    setStorage(cart);
    update();
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
        layer.classList.remove("active");
        shopDetails.classList.remove("active");
    }
});

// calculate the cheque 

function totalPrice() {  
    let totalPrice = 0,
    totalItem = 0;  
    const price = cart.filter((item) => item.price);
    const total = price.reduce((item, value) => item + value.price, 0).toFixed(2);

    cart.map((item) => {
        totalPrice += item.price * item.qty;
        totalItem += item.qty
    });
    subtotal.innerHTML = `
    <div class="total">
    <h5>Subtotal Item(${totalItem})</h5>
    <h5>$(${totalPrice})</h5>
    </div>
    <p>Taxes and shipping are calculated at checkout</p>
    <button class="payment-btn">Proceed The Payment</button>
    `
}
totalPrice();
qty();

// increase and decrease the number qty 
function qty(){
    shops.addEventListener("click", ({target}) => {
        cart = cart.map((item) => {
            let qty = item.qty;
            console.log(item.qty)

            const getId = target.dataset.id;
            if(item.id === +getId){
            if(target.classList.contains("decrease")){
                qty--
            }
            else if(target.classList.contains("increase")){
                qty++
            }
            }
            return {
                ...item,
                qty,
            }
        });
        update();
    })
}

// localStorage 
function setStorage(item){
    const store = localStorage.setItem("shop", JSON.stringify(item));
    return store;
}

function getStorage(){
    const store = localStorage.getItem("shop");
    if(store === null) return [];
    return JSON.parse(store);
    
}

showDetails();
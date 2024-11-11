const socketClient = io();

const form = document.getElementById("form");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const products = document.getElementById("products");

form.onsubmit = (e) => {
    e.preventDefault();
    const name = productName.value;
    const price = productPrice.value;
    socketClient.emit("newProduct", { name, price });
};

socketClient.on("arrayProducts", (array) => {
    let infoProducts = "";
    array.forEach((prod) => {
        infoProducts += `<li>${prod.name} - $${prod.price} <button onclick="deleteProduct('${prod.id}')">Eliminar</button></li>`;
    });
    products.innerHTML = infoProducts;
});

function deleteProduct(id) {
    socketClient.emit("deleteProduct", id);
}
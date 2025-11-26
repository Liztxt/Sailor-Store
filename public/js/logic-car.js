const carritoListaEl = document.getElementById("cart-tbody");
const carritoTotalEl = document.getElementById("total-price");
const carritoContadorEl = document.getElementById("carrito-contador");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCarritoVisual() {
    localStorage.setItem("carrito", JSON.stringify(carrito));

    let totalGeneral = 0;
    let totalItems = 0;

    carrito.forEach((producto) => {
        const totalProducto = producto.precio * producto.cantidad;
        totalGeneral += totalProducto;
        totalItems += producto.cantidad;
    });

    if (carritoListaEl) {
        carritoListaEl.innerHTML = "";

        carrito.forEach((producto) => {
            const newRow = document.createElement("tr");
            const totalProducto = producto.precio * producto.cantidad;

            newRow.innerHTML = `
                <td>${producto.nombre}</td>
                <td class="celda-cantidad">
                    <button class="btn-cantidad" onclick="disminuirCantidad(${producto.id})">-</button>
                    <span class="cantidad-numero">${producto.cantidad}</span>
                    <button class="btn-cantidad" onclick="aumentarCantidad(${producto.id})">+</button>
                </td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${totalProducto.toFixed(2)}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${producto.id})">X</button>
                </td>
            `;
            carritoListaEl.appendChild(newRow);
        });
    }

    if (carritoTotalEl) {
        carritoTotalEl.textContent = totalGeneral.toFixed(2);
    }
    if (carritoContadorEl) {
        carritoContadorEl.textContent = totalItems;
        carritoContadorEl.classList.toggle('hidden', totalItems === 0);
    }
}

/**
 * añadir un producto al carrito.
 * @param {object} producto
 */
function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        console.log("Cantidad aumentada:", producto.nombre);
    } else {
        carrito.push({ ...producto, cantidad: 1 });
        console.log("Producto añadido al carrito:", producto.nombre);
    }

    actualizarCarritoVisual();
    mostrarToast("¡Producto añadido al carrito!");
}

/**
 * eliminar un producto del carrito.
 * @param {number} idProducto
 */
function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter((producto) => producto.id !== idProducto);
    actualizarCarritoVisual();
}

/**
 * Aumenta la cantidad de un producto en el carrito.
 * @param {number} idProducto
 */
function aumentarCantidad(idProducto) {
    const producto = carrito.find((item) => item.id === idProducto);
    if (producto) {
        producto.cantidad++;
        console.log(`Cantidad aumentada para: ${producto.nombre}`);
        actualizarCarritoVisual();
    }
}

/**
 * Disminuye la cantidad del producto
 * @param {number} idProducto
 */
function disminuirCantidad(idProducto) {
    const producto = carrito.find((item) => item.id === idProducto);
    if (producto) {
        producto.cantidad--;
        console.log(`Cantidad disminuida para: ${producto.nombre}`);
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            actualizarCarritoVisual();
        }
    }
}


function vaciarCarrito() {
    carrito = [];
    actualizarCarritoVisual();
}


const WISHLIST_KEY = 'sailorWishlist';
/**
 * @param {number} productId
 */
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        mostrarToast("Producto eliminado de Deseados.");
    } else {
        wishlist.push(productId);
        mostrarToast("Producto añadido a Deseados.");
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

/**
 * @param {number} productId
 * @returns {boolean} 
 */
function checkWishlistStatus(productId) {
    const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    return wishlist.includes(productId);
}

/**tarjeta visual de un producto 
 * @param {object} producto 
 * @param {HTMLElement} contenedor 
 */
function renderizarProducto(producto, contenedor) {
    const productoDiv = document.createElement("div");
    productoDiv.classList.add("producto-card");
    const productId = producto.id;

    productoDiv.innerHTML = `
        <div class="producto-link" data-id="${productId}">
            <div class="producto-imagen-container">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                
                <button class="btn-favorito" data-product-id="${productId}">
                    <img src="./img/favorite.png" alt="Añadir a Deseados" class="favorito-icono" id="favorito-icono-${productId}">
                </button>
                
            </div>
            <div class="producto-info">
                <h2 class="producto-nombre">${producto.nombre}</h2>
                <p class="producto-precio">$${producto.precio.toFixed(2)} MXN</p>
            </div>
        </div>
        <button class="btn-agregar">Añadir al carrito</button>
    `;

    const botonFavorito = productoDiv.querySelector(".btn-favorito");
    
    botonFavorito.addEventListener("click", (e) => {
        e.stopPropagation(); 
        toggleWishlist(productId); 
        e.currentTarget.classList.toggle('favorito-activo');
    });
    
    if (checkWishlistStatus(productId)) {
         botonFavorito.classList.add('favorito-activo');
    }

    const botonAgregar = productoDiv.querySelector(".btn-agregar");
    botonAgregar.addEventListener("click", (e) => {
        e.stopPropagation(); 
        agregarAlCarrito(producto); 
    });

    const productoLink = productoDiv.querySelector(".producto-link");
    productoLink.addEventListener("click", () => {
        window.location.href = `./product.html?id=${productId}`;
    });
    
    contenedor.appendChild(productoDiv);
}

/** Notificacion toast
 * @param {string} mensaje
 */
function mostrarToast(mensaje) {
    const toastEl = document.getElementById("toast-notificacion");

    if (!toastEl) return;

    toastEl.textContent = mensaje;
    toastEl.classList.add("show");

    setTimeout(() => {
        toastEl.classList.remove("show");
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            sessionStorage.removeItem("isLoggedIn");
            window.location.href = "login.html";
        });
    }
    actualizarCarritoVisual(); 
});
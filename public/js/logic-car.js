// --- LÓGICA DEL CARRITO ---

const carritoListaEl = document.getElementById("cart-tbody");
const carritoTotalEl = document.getElementById("total-price");
const carritoContadorEl = document.getElementById("carrito-contador");

// Cargamos el carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/**
 * Función para actualizar el carrito visualmente
 */
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
              <button class="btn-cantidad" onclick="disminuirCantidad(${
                producto.id
              })">-</button>
              <span class="cantidad-numero">${producto.cantidad}</span>
              <button class="btn-cantidad" onclick="aumentarCantidad(${
                producto.id
              })">+</button>
          </td>
          <td>$${producto.precio.toFixed(2)}</td>
          <td>$${totalProducto.toFixed(2)}</td>
          <td>
              <button class="btn-eliminar" onclick="eliminarDelCarrito(${
                producto.id
              })">X</button>
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
  }
}

/**
 * Función para añadir un producto al carrito.
 * @param {object} producto
 */
function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find((item) => item.id === producto.id);

  if (productoEnCarrito) {
    // Si ya está en el carrito, aumentar cantidad
    productoEnCarrito.cantidad++;
    console.log("Cantidad aumentada:", producto.nombre);
  } else {
    // Si no está, agregarlo con cantidad
    carrito.push({ ...producto, cantidad: 1 });
    console.log("Producto añadido al carrito:", producto.nombre);
  }

  actualizarCarritoVisual();
  mostrarToast("¡Producto añadido al carrito!");
}

/**
 * Función para eliminar un producto del carrito.
 * @param {number} idProducto
 */
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter((producto) => producto.id !== idProducto);

  // Actualizamos todo
  actualizarCarritoVisual();
}
/**
 * Aumenta la cantidad de un producto en el carrito.
 * @param {number} idProducto
 */
function aumentarCantidad(idProducto) {
  // Encontramos el producto en el carrito
  const producto = carrito.find((item) => item.id === idProducto);

  if (producto) {
    producto.cantidad++;
    console.log(`Cantidad aumentada para: ${producto.nombre}`);

    actualizarCarritoVisual();
  }
}
/**
 * Disminuye la cantidad del producto, si la cantidad llega a 0, elimina el producto.
 * @param {number} idProducto
 */
function disminuirCantidad(idProducto) {
  // Encontramos el producto en el carrito
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
/**
 * Vacía el carrito por completo.
 */
function vaciarCarrito() {
  carrito = [];
  actualizarCarritoVisual();
}

function renderizarProducto(producto, contenedor) {
  const productoDiv = document.createElement("div");
  productoDiv.classList.add("producto-card");

  productoDiv.innerHTML = `
  <div class="producto-link" data-id="${producto.id}">
    <div class="producto-imagen-container">
      <img src="${producto.imagen}" alt="${
    producto.nombre
  }" class="producto-imagen">
    </div>
    <div class="producto-info">
      <h2 class="producto-nombre">${producto.nombre}</h2>
      <p class="producto-precio">$${producto.precio.toFixed(2)} MXN</p>
    </div>
  </div>
  <button class="btn-agregar">Añadir al carrito</button>
`;

  const productoLink = productoDiv.querySelector(".producto-link");
  productoLink.addEventListener("click", () => {
    window.location.href = `./product.html?id=${producto.id}`;
  });

  const botonAgregar = productoDiv.querySelector(".btn-agregar");
  botonAgregar.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que se active el click de la card
    agregarAlCarrito(producto);
  });

  contenedor.appendChild(productoDiv);
}

/**
 * Muestra una notificación "toast" temporal.
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

// --- LÓGICA DE LOGOUT ---

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("isLoggedIn");

      alert("Has cerrado sesión.");

      window.location.href = "login.html";
    });
  }
});

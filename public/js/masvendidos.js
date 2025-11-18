// -- Logica de Navbar desplegable --

document.addEventListener("DOMContentLoaded", function () {
  const dropdownButtons = document.querySelectorAll(".dropdown-button");

  dropdownButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      // Encuentra el contenido del menú desplegable
      const dropdownContent = this.nextElementSibling;

      // Añade o quita la clase 'show' para mostrar u ocultar el menú
      dropdownContent.classList.toggle("show");
    });
  });

  // Cierra el menú si el usuario hace clic en cualquier otro lugar de la pantalla
  window.addEventListener("click", function (event) {
    const dropdowns = document.querySelectorAll(".dropdown-content");

    dropdowns.forEach((dropdown) => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      }
    });
  });
});
// --- LÓGICA PARA CARGAR PRODUCTOS (SOLO MAS VENDIDOS) ---

document.addEventListener("DOMContentLoaded", () => {
  const contMasVendidos = document.getElementById("products-bestsellers");
  // Definiendo productos por Id
  const idsMasVendidos = [
    104, 102, 103, 106, 105, 108, 100, 109, 110, 128, 129, 125, 111, 112, 116,
    118, 120, 121, 123, 124, 126,
  ];

  // Carga los productos
  fetch("/data/productos.json")
    .then((response) => response.json())
    .then((data) => {
      const productosMap = new Map(data.map((p) => [p.id, p]));

      idsMasVendidos.forEach((id) => {
        const producto = productosMap.get(id);
        if (producto) renderizarProducto(producto, contMasVendidos);
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

  actualizarCarritoVisual();
});

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

//-- LÓGICA PARA CARGAR PRODUCTOS --

document.addEventListener("DOMContentLoaded", () => {
  const contP1 = document.getElementById("productos-p1");
  const contP2 = document.getElementById("productos-p2");
  //Definiendo productos por Id
  const idsParaP1 = [100, 107, 114, 118, 119, 127];
  const idsParaP2 = [101, 113, 115, 117, 123, 122];

  // Carga los productos
  fetch("/data/productos.json")
    .then((response) => response.json())
    .then((data) => {
      const productosMap = new Map(data.map((p) => [p.id, p]));

      idsParaP1.forEach((id) => {
        const producto = productosMap.get(id);
        if (producto) renderizarProducto(producto, contP1);
      });
      idsParaP2.forEach((id) => {
        const producto = productosMap.get(id);
        if (producto) renderizarProducto(producto, contP2);
      });
    })
    .catch((error) => console.error("Error al cargar los productos:", error));

  actualizarCarritoVisual();
});

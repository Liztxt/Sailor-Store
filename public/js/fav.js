document.addEventListener('DOMContentLoaded', () => {

    setTimeout(renderizarProductosFavoritos, 100); 
});

const WISHLIST_KEY = 'sailorWishlist';
function renderizarProductosFavoritos() {
    const gridContainer = document.getElementById('favoritos-grid');
    const emptyMessage = document.getElementById('empty-message');
    gridContainer.innerHTML = '';
    
    if (typeof productos === 'undefined' || typeof renderizarProducto !== 'function' || typeof toggleWishlist !== 'function') {
         gridContainer.innerHTML = '<p style="color:red;">Error: Dependencias no cargadas. Asegúrate de que logica-central.js y data.js se carguen primero.</p>';
         return;
    }
    
    const wishlistIds = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    
    const productosDeseados = productos.filter(p => wishlistIds.includes(p.id));

    if (productosDeseados.length === 0) {
        emptyMessage.classList.remove('hidden');
        return;
    } else {
        emptyMessage.classList.add('hidden');
    }

    productosDeseados.forEach(producto => {
        renderizarProducto(producto, gridContainer); 

        const card = gridContainer.querySelector(`.producto-card:last-child`);
        
        if (card) {
             const btnAgregar = card.querySelector('.btn-agregar');
             if(btnAgregar) btnAgregar.remove();
             
             const btnFavorito = card.querySelector('.btn-favorito');
             
             const btnEliminarTexto = document.createElement('button');
             btnEliminarTexto.classList.add('btn-eliminar-fav');
             btnEliminarTexto.textContent = 'Eliminar de la Lista';
             card.appendChild(btnEliminarTexto);
             
             btnEliminarTexto.addEventListener('click', () => {
                 toggleWishlist(producto.id);
                 renderizarProductosFavoritos(); 
             });
             
             if (btnFavorito) {
                 btnFavorito.addEventListener('click', () => {
                     setTimeout(renderizarProductosFavoritos, 50); 
                 });
             }
        }
    });
}
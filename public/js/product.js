// Obtener el ID del producto desde la URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('id'));
}

// Cargar los productos desde el JSON
async function loadProducts() {
  try {
    const response = await fetch('./data/productos.json');
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
}

// Buscar un producto por ID
function findProductById(products, id) {
  return products.find(product => product.id === id);
}

// Obtener productos recomendados del mismo tipo
function getRecommendedProducts(products, currentProduct, limit = 3) {
  return products
    .filter(p => p.tipo === currentProduct.tipo && p.id !== currentProduct.id)
    .slice(0, limit);
}

// Mostrar la información del producto
function displayProductDetails(product) {
  document.getElementById('breadcrumb-nombre-producto').textContent = product.nombre;
  
  const mainImage = document.getElementById('product-image');
  mainImage.src = product.imagen;
  mainImage.alt = product.nombre;
  
  document.getElementById('thumb-1').src = product.imagen;
  document.getElementById('thumb-2').src = product.imagen;
  document.getElementById('thumb-3').src = product.imagen;
  
  document.getElementById('product-title').textContent = product.nombre;
  document.getElementById('product-category-name').textContent = product.tipo;
  document.getElementById('product-price').textContent = `$${product.precio.toFixed(2)}`;
  document.getElementById('product-description-short').innerHTML = `<p>${product.descripcion}</p>`;
  document.getElementById('product-description-full').textContent = product.descripcion;

  window.currentProductIngredients = product.ingredientes;
}

// Configurar thumbnails para cambiar imagen principal
function setupThumbnails() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('product-image');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImage.src = thumb.src;
    });
  });
}

// Configurar pestañas de información adicional
function setupInfoTabs() {
  const tabDesc = document.getElementById('tab-desc');
  const tabIngr = document.getElementById('tab-ingr');
  const tabEnvio = document.getElementById('tab-envio');
  const tabContent = document.getElementById('tab-content');
  
  const envioInfo = `
    <h3>Información de Envío</h3>
    <p>• Envío gratis en compras superiores a $500</p>
    <p>• Tiempo de entrega: 3-5 días hábiles</p>
    <p>• Devoluciones gratuitas dentro de 30 días</p>
  `;
  
  tabDesc.addEventListener('click', () => {
    setActiveTab(tabDesc);
    tabContent.innerHTML = `<p>${document.getElementById('product-description-short').textContent}</p>`;
  });
  
  tabIngr.addEventListener('click', () => {
    setActiveTab(tabIngr);
    tabContent.innerHTML = `<p><strong>Ingredientes:</strong> ${window.currentProductIngredients}</p>`;
  });
  
  tabEnvio.addEventListener('click', () => {
    setActiveTab(tabEnvio);
    tabContent.innerHTML = envioInfo;
  });
}

function setActiveTab(activeTab) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  activeTab.classList.add('active');
}

// Selector de cantidad
function setupQuantitySelector() {
  const qtyInput = document.getElementById('qty-input');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  
  qtyMinus.addEventListener('click', () => {
    let value = parseInt(qtyInput.value);
    if (value > 1) {
      qtyInput.value = value - 1;
    }
  });
  
  qtyPlus.addEventListener('click', () => {
    let value = parseInt(qtyInput.value);
    qtyInput.value = value + 1;
  });
}

// Mostrar productos relacionados
function displayRecommendedProducts(products) {
  const container = document.getElementById('related-products-grid');
  container.innerHTML = '';
  
  products.forEach(product => {
    const productCard = `
      <div class="product-card" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; transition: transform 0.2s;" 
           onclick="window.location.href='product.html?id=${product.id}'">
        <img src="${product.imagen}" alt="${product.nombre}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
        <h3 style="font-size: 1rem; margin-bottom: 8px;">${product.nombre}</h3>
        <p style="color: #3498db; font-weight: bold; font-size: 1.1rem;">$${product.precio.toFixed(2)}</p>
        <span style="display: inline-block; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; color: #666;">${product.tipo}</span>
      </div>
    `;
    container.innerHTML += productCard;
  });
}

// Configurar botón de agregar al carrito
function setupAddToCartButton(product) {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const qtyInput = document.getElementById('qty-input');
  
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(qtyInput.value);
    
    for (let i = 0; i < quantity; i++) {
      agregarAlCarrito(product);
    }
  });
}

// Actualizar contador del carrito
function updateCartCounter() {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const counter = document.getElementById('carrito-contador');
  
  if (counter) {
    if (totalItems > 0) {
      counter.textContent = totalItems;
      counter.classList.remove('hidden');
    } else {
      counter.classList.add('hidden');
    }
  }
}

// Mostrar error si el producto no se encuentra
function showError(message) {
  const loadingState = document.getElementById('loading-state');
  loadingState.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <h2 style="color: #e74c3c; margin-bottom: 10px;">⚠️ ${message}</h2>
      <p style="color: #666;">El producto que buscas no está disponible.</p>
      <a href="index.html" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">Volver al Catálogo</a>
    </div>
  `;
}

async function initProductPage() {
  const productId = getProductIdFromURL();

  if (!productId) {
    showError('Producto no encontrado');
    return;
  }
  

  const allProducts = await loadProducts();

  const currentProduct = findProductById(allProducts, productId);
  
  if (!currentProduct) {
    showError('Producto no encontrado');
    return;
  }
  
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('product-content').classList.remove('hidden');
  
  displayProductDetails(currentProduct);
  

  setupThumbnails();
  setupInfoTabs();
  
  setupQuantitySelector();
  
  // Obtener y mostrar productos recomendados
  const recommended = getRecommendedProducts(allProducts, currentProduct);
  displayRecommendedProducts(recommended);
  
  setupAddToCartButton(currentProduct);
  updateCartCounter();
}
document.addEventListener('DOMContentLoaded', initProductPage);
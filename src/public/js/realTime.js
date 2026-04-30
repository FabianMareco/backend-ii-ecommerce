const socket = io();

socket.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  if (!productList) return;
  
  productList.innerHTML = '';
  products.forEach(prod => {
    const li = document.createElement('li');
    li.setAttribute('data-id', prod._id);
    li.innerHTML = `
      <strong>${prod.title}</strong> - $${prod.price} (stock: ${prod.stock})
      <button class="deleteBtn" data-id="${prod._id}">Eliminar</button>
    `;
    productList.appendChild(li);
  });
  
  attachDeleteEvents();
});

const productForm = document.getElementById('productForm');
if (productForm) {
  productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const thumbnailsRaw = document.getElementById('thumbnails')?.value || '';
    const thumbnails = thumbnailsRaw ? thumbnailsRaw.split(',').map(s => s.trim()) : [];
    
    const newProduct = {
      title: document.getElementById('title')?.value,
      description: document.getElementById('description')?.value,
      code: document.getElementById('code')?.value,
      category: document.getElementById('category')?.value || 'merchandising',
      subcategory: document.getElementById('subcategory')?.value,
      price: parseFloat(document.getElementById('price')?.value),
      stock: parseInt(document.getElementById('stock')?.value),
      thumbnails: thumbnails,
      status: true
    };
    
    socket.emit('newProduct', newProduct);
    e.target.reset();
  });
}

function attachDeleteEvents() {
  const deleteBtns = document.querySelectorAll('.deleteBtn');
  deleteBtns.forEach(btn => {
    btn.removeEventListener('click', handleDelete);
    btn.addEventListener('click', handleDelete);
  });
}

function handleDelete(e) {
  const productId = e.target.getAttribute('data-id');
  if (productId) {
    // ========== CONFIRMACIÓN ANTES DE ELIMINAR ==========
    const confirmDelete = confirm('⚠️ ¿Estás seguro de que deseas eliminar este producto?\n\nEsta acción no se puede deshacer.');
    if (confirmDelete) {
      socket.emit('deleteProduct', productId);
    }
  }
}

socket.on('errorMessage', (message) => {
  alert(`❌ Error: ${message}`);
});

attachDeleteEvents();
console.log('Cliente WebSocket listo');
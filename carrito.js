
function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto');

        productoElement.innerHTML = `
            <div class="col-md-3">    
                <div class="product-card">
                    <div class="product-card-img">
                        <label id="stock-${producto.id}" class="stock ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}">
                            ${producto.stock > 0 ? 'Stock: ' + producto.stock : 'Out of Stock'}
                        </label>
                        <img src=${producto.image} alt="Cereales">
                    </div>
                    <div class="product-card-body">
                        <p class="product-brand">${producto.brand}</p>
                        <h5 class="product-name">
                            <a href="">
                                ${producto.name}
                            </a>
                        </h5>
                        <div>
                            <span class="selling-price">Precio: $${producto.price}</span>
                        </div>
                        <div class="mt-2">
                            <button class="btn btn1">Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div> `;
        productoElement.querySelector('.btn.btn1').addEventListener('click', () => agregarAlCarrito(producto.id));

        container.appendChild(productoElement);
    });
}

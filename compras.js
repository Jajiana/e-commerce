const IVA = 0.21;
const STORAGE_KEY = 'carrito';
let carrito = [];
let productos = [];



function mostrarCarrito() {
    const carritoContainer = document.getElementById('carrito');
    carritoContainer.innerHTML = '';

    carrito.forEach(producto => {
        const item = document.createElement('div');
        item.innerHTML = `
            <div class="cart-item">
                <div class="row">
                    <div class="col-md-6 my-auto">
                        <a href="">
                            <label class="product-name">
                                <img src=${producto.image} style="width: 50px; height: 50px" alt="">
                                ${producto.name}
                            </label>
                        </a>
                    </div>
                    <div class="col-md-2 my-auto">
                        <label class="price">$${producto.price}</label>
                    </div>
                    <div class="col-md-2 col-7 my-auto">
                        <div class="quantity">
                            <div class="input-group">
                                <input type="text" value=${producto.quantity} class="input-quantity" readonly />
                            </div>
                        </div>
                    </div>
                </div>
            </div> `;
        
        carritoContainer.appendChild(item);
    });

    // Botón Finalizar Compra
    const finalizarCompraBtn = document.createElement('button');
    finalizarCompraBtn.innerText = 'Finalizar Compra';
    finalizarCompraBtn.classList.add('btn', 'btn-primary');
    finalizarCompraBtn.addEventListener('click', finalizarCompra);
    carritoContainer.appendChild(finalizarCompraBtn);

    // Botón Remover Carrito
    const removerCarritoBtn = document.createElement('button');
    removerCarritoBtn.innerText = 'Remover Carrito';
    removerCarritoBtn.classList.add('btn', 'btn-danger'); 
    removerCarritoBtn.addEventListener('click', removerCarrito);
    carritoContainer.appendChild(removerCarritoBtn);
}

function agregarAlCarrito(id, quantity = 1) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.stock >= quantity) {
        const cartItem = carrito.find(p => p.id === id);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            carrito.push({ ...producto, quantity });
        }
        producto.stock -= quantity;
        mostrarProductos(productos);
        mostrarCarrito();
        guardarCarrito();
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Producto no disponible"
        });
    }
}

function finalizarCompra() {
    let total = 0;
    let listaProductos = '';


    for (let i = 0; i < carrito.length; i++) {
        let producto = carrito[i];
        let subtotal = producto.price * producto.quantity;
        total += subtotal;


        listaProductos += `${producto.name} x ${producto.quantity} = $${subtotal.toFixed(2)}\n`;
    }


    Swal.fire({
        title: 'Confirmación de pago',
        text: `¿Desea realizar el pago?\n\n${listaProductos}. Total a pagar: $${total.toFixed(2)}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Realizar pago',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            realizarPago(total);
        } else {
            Swal.fire('Compra cancelada.', '', 'info');
        }
    });
}
function realizarPago(total) {
    let precioConIVA = total * (1 + IVA);
    Swal.fire({
        title: `El total pagado es de $${precioConIVA.toFixed(2)}. ¡Gracias por su compra!`,
        text: "You clicked the button!",
        icon: "success"
    }).then(() => {
        localStorage.removeItem(STORAGE_KEY);
        carrito = [];
        window.location.reload();
    });
}
function cargarCarrito() {
    let carritoGuardado = localStorage.getItem(STORAGE_KEY);
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        mostrarCarrito();
    }
}

function guardarCarrito() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

function removerCarrito() {
    carrito = [];
    mostrarCarrito();
    guardarCarrito();
    window.location.reload();
}

fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data.productos;
        mostrarProductos(productos);
        cargarCarrito();
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
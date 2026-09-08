// ==========================================
// 1. BASE DE DATOS INICIAL & SEED DATA
// ==========================================
const PRODUCTOS_INICIALES = [
    { id: 1, codigo: "PS5-001", nombre: "PlayStation 5 Sony Slim Digital", precio: 499999, stock: 10, critical: 5, categoria: "Consola", imagen: "play5.jpg" },
    { id: 2, codigo: "NSW-002", nombre: "Consola Nintendo Switch 2 NS2 LCD", precio: 669990, stock: 8, critical: 5, categoria: "Consola", imagen: "switch2.jpg" },
    { id: 3, codigo: "PS5-003", nombre: "PlayStation 5 Grand Theft Auto VI", precio: 94990, stock: 25, critical: 10, categoria: "Videojuego", imagen: "grandtheft.jpg" },
    { id: 4, codigo: "PS5-004", nombre: "PlayStation 5 1348 Ex Voto", precio: 69990, stock: 15, critical: 5, categoria: "Videojuego", imagen: "1348.jpg" },
    { id: 5, codigo: "NSW-005", nombre: "Nintendo Switch Grand Theft Auto VI", precio: 24990, stock: 4, critical: 5, categoria: "Videojuego", imagen: "grandtheft.jpg" },
    { id: 6, codigo: "NSW-006", nombre: "Nintendo Switch Assassin's Creed III Remastered", precio: 94990, stock: 12, critical: 5, categoria: "Videojuego", imagen: "ac3nswchico.jpg" },
    { id: 7, codigo: "NSW-007", nombre: "9 JUEGOS EN 1 PACK MEGA NINTENDO SWITCH", precio: 80000, stock: 30, critical: 10, categoria: "Videojuego", imagen: "Super-Pack-3-2.jpg" },
    { id: 8, codigo: "NSW-008", nombre: "Super Mario Bros U Deluxe Nintendo Switch", precio: 59000, stock: 18, critical: 5, categoria: "Videojuego", imagen: "mario.jpg" }
];

const USUARIOS_INICIALES = [
    { run: "19011022K", name: "Gonzalo Gamer", email: "gonzalo@duoc.cl", role: "Administrador", region: "Región Metropolitana de Santiago", comuna: "Santiago" },
    { run: "201234567", name: "Camila Player", email: "camila@gmail.com", role: "Cliente", region: "Región de la Araucanía", comuna: "Temuco" }
];

const REGIONES_DATA = [
    { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Puente Alto", "Maipú", "Las Condes", "La Florida", "Providencia"] },
    { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
    { region: "Región de la Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"] }
];

let descuentoAplicado = 0;

// ==========================================
// 2. GESTIÓN DE LOCALSTORAGE
// ==========================================
function inicializarStorage() {
    if (!localStorage.getItem("gamer_products")) {
        localStorage.setItem("gamer_products", JSON.stringify(PRODUCTOS_INICIALES));
    }
    if (!localStorage.getItem("gamer_users")) {
        localStorage.setItem("gamer_users", JSON.stringify(USUARIOS_INICIALES));
    }
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem("gamer_products")) || PRODUCTOS_INICIALES;
}

function guardarProductos(products) {
    localStorage.setItem("gamer_products", JSON.stringify(products));
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("gamer_cart")) || [];
}

function guardarCarrito(cart) {
    localStorage.setItem("gamer_cart", JSON.stringify(cart));
    actualizarContadorCarrito();
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("gamer_users")) || USUARIOS_INICIALES;
}

function guardarUsuarios(users) {
    localStorage.setItem("gamer_users", JSON.stringify(users));
}

// ==========================================
// 3. TIENDA PÚBLICA & DETALLE
// ==========================================
function renderizarCatalogoGamer() {
    const gridContainer = document.getElementById("productos-container") || document.getElementById("products-grid");
    if (!gridContainer) return;

    const productos = obtenerProductos();
    gridContainer.innerHTML = productos.map(p => `
        <div class="product-card">
            <a href="detalle.html?id=${p.id}">
                <div class="img-box">
                    <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='play5.jpg'">
                </div>
            </a>
            <h3 class="product-title">${p.nombre}</h3>
            <div class="product-footer">
                <span class="price">$${Number(p.precio).toLocaleString("es-CL")}</span>
                <span class="attributes">${p.categoria}</span>
            </div>
            <div style="display: flex; gap: 8px; margin-top: 12px;">
                <a href="detalle.html?id=${p.id}" class="btn btn-outline" style="flex: 1;">Ver Detalle</a>
                <button type="button" class="btn btn-primary" onclick="agregarAlCarritoGamer(${p.id})" style="flex: 1;">Agregar</button>
            </div>
        </div>
    `).join("");
}

function cargarDetalleProducto() {
    const pName = document.getElementById("p-name");
    if (!pName) return; 

    const params = new URLSearchParams(window.location.search);
    const idProd = Number(params.get("id")) || 1; 

    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === idProd);
    if (!prod) return;

    const pBread = document.getElementById("p-title-bread");
    const pImg = document.getElementById("p-main-img");
    const pPrice = document.getElementById("p-price");
    const btnAdd = document.getElementById("add-to-cart-btn");

    if (pBread) pBread.textContent = prod.nombre;
    if (pName) pName.textContent = prod.nombre;
    if (pImg) pImg.src = prod.imagen;
    if (pPrice) pPrice.textContent = `$${Number(prod.precio).toLocaleString("es-CL")}`;

    if (btnAdd) {
        btnAdd.onclick = () => {
            const qtyInput = document.getElementById("p-qty");
            const cantidad = Number(qtyInput ? qtyInput.value : 1);
            agregarAlCarritoConCantidad(prod.id, cantidad);
        };
    }
}

// ==========================================
// 4. FUNCIONES DEL CARRITO DE COMPRAS
// ==========================================
function actualizarContadorCarrito() {
    const cartCountEl = document.getElementById("cart-count");
    if (!cartCountEl) return;
    const cart = obtenerCarrito();
    const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    cartCountEl.textContent = totalItems;
}

window.agregarAlCarritoGamer = function(idProducto) {
    agregarAlCarritoConCantidad(idProducto, 1);
};

window.agregarAlCarritoConCantidad = function(idProducto, cantidad) {
    const idNum = Number(idProducto);
    if (cantidad <= 0) return;

    let cart = obtenerCarrito();
    const productos = obtenerProductos();
    const prod = productos.find(p => p.id === idNum);

    if (prod) {
        const itemIndex = cart.findIndex(item => item.id === idNum);
        if (itemIndex > -1) {
            cart[itemIndex].cantidad += cantidad;
        } else {
            cart.push({ ...prod, cantidad });
        }
        guardarCarrito(cart);
        alert(`¡${cantidad} unidad(es) de ${prod.nombre} añadida(s) al carrito!`);
    }
};

window.cambiarCantidad = function(idProducto, delta) {
    let cart = obtenerCarrito();
    const itemIndex = cart.findIndex(item => item.id === Number(idProducto));

    if (itemIndex > -1) {
        cart[itemIndex].cantidad += delta;
        if (cart[itemIndex].cantidad <= 0) {
            cart.splice(itemIndex, 1);
        }
        guardarCarrito(cart);
        renderizarCarritoGamer();
    }
};

window.eliminarDelCarrito = function(idProducto) {
    let cart = obtenerCarrito().filter(item => item.id !== Number(idProducto));
    guardarCarrito(cart);
    renderizarCarritoGamer();
};

window.aplicarCuponGamer = function() {
    const inputCupon = document.getElementById("coupon-input");
    if (!inputCupon) return;

    const cupon = inputCupon.value.trim().toUpperCase();
    if (cupon === "DUOCGAMER") {
        descuentoAplicado = 0.20;
        alert("¡Cupón del 20% de descuento aplicado con éxito!");
    } else {
        alert("Cupón no válido.");
        descuentoAplicado = 0;
    }
    renderizarCarritoGamer();
};

window.procesarCompraGamer = function() {
    let cart = obtenerCarrito();
    if (cart.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de comprar.");
        return;
    }
    alert("¡Gracias por tu compra en GamerZone! Tu pedido ha sido procesado con éxito.");
    localStorage.removeItem("gamer_cart");
    descuentoAplicado = 0;
    actualizarContadorCarrito();
    renderizarCarritoGamer();
};

function renderizarCarritoGamer() {
    const cartList = document.getElementById("cart-items-list");
    const cartTotal = document.getElementById("cart-total-price");
    if (!cartList) return;

    let cart = obtenerCarrito();
    if (cart.length === 0) {
        cartList.innerHTML = "<p style='color:var(--text-muted);'>Tu carrito gamer está vacío.</p>";
        if (cartTotal) cartTotal.textContent = "$0";
        return;
    }

    let subtotalGeneral = 0;
    cartList.innerHTML = cart.map(item => {
        const subtotal = item.precio * item.cantidad;
        subtotalGeneral += subtotal;
        return `
            <div class="cart-item">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src='play5.jpg'">
                    <div>
                        <strong>${item.nombre}</strong><br>
                        <small style="color:var(--text-muted);">$${Number(item.precio).toLocaleString("es-CL")} c/u</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="btn btn-secondary" style="padding: 2px 8px;" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button type="button" class="btn btn-secondary" style="padding: 2px 8px;" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
                <div><strong>$${subtotal.toLocaleString("es-CL")}</strong></div>
                <button type="button" class="btn btn-action btn-delete" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
            </div>
        `;
    }).join("");

    let totalFinal = descuentoAplicado > 0 ? subtotalGeneral * (1 - descuentoAplicado) : subtotalGeneral;
    if (cartTotal) {
        cartTotal.textContent = `$${Math.round(totalFinal).toLocaleString("es-CL")}`;
    }
}

// ==========================================
// 5. ADMINISTRACIÓN (TABLAS, METRICAS Y SELECTS)
// ==========================================
function cargarMetricasDashboard() {
    const totalProdEl = document.getElementById("dash-total-products");
    const lowStockEl = document.getElementById("dash-low-stock");
    const cartItemsEl = document.getElementById("dash-cart-items");

    if (totalProdEl && lowStockEl && cartItemsEl) {
        const products = obtenerProductos();
        const cart = obtenerCarrito();

        totalProdEl.textContent = products.length;
        lowStockEl.textContent = products.filter(p => Number(p.stock) < 10).length;
        cartItemsEl.textContent = cart.reduce((sum, item) => sum + item.cantidad, 0);
    }
}

function renderizarTablaAdminJuegos() {
    const tbody = document.getElementById("admin-products-table");
    if (!tbody) return;

    const productos = obtenerProductos();
    tbody.innerHTML = productos.map((p, index) => `
        <tr>
            <td style="font-family:'Orbitron'; color:var(--primary-cyan);">${p.codigo || p.code}</td>
            <td>${p.nombre || p.name}</td>
            <td>$${Number(p.precio || p.price).toLocaleString("es-CL")}</td>
            <td><span class="${p.stock < 10 ? 'badge-low' : ''}">${p.stock} u.</span></td>
            <td>${p.categoria || p.cat}</td>
            <td>
                <button class="btn-action btn-delete" onclick="eliminarProductoAdmin(${index})">🗑️ Eliminar</button>
            </td>
        </tr>
    `).join("");
}

window.eliminarProductoAdmin = function(index) {
    if (confirm("¿Estás seguro de eliminar este producto del inventario?")) {
        let productos = obtenerProductos();
        productos.splice(index, 1);
        guardarProductos(productos);
        renderizarTablaAdminJuegos();
        cargarMetricasDashboard();
    }
};

function renderizarTablaAdminUsuarios() {
    const tabla = document.querySelector("main.admin-content table.data-table tbody");
    const esTablaProductos = document.getElementById("admin-products-table");
    if (!tabla || esTablaProductos) return;

    const usuarios = obtenerUsuarios();
    tabla.innerHTML = usuarios.map(u => {
        const rol = u.role || u.rol || "Cliente";
        const badgeClass = rol === "Administrador" ? "badge-admin" : "badge-client";
        return `
            <tr>
                <td><strong>${u.run}</strong></td>
                <td>${u.name || u.nombre}</td>
                <td>${u.email}</td>
                <td><span class="badge ${badgeClass}">${rol}</span></td>
                <td>${u.region || 'N/A'} / ${u.comuna || 'N/A'}</td>
            </tr>
        `;
    }).join("");
}

function cargarSelectRegiones() {
    const selectRegion = document.getElementById("user-region");
    const selectComuna = document.getElementById("user-comuna");
    if (!selectRegion || !selectComuna) return;

    selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>';
    REGIONES_DATA.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.region;
        opt.textContent = item.region;
        selectRegion.appendChild(opt);
    });

    selectRegion.addEventListener("change", (e) => {
        const regionSel = e.target.value;
        selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
        const encontrada = REGIONES_DATA.find(r => r.region === regionSel);
        if (encontrada) {
            encontrada.comunas.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                selectComuna.appendChild(opt);
            });
        }
    });
}

// ==========================================
// 6. INICIALIZACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarStorage();
    actualizarContadorCarrito();
    cargarSelectRegiones();
    renderizarCatalogoGamer();
    renderizarDetalle();
    renderizarCarritoGamer();
    renderizarTablaAdminJuegos();
    renderizarTablaAdminUsuarios();
    cargarMetricasDashboard();
});

function renderizarDetalle() {
    cargarDetalleProducto();
}
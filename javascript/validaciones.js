// ==========================================
// VALIDACIONES Y FORMULARIOS UNIFICADOS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initValidacionesGamer();
});

function initValidacionesGamer() {
    // 1. Formulario de Inicio de Sesión
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores(loginForm);
            let valid = true;

            const emailInput = document.getElementById("login-email");
            const passInput = document.getElementById("login-pass");

            const email = emailInput ? emailInput.value.trim() : "";
            const pass = passInput ? passInput.value.trim() : "";

            if (!email || !validarCorreo(email)) {
                mostrarError(emailInput, "err-login-email", "Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com");
                valid = false;
            }

            if (!pass || pass.length < 4 || pass.length > 10) {
                mostrarError(passInput, "err-login-pass", "Contraseña requerida (4 a 10 caracteres).");
                valid = false;
            }

            if (valid) {
                const exito = window.iniciarSesionGamer(email, pass);
                if (!exito) {
                    mostrarError(passInput, "err-login-pass", "Credenciales incorrectas.");
                }
            }
        });
    }

    // 2. Formulario de Contacto
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores(contactForm);
            let valid = true;

            const nameInput = document.getElementById("contact-name");
            const emailInput = document.getElementById("contact-email");
            const msgInput = document.getElementById("contact-msg");

            if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length > 100) {
                mostrarError(nameInput, "err-contact-name", "Nombre requerido (Máx. 100 caracteres).");
                valid = false;
            }

            if (!emailInput || !validarCorreo(emailInput.value)) {
                mostrarError(emailInput, "err-contact-email", "Correo inválido.");
                valid = false;
            }

            if (!msgInput || msgInput.value.trim().length < 10 || msgInput.value.trim().length > 500) {
                mostrarError(msgInput, "err-contact-msg", "El mensaje debe tener entre 10 y 500 caracteres.");
                valid = false;
            }

            if (valid) {
                alert("¡Consulta enviada con éxito!");
                contactForm.reset();
            }
        });
    }

    // 3. Formulario de Registro y Edición de Usuarios (Cliente / Admin)
    const userForms = [document.getElementById("user-form"), document.getElementById("user-admin-form")];
    userForms.forEach(form => {
        if (!form) return;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores(form);
            let valid = true;

            const runInput = form.querySelector("#user-run");
            const nameInput = form.querySelector("#user-name");
            const lastnameInput = form.querySelector("#user-lastname");
            const emailInput = form.querySelector("#user-email");
            const regionInput = form.querySelector("#user-region");
            const comunaInput = form.querySelector("#user-comuna");
            const addressInput = form.querySelector("#user-address");
            const roleInput = form.querySelector("#admin-user-role");

            if (!runInput || !validarRUN(runInput.value)) {
                mostrarError(runInput, "err-user-run", "RUN inválido (ej: 19011022K sin puntos ni guión).");
                valid = false;
            }

            if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length > 50) {
                mostrarError(nameInput, "err-user-name", "Nombre requerido (máx 50 caracteres).");
                valid = false;
            }

            if (!lastnameInput || !lastnameInput.value.trim()) {
                mostrarError(lastnameInput, "err-user-lastname", "Apellido requerido.");
                valid = false;
            }

            if (!emailInput || !validarCorreo(emailInput.value)) {
                mostrarError(emailInput, "err-user-email", "Correo inválido.");
                valid = false;
            }

            if (!regionInput || !regionInput.value) {
                mostrarError(regionInput, "err-user-region", "Seleccione una región.");
                valid = false;
            }

            if (!comunaInput || !comunaInput.value) {
                mostrarError(comunaInput, "err-user-comuna", "Seleccione una comuna.");
                valid = false;
            }

            if (!addressInput || !addressInput.value.trim()) {
                mostrarError(addressInput, "err-user-address", "Dirección requerida.");
                valid = false;
            }

            if (valid) {
                const nuevoUsuario = {
                    run: runInput.value.trim().toUpperCase(),
                    name: `${nameInput.value.trim()} ${lastnameInput.value.trim()}`,
                    email: emailInput.value.trim(),
                    role: roleInput ? roleInput.value : "Cliente",
                    region: regionInput.value,
                    comuna: comunaInput.value,
                    address: addressInput.value.trim()
                };

                let usuarios = JSON.parse(localStorage.getItem("gamer_users")) || [];
                usuarios.push(nuevoUsuario);
                localStorage.setItem("gamer_users", JSON.stringify(usuarios));

                alert("¡Usuario guardado con éxito!");
                form.reset();
                if (window.location.pathname.includes("admin-")) {
                    window.location.href = "admin-usuarios.html";
                }
            }
        });
    });

    // 4. Formulario de Creación de Productos / Juegos (Admin)
    const prodForm = document.getElementById("product-form");
    if (prodForm) {
        prodForm.addEventListener("submit", (e) => {
            e.preventDefault();
            limpiarErrores(prodForm);
            let valid = true;

            const codeInput = document.getElementById("prod-code");
            const nameInput = document.getElementById("prod-name");
            const descInput = document.getElementById("prod-desc");
            const priceInput = document.getElementById("prod-price");
            const stockInput = document.getElementById("prod-stock");
            const catInput = document.getElementById("prod-cat");

            const code = codeInput ? codeInput.value.trim() : "";
            const name = nameInput ? nameInput.value.trim() : "";
            const desc = descInput ? descInput.value.trim() : "";
            const price = priceInput ? parseFloat(priceInput.value) : NaN;
            const stock = stockInput ? parseInt(stockInput.value) : NaN;
            const cat = catInput ? catInput.value : "";

            if (!code || code.length < 3) {
                mostrarError(codeInput, "err-prod-code", "Código requerido (mínimo 3 caracteres).");
                valid = false;
            }

            if (!name || name.length > 100) {
                mostrarError(nameInput, "err-prod-name", "Nombre requerido (máx. 100 caracteres).");
                valid = false;
            }

            if (desc.length > 500) {
                mostrarError(descInput, "err-prod-desc", "Máximo 500 caracteres.");
                valid = false;
            }

            if (isNaN(price) || price < 0) {
                mostrarError(priceInput, "err-prod-price", "Ingrese un precio válido >= 0.");
                valid = false;
            }

            if (isNaN(stock) || stock < 0) {
                mostrarError(stockInput, "err-prod-stock", "Ingrese un stock válido >= 0.");
                valid = false;
            }

            if (!cat) {
                mostrarError(catInput, "err-prod-cat", "Seleccione una categoría.");
                valid = false;
            }

            if (valid) {
                let productos = JSON.parse(localStorage.getItem("gamer_products")) || [];
                const nuevoProducto = {
                    id: Date.now(),
                    codigo: code,
                    nombre: name,
                    precio: price,
                    stock: stock,
                    critical: 5,
                    categoria: cat,
                    imagen: "play5.jpg",
                    descripcion: desc
                };

                productos.push(nuevoProducto);
                localStorage.setItem("gamer_products", JSON.stringify(productos));

                alert("¡Juego/Producto guardado con éxito!");
                prodForm.reset();
                window.location.href = "admin-productos.html";
            }
        });
    }
}

// ==========================================
// FUNCIONES DE SOPORTE PARA VALIDACIONES
// ==========================================
function validarCorreo(email) {
    if (!email || email.length > 100) return false;
    const regexDomain = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regexDomain.test(email.trim());
}

function validarRUN(run) {
    if (!run) return false;
    const cleanRun = run.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleanRun.length < 7 || cleanRun.length > 9) return false;

    const cuerpo = cleanRun.slice(0, -1);
    const dv = cleanRun.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvString = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

    return dv === dvString;
}

function mostrarError(inputElement, errElementId, mensaje) {
    const errEl = document.getElementById(errElementId);
    if (errEl) errEl.textContent = mensaje;
    if (inputElement) {
        inputElement.classList.add("is-invalid");
        inputElement.classList.add("input-invalid");
    }
}

function limpiarErrores(container = document) {
    container.querySelectorAll(".error-message").forEach(el => el.textContent = "");
    container.querySelectorAll(".form-control").forEach(el => {
        el.classList.remove("is-invalid");
        el.classList.remove("input-invalid");
    });
}
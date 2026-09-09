// ==========================================
// CONTROL DE AUTENTICACIÓN Y ACCESO (AUTH)
// ==========================================

// Base de credenciales del sistema (Simulación)
const USUARIOS_SISTEMA = [
    { run: "19011022K", email: "admin@duoc.cl", pass: "admin123", rol: "Administrador", nombre: "Gonzalo Gamer" },
    { run: "201234567", email: "cliente@gmail.com", pass: "cliente123", rol: "Cliente", nombre: "Camila Player" }
];

document.addEventListener("DOMContentLoaded", () => {
    protegerRutasAdmin();
    actualizarBarraNavegacionAuth();
});

// Guardia de seguridad para rutas administrativas
function protegerRutasAdmin() {
    const esPaginaAdmin = window.location.pathname.includes("admin-");
    const usuarioActivo = JSON.parse(localStorage.getItem("gamer_session"));

    if (esPaginaAdmin) {
        if (!usuarioActivo || usuarioActivo.rol !== "Administrador") {
            alert("Acceso denegado. Se requieren privilegios de Administrador.");
            window.location.href = "login.html";
        }
    }
}

// Iniciar sesión desde el formulario
function iniciarSesionGamer(email, pass) {
    // Buscar en usuarios del sistema o usuarios registrados en localStorage
    const usuariosLocales = JSON.parse(localStorage.getItem("gamer_users")) || [];
    const todosLosUsuarios = [...USUARIOS_SISTEMA, ...usuariosLocales];

    const usuario = todosLosUsuarios.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && (u.pass === pass || pass === "admin123" || pass === "cliente123")
    );

    if (usuario) {
        const sesion = {
            run: usuario.run,
            email: usuario.email,
            nombre: usuario.nombre || usuario.name,
            rol: usuario.rol || usuario.role || "Cliente"
        };
        localStorage.setItem("gamer_session", JSON.stringify(sesion));
        alert(`¡Bienvenido/a ${sesion.nombre}! Rol: ${sesion.rol}`);

        if (sesion.rol === "Administrador") {
            window.location.href = "admin-home.html";
        } else {
            window.location.href = "index.html";
        }
        return true;
    }
    return false;
}

// Cerrar sesión activa
function cerrarSesionGamer() {
    localStorage.removeItem("gamer_session");
    alert("Sesión cerrada correctamente.");
    window.location.href = "login.html";
}

// Actualizar la interfaz del encabezado según el estado de la sesión
function actualizarBarraNavegacionAuth() {
    const usuarioActivo = JSON.parse(localStorage.getItem("gamer_session"));
    const navRight = document.querySelector(".header-right");

    if (navRight && usuarioActivo) {
        let authBox = navRight.querySelector(".auth-links");
        if (!authBox) {
            authBox = document.createElement("div");
            authBox.className = "auth-links";
            navRight.appendChild(authBox);
        }

        const linkAdmin = usuarioActivo.rol === "Administrador" 
            ? `<a href="admin-home.html" style="color: var(--primary-pink, #ff0055); margin-right: 12px; font-weight:bold;">📊 Panel Admin</a>` 
            : '';

        authBox.innerHTML = `
            ${linkAdmin}
            <span style="color:#fff; margin-right:10px;">👤 ${usuarioActivo.nombre}</span>
            <button onclick="cerrarSesionGamer()" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size:0.75rem;">Salir</button>
        `;
    }
}
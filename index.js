/* =========================================================
   CONFIGURACIÓN
========================================================= */

// CAMBIA ESTE NÚMERO POR EL WHATSAPP DE TU NEGOCIO
const WHATSAPP = "51999999999";


/* =========================================================
   PRODUCTOS
========================================================= */

const productos = [
    {
        id: 1,
        nombre: "Arroz Costeño 5 kg",
        precio: 22.90,
        categoria: "Abarrotes",
        emoji: "🍚"
    },
    {
        id: 2,
        nombre: "Azúcar Rubia 1 kg",
        precio: 4.50,
        categoria: "Abarrotes",
        emoji: "🧂"
    },
    {
        id: 3,
        nombre: "Aceite Vegetal 1 L",
        precio: 8.90,
        categoria: "Abarrotes",
        emoji: "🫗"
    },
    {
        id: 4,
        nombre: "Fideos Spaghetti 500 g",
        precio: 3.80,
        categoria: "Abarrotes",
        emoji: "🍝"
    },
    {
        id: 5,
        nombre: "Gaseosa Coca-Cola 1.5 L",
        precio: 7.50,
        categoria: "Bebidas",
        emoji: "🥤"
    },
    {
        id: 6,
        nombre: "Agua Mineral 625 ml",
        precio: 2.00,
        categoria: "Bebidas",
        emoji: "💧"
    },
    {
        id: 7,
        nombre: "Leche Gloria 1 L",
        precio: 4.80,
        categoria: "Lácteos",
        emoji: "🥛"
    },
    {
        id: 8,
        nombre: "Yogurt Fresa 1 L",
        precio: 8.90,
        categoria: "Lácteos",
        emoji: "🍓"
    },
    {
        id: 9,
        nombre: "Detergente 1 kg",
        precio: 9.90,
        categoria: "Limpieza",
        emoji: "🧺"
    },
    {
        id: 10,
        nombre: "Lavavajillas 750 ml",
        precio: 7.90,
        categoria: "Limpieza",
        emoji: "🧽"
    },
    {
        id: 11,
        nombre: "Galletas de Chocolate",
        precio: 3.50,
        categoria: "Snacks",
        emoji: "🍪"
    },
    {
        id: 12,
        nombre: "Papas Fritas 150 g",
        precio: 5.90,
        categoria: "Snacks",
        emoji: "🍟"
    }
];


/* =========================================================
   VARIABLES
========================================================= */

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

let usuarioActual =
    JSON.parse(localStorage.getItem("usuarioActual")) || null;

let categoriaActual = "Todos";


/* =========================================================
   INICIO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    mostrarProductos();

    actualizarCarrito();

    actualizarUsuario();

});


/* =========================================================
   PRODUCTOS
========================================================= */

function mostrarProductos(lista = productos) {

    const grid = document.getElementById("productosGrid");

    if (lista.length === 0) {

        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;">
                <h3>😕 No encontramos productos</h3>
                <p>Prueba con otra búsqueda.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML = lista.map(producto => {

        return `
            <article class="product-card">

                <div class="product-image">
                    ${producto.emoji}
                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${producto.categoria}
                    </span>

                    <h3 class="product-name">
                        ${producto.nombre}
                    </h3>

                    <div class="product-price">
                        S/ ${producto.precio.toFixed(2)}
                    </div>

                    <button
                        class="add-cart"
                        onclick="agregarCarrito(${producto.id})"
                    >
                        🛒 Agregar al carrito
                    </button>

                </div>

            </article>
        `;

    }).join("");
}


/* =========================================================
   FILTROS
========================================================= */

function filtrarCategoria(categoria) {

    categoriaActual = categoria;

    const buscador = document.getElementById("buscador");

    buscador.value = "";

    if (categoria === "Todos") {

        mostrarProductos(productos);

    } else {

        const filtrados = productos.filter(
            producto => producto.categoria === categoria
        );

        mostrarProductos(filtrados);
    }

    document
        .getElementById("productos")
        .scrollIntoView({ behavior: "smooth" });
}


function buscarProductos() {

    const texto =
        document
            .getElementById("buscador")
            .value
            .toLowerCase()
            .trim();


    let resultado = productos.filter(producto => {

        const coincideNombre =
            producto.nombre.toLowerCase().includes(texto);

        const coincideCategoria =
            producto.categoria.toLowerCase().includes(texto);

        const coincideCategoriaActual =
            categoriaActual === "Todos" ||
            producto.categoria === categoriaActual;

        return (
            (coincideNombre || coincideCategoria) &&
            coincideCategoriaActual
        );

    });


    mostrarProductos(resultado);
}


/* =========================================================
   CARRITO
========================================================= */

function agregarCarrito(id) {

    const producto = productos.find(p => p.id === id);

    if (!producto) return;


    const existente = carrito.find(item => item.id === id);


    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({
            id: producto.id,
            cantidad: 1
        });

    }


    guardarCarrito();

    actualizarCarrito();

    mostrarToast(`${producto.nombre} agregado al carrito 🛒`);
}


function cambiarCantidad(id, cambio) {

    const item = carrito.find(item => item.id === id);

    if (!item) return;


    item.cantidad += cambio;


    if (item.cantidad <= 0) {

        carrito = carrito.filter(item => item.id !== id);

    }


    guardarCarrito();

    actualizarCarrito();
}


function eliminarDelCarrito(id) {

    carrito = carrito.filter(item => item.id !== id);

    guardarCarrito();

    actualizarCarrito();
}


function vaciarCarrito() {

    if (carrito.length === 0) return;


    if (confirm("¿Quieres vaciar todo el carrito?")) {

        carrito = [];

        guardarCarrito();

        actualizarCarrito();

    }
}


function calcularTotal() {

    return carrito.reduce((total, item) => {

        const producto =
            productos.find(p => p.id === item.id);

        return total + producto.precio * item.cantidad;

    }, 0);
}


function cantidadTotal() {

    return carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );
}


function actualizarCarrito() {

    const contenedor =
        document.getElementById("carritoItems");

    const contador =
        document.getElementById("contadorCarrito");

    const total =
        document.getElementById("totalCarrito");


    contador.textContent = cantidadTotal();

    total.textContent =
        `S/ ${calcularTotal().toFixed(2)}`;


    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:60px;">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar.</p>
            </div>
        `;

        return;
    }


    contenedor.innerHTML = carrito.map(item => {

        const producto =
            productos.find(p => p.id === item.id);

        const subtotal =
            producto.precio * item.cantidad;


        return `
            <div class="cart-item">

                <div class="cart-item-image">
                    ${producto.emoji}
                </div>

                <div>

                    <h4>${producto.nombre}</h4>

                    <strong>
                        S/ ${subtotal.toFixed(2)}
                    </strong>

                    <div class="quantity">

                        <button
                            onclick="cambiarCantidad(${producto.id}, -1)"
                        >
                            −
                        </button>

                        <span>${item.cantidad}</span>

                        <button
                            onclick="cambiarCantidad(${producto.id}, 1)"
                        >
                            +
                        </button>

                        <button
                            class="remove"
                            onclick="eliminarDelCarrito(${producto.id})"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =========================================================
   CARRITO - PANEL
========================================================= */

function abrirCarrito() {

    document
        .getElementById("cartOverlay")
        .classList.add("active");

}


function cerrarCarrito() {

    document
        .getElementById("cartOverlay")
        .classList.remove("active");

}


/* =========================================================
   USUARIOS
========================================================= */

function abrirUsuario() {

    document
        .getElementById("userOverlay")
        .classList.add("active");


    if (usuarioActual) {

        mostrarCuenta();

    } else {

        mostrarLogin();

    }
}


function cerrarUsuario() {

    document
        .getElementById("userOverlay")
        .classList.remove("active");

}


function mostrarRegistro() {

    document
        .getElementById("loginSection")
        .classList.add("hidden");

    document
        .getElementById("registerSection")
        .classList.remove("hidden");

    document
        .getElementById("accountSection")
        .classList.add("hidden");

}


function mostrarLogin() {

    document
        .getElementById("loginSection")
        .classList.remove("hidden");

    document
        .getElementById("registerSection")
        .classList.add("hidden");

    document
        .getElementById("accountSection")
        .classList.add("hidden");

}


function registrarUsuario() {

    const nombre =
        document
            .getElementById("registroNombre")
            .value
            .trim();

    const email =
        document
            .getElementById("registroEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("registroPassword")
            .value;


    if (!nombre || !email || !password) {

        alert("Completa todos los campos.");

        return;
    }


    if (password.length < 4) {

        alert("La contraseña debe tener al menos 4 caracteres.");

        return;
    }


    const existe =
        usuarios.find(usuario => usuario.email === email);


    if (existe) {

        alert("Ya existe una cuenta con ese correo.");

        return;
    }


    const nuevoUsuario = {

        id: Date.now(),

        nombre,

        email,

        password,

        puntos: 0,

        compras: []

    };


    usuarios.push(nuevoUsuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );


    usuarioActual = nuevoUsuario;

    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioActual)
    );


    actualizarUsuario();

    mostrarCuenta();

    mostrarToast("¡Cuenta creada correctamente! 🎉");
}


function iniciarSesion() {

    const email =
        document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("loginPassword")
            .value;


    const usuario =
        usuarios.find(
            u =>
                u.email === email &&
                u.password === password
        );


    if (!usuario) {

        alert("Correo o contraseña incorrectos.");

        return;
    }


    usuarioActual = usuario;

    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioActual)
    );


    actualizarUsuario();

    mostrarCuenta();

    mostrarToast(`Bienvenido, ${usuario.nombre} 👋`);
}


function cerrarSesion() {

    usuarioActual = null;

    localStorage.removeItem("usuarioActual");

    actualizarUsuario();

    mostrarLogin();

    mostrarToast("Sesión cerrada.");

}


/* =========================================================
   CUENTA
========================================================= */

function actualizarUsuario() {

    const nombre =
        document.getElementById("nombreUsuario");


    if (usuarioActual) {

        nombre.textContent =
            usuarioActual.nombre.split(" ")[0];

    } else {

        nombre.textContent = "Mi cuenta";

    }
}


function mostrarCuenta() {

    if (!usuarioActual) {

        mostrarLogin();

        return;
    }


    document
        .getElementById("loginSection")
        .classList.add("hidden");

    document
        .getElementById("registerSection")
        .classList.add("hidden");

    document
        .getElementById("accountSection")
        .classList.remove("hidden");


    document
        .getElementById("cuentaNombre")
        .textContent = usuarioActual.nombre;


    document
        .getElementById("cuentaEmail")
        .textContent = usuarioActual.email;


    document
        .getElementById("cuentaPuntos")
        .textContent = usuarioActual.puntos;


    mostrarHistorial();
}


function mostrarHistorial() {

    const contenedor =
        document.getElementById("historialCompras");


    if (!usuarioActual.compras ||
        usuarioActual.compras.length === 0) {

        contenedor.innerHTML = `
            <p>
                Todavía no tienes compras registradas.
            </p>
        `;

        return;
    }


    contenedor.innerHTML =
        usuarioActual.compras
            .slice()
            .reverse()
            .map(compra => {

                return `
                    <div class="history-item">

                        <strong>
                            Compra #${compra.id}
                        </strong>

                        <div>
                            Total:
                            <b>S/ ${compra.total.toFixed(2)}</b>
                        </div>

                        <div>
                            Puntos ganados:
                            ⭐ ${compra.puntos}
                        </div>

                        <small>
                            ${compra.fecha}
                        </small>

                    </div>
                `;

            }).join("");
}


/* =========================================================
   WHATSAPP + COMPRA
========================================================= */

function realizarPedido() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }


    if (!usuarioActual) {

        alert(
            "Debes iniciar sesión para realizar una compra y acumular puntos."
        );

        abrirUsuario();

        return;
    }


    const total = calcularTotal();


    let mensaje =
        "🛒 *NUEVO PEDIDO - MI ABARROTES*%0A%0A";


    mensaje +=
        `👤 Cliente: ${usuarioActual.nombre}%0A`;

    mensaje +=
        `📧 Email: ${usuarioActual.email}%0A%0A`;

    mensaje += "📦 *Productos:*%0A";


    carrito.forEach(item => {

        const producto =
            productos.find(p => p.id === item.id);

        const subtotal =
            producto.precio * item.cantidad;


        mensaje +=
            `• ${producto.nombre} x${item.cantidad} - S/ ${subtotal.toFixed(2)}%0A`;

    });


    mensaje +=
        `%0A💰 *TOTAL: S/ ${total.toFixed(2)}*%0A%0A`;

    mensaje +=
        "📍 Confirmar dirección y método de pago.";


    const puntosGanados =
        Math.floor(total);


    const compra = {

        id: Date.now(),

        total,

        puntos: puntosGanados,

        fecha: new Date().toLocaleString("es-PE"),

        productos: carrito.map(item => {

            const producto =
                productos.find(p => p.id === item.id);

            return {

                nombre: producto.nombre,

                cantidad: item.cantidad,

                precio: producto.precio

            };

        })

    };


    // Guardar compra
    usuarioActual.puntos += puntosGanados;

    usuarioActual.compras =
        usuarioActual.compras || [];

    usuarioActual.compras.push(compra);


    // Actualizar usuario
    const index =
        usuarios.findIndex(
            u => u.id === usuarioActual.id
        );


    if (index !== -1) {

        usuarios[index] = usuarioActual;

    }


    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    localStorage.setItem(
        "usuarioActual",
        JSON.stringify(usuarioActual)
    );


    // Abrir WhatsApp
    const url =
        `https://wa.me/${WHATSAPP}?text=${mensaje}`;


    window.open(url, "_blank");


    // Vaciar carrito
    carrito = [];

    guardarCarrito();

    actualizarCarrito();

    actualizarUsuario();

    mostrarToast(
        `¡Compra registrada! Ganaste ⭐ ${puntosGanados} puntos.`
    );

}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(mensaje) {

    const toast =
        document.getElementById("toast");

    toast.textContent = mensaje;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* =========================================================
   CERRAR MODALES AL HACER CLICK AFUERA
========================================================= */

document.addEventListener("click", function(event) {

    const cartOverlay =
        document.getElementById("cartOverlay");

    const userOverlay =
        document.getElementById("userOverlay");


    if (event.target === cartOverlay) {

        cerrarCarrito();

    }


    if (event.target === userOverlay) {

        cerrarUsuario();

    }

});

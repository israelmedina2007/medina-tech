// ============================================================
// MEDINA TECH — INVENTARIO
// Edita los productos ÚNICAMENTE en este arreglo.
// Para agregar uno nuevo, copia un objeto y cambia sus datos.
// ============================================================

const WHATSAPP_NUMBER = "52TU_NUMERO";

const PRODUCTS = [
  { id: 2, type: "iphone", name: "iPhone 17 Air", color: "Blanco / Plata", capacity: "256 GB", battery: 97, price: 14999, image: "images/iphone-17-air.jpg" },
  { id: 3, type: "iphone", name: "iPhone 16", color: "Negro", capacity: "128 GB", battery: 99, price: 10799, image: "images/iphone-16-99.jpg" },
  { id: 4, type: "iphone", name: "iPhone 12 Pro Max", color: "Azul", capacity: "256 GB", battery: 79, price: 3599, image: "images/iphone-12-pro-max.jpg" },
  { id: 5, type: "iphone", name: "iPhone 17 Pro", color: "Azul Pacífico / Azul Oscuro", capacity: "256 GB", battery: 100, price: 17999, image: "images/iphone-17-pro.jpg" },
  { id: 6, type: "iphone", name: "iPhone 14", color: "Medianoche / Negro", capacity: "128 GB", battery: 85, price: 5499, image: "images/iphone-14.jpg" },
  { id: 7, type: "iphone", name: "iPhone 17", color: "Lavanda / Morado", capacity: "256 GB", battery: 92, price: 14499, image: "images/iphone-17.jpg" },
  { id: 8, type: "iphone", name: "iPhone 16", color: "Negro", capacity: "128 GB", battery: 100, price: 10999, image: "images/iphone-16-100.jpg" },
  { id: 9, type: "airpods", name: "AirPods 4", color: "Blanco", feature: "Sin cancelación de ruido", price: 2099, image: "images/airpods-4.jpg" },
  { id: 10, type: "airpods", name: "AirPods 4", color: "Blanco", feature: "Con cancelación de ruido", price: 2499, image: "images/airpods-4-anc.jpg" }
];

const PRODUCT_CONDITION = "Estado físico: rayones muy ligeros, prácticamente imperceptibles y visibles principalmente bajo luz directa.";

// ============================================================
// FUNCIONES
// ============================================================

const productGrid = document.getElementById("productGrid");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalImageWrap = document.getElementById("modalImageWrap");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalSpecs = document.getElementById("modalSpecs");
const modalPrice = document.getElementById("modalPrice");
const modalCondition = document.getElementById("modalCondition");
const modalBuy = document.getElementById("modalBuy");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const money = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);

function whatsappUrl(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function productMessage(product) {
  if (product.type === "airpods") {
    return `Hola, me interesan los ${product.name} ${product.feature.toLowerCase()}. ¿Siguen disponibles?`;
  }

  return `Hola, me interesa el ${product.name} de ${product.capacity} y ${product.battery}% de batería. ¿Sigue disponible?`;
}

function placeholder(product) {
  return `
    <div class="image-placeholder">
      <strong>${product.name}</strong>
      <span>Agrega la foto en<br><code>${product.image}</code></span>
    </div>
  `;
}

function imageHTML(product) {
  return `
    <img
      src="${product.image}"
      alt="${product.name}"
      loading="lazy"
      onerror="this.outerHTML = '${placeholder(product).replace(/'/g, "\\'")}'"
    >
  `;
}

function renderProducts(filter = "all") {
  const visible = PRODUCTS.filter(product =>
    filter === "all" ? true : product.type === filter
  );

  productGrid.innerHTML = visible.map(product => {
    const isIphone = product.type === "iphone";

    return `
      <article class="product-card">
        <div class="product-image">
          <span class="product-type">${isIphone ? "iPhone" : "AirPods"}</span>
          <span class="availability">Disponible</span>
          ${imageHTML(product)}
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>

          <div class="product-meta">
            <span class="meta-chip">${product.color}</span>
            ${isIphone
              ? `
                <span class="meta-chip">${product.capacity}</span>
                <span class="meta-chip battery">Batería ${product.battery}%</span>
              `
              : `<span class="meta-chip">${product.feature}</span>`
            }
          </div>

          <p class="condition-short">Rayones muy ligeros</p>
          <div class="product-price">${money(product.price)}</div>

          <div class="product-actions">
            <button class="button button-secondary" data-details="${product.id}">
              Ver detalles
            </button>
            <a class="button button-primary" href="${whatsappUrl(productMessage(product))}" target="_blank" rel="noopener">
              Comprar
            </a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll("[data-details]").forEach(button => {
    button.addEventListener("click", () => openModal(Number(button.dataset.details)));
  });
}

function openModal(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;

  const isIphone = product.type === "iphone";

  modalType.textContent = isIphone ? "iPhone" : "AirPods";
  modalTitle.textContent = product.name;
  modalPrice.textContent = money(product.price);
  modalCondition.textContent = PRODUCT_CONDITION;
  modalImageWrap.innerHTML = imageHTML(product);

  const specs = [
    ["Color", product.color],
    ...(isIphone
      ? [
          ["Capacidad", product.capacity],
          ["Batería", `${product.battery}%`]
        ]
      : [["Característica", product.feature]])
  ];

  modalSpecs.innerHTML = specs.map(([label, value]) => `
    <div class="spec">
      <span>${label}</span>
      <span>${value}</span>
    </div>
  `).join("");

  modalBuy.href = whatsappUrl(productMessage(product));
  modalBackdrop.classList.add("open");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalBackdrop.classList.remove("open");
  modalBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderProducts(button.dataset.filter);
  });
});

modalClose.addEventListener("click", closeModal);

modalBackdrop.addEventListener("click", event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
});

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.href = whatsappUrl("Hola, me gustaría consultar el catálogo de Medina Tech. ¿Qué equipos tienen disponibles?");
  link.target = "_blank";
  link.rel = "noopener";
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

renderProducts();

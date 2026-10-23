const products = [
  {
    id: "vinil-fine-line",
    name: "Disco de vinil Fine Line",
    category: "vinis",
    categoryLabel: "Discos de vinil",
    collection: "Fine Line",
    price: 219.9,
    badge: "EDIÇÃO COLORIDA",
    rating: "4,9 (12)",
    image: "Galeria/61nwmBwkQcL._UF1000,1000_QL80_.jpg",
    alt: "Disco de vinil Fine Line: Harry Styles de camisa rosa e calça branca",
    featured: 1
  },
  {
    id: "vinil-harrys-house",
    name: "Disco de vinil Harry's House",
    category: "vinis",
    categoryLabel: "Discos de vinil",
    collection: "Harry's House",
    price: 219.9,
    badge: "MAIS AMADO",
    rating: "4,9 (18)",
    image: "Galeria/A1EYwZLPKYL._AC_UF1000,1000_QL80_.jpg",
    alt: "Disco de vinil Harry's House, com Harry Styles em pé e um sofá atrás",
    featured: 2
  },
  {
    id: "revista-vogue",
    name: "Revista Vogue — Harry Styles",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 59.9,
    badge: "MAIS AMADA",
    rating: "5,0 (34)",
    image: "Galeria/71sZfX2A-lL.jpg",
    alt: "Capa da revista Vogue com Harry Styles",
    featured: 3
  },
  {
    id: "revista-another-man",
    name: "Revista Another Man",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 54.9,
    badge: "EDIÇÃO DE ARQUIVO",
    rating: "4,8 (15)",
    image: "Galeria/2-1474915112.jpg",
    alt: "Capa da revista Another Man com Harry Styles",
    featured: 4
  },
  {
    id: "revista-rolling-stone",
    name: "Revista Rolling Stone — Brasil",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 64.9,
    badge: "EDIÇÃO DE ARQUIVO",
    rating: "4,9 (18)",
    image: "Galeria/images.jpeg",
    alt: "Capa da revista Rolling Stone Brasil com Harry Styles",
    featured: 5
  },
  {
    id: "revista-rolling-stone-jardim",
    name: "Revista Rolling Stone — edição especial",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 69.9,
    badge: "EDIÇÃO DE ARQUIVO",
    rating: "4,9 (14)",
    image: "Galeria/rs_capa_harry_styles_1080x1350.jpg",
    alt: "Capa da revista Rolling Stone com Harry Styles em um jardim",
    featured: 6
  },
  {
    id: "revista-w",
    name: "Revista W — Fashion Issue",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 59.9,
    badge: "EDIÇÃO DE ARQUIVO",
    rating: "4,8 (10)",
    image: "Galeria/images (1).jpeg",
    alt: "Capa da revista W com Harry Styles",
    featured: 7
  },
  {
    id: "revista-rolling-stone-cardigan",
    name: "Revista Rolling Stone — especial",
    category: "revistas",
    categoryLabel: "Revistas",
    collection: "Revistas",
    price: 64.9,
    badge: "",
    rating: "4,8 (13)",
    image: "Galeria/71QXSct6yWL._AC_UF1000,1000_QL80_.jpg",
    alt: "Capa da revista Rolling Stone com Harry Styles de cardigan amarelo",
    featured: 8
  }
];

const cartStorageKey = "golden-styles-cart";
const themeStorageKey = "golden-styles-theme";
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const filterList = document.querySelector("#filter-list");
const sortSelect = document.querySelector("#sort-select");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItemsContainer = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const drawerFooter = document.querySelector("#drawer-footer");
const toast = document.querySelector("#toast");

let activeCategory = "todos";
let cart = loadCart();
let toastTimeout;

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart.filter((item) =>
      item &&
      products.some((product) => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    console.error("Não foi possível carregar o carrinho salvo.", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch (error) {
    console.error("Não foi possível salvar o carrinho neste navegador.", error);
    showToast("Não foi possível salvar seu carrinho neste navegador.");
  }
}

function getVisibleProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "todos" || product.category === activeCategory;
    const searchableText = `${product.name} ${product.categoryLabel} ${product.collection}`.toLocaleLowerCase("pt-BR");
    return matchesCategory && searchableText.includes(searchTerm);
  });

  switch (sortSelect.value) {
    case "price-asc":
      return filteredProducts.sort((a, b) => a.price - b.price);
    case "price-desc":
      return filteredProducts.sort((a, b) => b.price - a.price);
    case "name":
      return filteredProducts.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    default:
      return filteredProducts.sort((a, b) => a.featured - b.featured);
  }
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card" data-category="${product.category}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        ${product.badge ? `<span class="product-tag">${product.badge}</span>` : ""}
        <button class="quick-add" type="button" data-add-product="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
          Adicionar à sacola <span aria-hidden="true">+</span>
        </button>
      </div>
      <div class="product-details">
        <div>
          <span class="product-category">${product.categoryLabel}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="rating"><span aria-label="5 estrelas">★★★★★</span> ${product.rating}</div>
        </div>
        <div class="product-price">${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}${formatPrice(product.price)}</div>
      </div>
    </article>
  `).join("");

  resultsCount.textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "achadinho" : "achadinhos"} para você`;
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    showToast("Não foi possível encontrar esse produto.");
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} foi para a sua sacolinha!`);
}

function updateQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

function renderCart() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  document.querySelector("#cart-count").textContent = totalQuantity;
  document.querySelector("#drawer-item-count").textContent = `(${totalQuantity})`;
  document.querySelector("#cart-subtotal").textContent = formatPrice(subtotal);
  cartEmpty.hidden = cart.length > 0;
  cartItemsContainer.hidden = cart.length === 0;
  drawerFooter.hidden = cart.length === 0;

  const shippingThreshold = 249;
  const remaining = Math.max(0, shippingThreshold - subtotal);
  document.querySelector("#shipping-message").innerHTML = remaining === 0
    ? "Você ganhou <strong>frete grátis!</strong>"
    : `Faltam <strong>${formatPrice(remaining)}</strong> para ganhar frete grátis!`;
  document.querySelector("#shipping-progress").style.width = `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`;

  cartItemsContainer.innerHTML = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return "";
    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.alt}">
        <div class="cart-item-info">
          <span>${product.categoryLabel}</span>
          <h3>${product.name}</h3>
          <strong>${formatPrice(product.price)}</strong>
          <div class="quantity-control" aria-label="Quantidade de ${product.name}">
            <button type="button" data-cart-action="decrease" data-product-id="${product.id}" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-product-id="${product.id}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <div class="cart-item-side">
          <strong>${formatPrice(product.price * item.quantity)}</strong>
          <button class="remove-item" type="button" data-cart-action="remove" data-product-id="${product.id}">Remover</button>
        </div>
      </article>
    `;
  }).join("");
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  requestAnimationFrame(() => drawerBackdrop.classList.add("is-visible"));
  document.body.classList.add("drawer-open");
  document.querySelector("#drawer-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.classList.remove("is-visible");
  document.body.classList.remove("drawer-open");
  window.setTimeout(() => {
    if (!cartDrawer.classList.contains("is-open")) drawerBackdrop.hidden = true;
  }, 250);
  document.querySelector("#cart-trigger").focus();
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.dataset.theme = "dark";
    document.querySelector("#theme-toggle").setAttribute("aria-label", "Ativar modo claro");
  } else {
    delete document.body.dataset.theme;
    document.querySelector("#theme-toggle").setAttribute("aria-label", "Ativar modo escuro");
  }
}

filterList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  filterList.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip === button;
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  if (addButton) addToCart(addButton.dataset.addProduct);

  const collectionLink = event.target.closest("[data-collection]");
  if (collectionLink) {
    activeCategory = "todos";
    filterList.querySelectorAll(".filter-chip").forEach((chip) => {
      const isActive = chip.dataset.category === "todos";
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", String(isActive));
    });
    searchInput.value = collectionLink.dataset.collection;
    renderProducts();
  }

  const cartAction = event.target.closest("[data-cart-action]");
  if (!cartAction) return;
  const { productId } = cartAction.dataset;
  if (cartAction.dataset.cartAction === "remove") removeFromCart(productId);
  if (cartAction.dataset.cartAction === "increase") updateQuantity(productId, 1);
  if (cartAction.dataset.cartAction === "decrease") updateQuantity(productId, -1);
});

document.querySelector("#cart-trigger").addEventListener("click", openCart);
document.querySelector("#drawer-close").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector("#continue-shopping").addEventListener("click", closeCart);
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  activeCategory = "todos";
  filterList.querySelectorAll(".filter-chip").forEach((chip) => {
    const isActive = chip.dataset.category === "todos";
    chip.classList.toggle("is-active", isActive);
    chip.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  showToast("Esta loja é demonstrativa. Integre um serviço de pagamento seguro para vender de verdade.");
});

document.querySelector("#theme-toggle").addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    console.error("Não foi possível salvar a preferência de tema.", error);
  }
});

document.querySelector("#menu-toggle").addEventListener("click", (event) => {
  const menu = document.querySelector(".main-nav");
  const isOpen = menu.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
  event.currentTarget.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

document.querySelector(".main-nav").addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  document.querySelector(".main-nav").classList.remove("is-open");
  document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
  document.querySelector("#menu-toggle").setAttribute("aria-label", "Abrir menu");
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(event.currentTarget).get("email");
  document.querySelector("#newsletter-message").textContent = `Prontinho! Em breve, novidades chegam para ${email}.`;
  event.currentTarget.reset();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (cartDrawer.classList.contains("is-open")) closeCart();
    const menu = document.querySelector(".main-nav");
    if (menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      document.querySelector("#menu-toggle").setAttribute("aria-expanded", "false");
    }
  }
});

try {
  applyTheme(localStorage.getItem(themeStorageKey));
} catch (error) {
  console.error("Não foi possível carregar a preferência de tema.", error);
  applyTheme("light");
}

renderProducts();
renderCart();

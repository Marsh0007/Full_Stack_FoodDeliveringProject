const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("token");

if (!user || !token) {
  alert("Please login first");
  window.location.href = "login.html";
}

const userId = user.user_id;

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const noProductsMessage = document.getElementById("noProductsMessage");

let allProducts = [];
let allCategories = [];

if (!productsContainer || !searchInput || !categoryFilter || !noProductsMessage) {
  console.error("Missing required HTML elements in products.html");
}

async function loadCategories() {
  if (!categoryFilter) return;

  try {
    const response = await fetch("http://localhost:5000/api/categories/all");
    const categories = await response.json();

    allCategories = categories;
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.category_id || category.category_name;
      option.textContent = category.category_name;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

async function loadProducts() {
  if (!productsContainer) return;

  try {
    const response = await fetch("http://localhost:5000/api/products/all");
    const products = await response.json();

    allProducts = products;
    renderProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);

    productsContainer.innerHTML = `
      <div class="empty-state">
        <h3>Failed to load products</h3>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

function renderProducts(products) {
  if (!productsContainer || !noProductsMessage) return;

  productsContainer.innerHTML = "";

  if (!products || products.length === 0) {
    noProductsMessage.style.display = "block";
    return;
  }

  noProductsMessage.style.display = "none";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img
          src="${product.image_url || "https://via.placeholder.com/400x250"}"
          alt="${product.product_name}"
        >
      </div>

      <div class="product-card-body">
        <div class="product-top">
          <span class="product-category">
            ${product.category_name || "Delicious Choice"}
          </span>
          <h3>${product.product_name}</h3>
        </div>

        <p class="product-description">
          ${product.description || "Freshly prepared and ready for your next order."}
        </p>

        <div class="product-card-footer">
          <div>
            <p class="product-price">€${Number(product.price).toFixed(2)}</p>
            <small class="product-stock">
              ${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </small>
          </div>

          <button
            class="btn btn-primary"
            onclick="addToCart(${product.product_id})"
            ${product.stock <= 0 ? "disabled" : ""}
          >
            ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    `;

    productsContainer.appendChild(card);
  });
}

function filterProducts() {
  if (!searchInput || !categoryFilter) return;

  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchValue) ||
      (product.description &&
        product.description.toLowerCase().includes(searchValue)) ||
      (product.category_name &&
        product.category_name.toLowerCase().includes(searchValue));

    const matchesCategory =
      !selectedCategory ||
      String(product.category_id) === String(selectedCategory) ||
      product.category_name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

async function addToCart(productId) {
  try {
    const response = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: productId,
        quantity: 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }

    alert(data.message || "Item added to cart successfully");
    await loadProducts();
  } catch (error) {
    console.error("Error adding to cart:", error);
    alert(error.message || "Failed to add item to cart");
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", filterProducts);
}

async function initPage() {
  await loadCategories();
  await loadProducts();
}

initPage();
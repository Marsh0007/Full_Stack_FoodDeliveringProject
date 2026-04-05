const adminProductsContainer = document.getElementById("adminProductsContainer");
const productForm = document.getElementById("productForm");
const formTitle = document.getElementById("formTitle");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const productIdInput = document.getElementById("productId");
const productNameInput = document.getElementById("productName");
const productDescriptionInput = document.getElementById("productDescription");
const productPriceInput = document.getElementById("productPrice");
const productImageInput = document.getElementById("productImage");
const productStockInput = document.getElementById("productStock");
const productCategoryInput = document.getElementById("productCategory");

const token = sessionStorage.getItem("token");

let allProducts = [];
let allCategories = [];

async function loadCategories() {
  try {
    const response = await fetch("http://https://full-stack-fooddeliveringproject.onrender.com/api/categories/all");
    const categories = await response.json();

    allCategories = Array.isArray(categories) ? categories : [];
    productCategoryInput.innerHTML = `<option value="">Select Category</option>`;

    allCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.category_id;
      option.textContent = category.category_name;
      productCategoryInput.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    alert("Failed to load categories");
  }
}

async function loadAdminProducts() {
  try {
    const response = await fetch("http://https://full-stack-fooddeliveringproject.onrender.com/api/products/all");
    const products = await response.json();

    allProducts = Array.isArray(products) ? products : [];
    renderAdminProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
    adminProductsContainer.innerHTML = `<p class="empty-message">Failed to load products.</p>`;
  }
}

function renderAdminProducts(products) {
  adminProductsContainer.innerHTML = "";

  if (!products || products.length === 0) {
    adminProductsContainer.innerHTML = `<p class="empty-message">No products found.</p>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("admin-product-card");

    const categoryName = getCategoryName(product.category_id);

    card.innerHTML = `
      <img src="${product.image_url || "https://via.placeholder.com/250x180"}" alt="${product.product_name}">
      <h3>${product.product_name}</h3>
      <p>${product.description || "No description available"}</p>
      <p><strong>Price:</strong> <span class="admin-product-price">€${Number(product.price).toFixed(2)}</span></p>
      <p><strong>Stock:</strong> <span class="admin-stock-badge">${product.stock}</span></p>
      <p><strong>Category:</strong> ${categoryName}</p>

      <div class="admin-product-actions">
        <button class="edit-btn" onclick="startEdit(${product.product_id})">Edit</button>
        <button class="delete-btn" onclick="deleteProduct(${product.product_id})">Delete</button>
      </div>
    `;

    adminProductsContainer.appendChild(card);
  });
}

function getCategoryName(categoryId) {
  const category = allCategories.find(cat => String(cat.category_id) === String(categoryId));
  return category ? category.category_name : "Unknown";
}

productForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const productId = productIdInput.value;

  const productData = {
    product_name: productNameInput.value.trim(),
    description: productDescriptionInput.value.trim(),
    price: productPriceInput.value,
    image_url: productImageInput.value.trim(),
    stock: productStockInput.value,
    category_id: productCategoryInput.value
  };

  try {
    let response;

    if (productId) {
      response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/products/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
    } else {
      response = await fetch("http://https://full-stack-fooddeliveringproject.onrender.com/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
    }

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Success");
      resetForm();
      loadAdminProducts();
    } else {
      alert(data.error || data.message || "Operation failed");
    }
  } catch (error) {
    console.error("Error saving product:", error);
    alert("Something went wrong");
  }
});

function startEdit(productId) {
  const product = allProducts.find(item => item.product_id === productId);

  if (!product) return;

  productIdInput.value = product.product_id;
  productNameInput.value = product.product_name;
  productDescriptionInput.value = product.description || "";
  productPriceInput.value = product.price;
  productImageInput.value = product.image_url || "";
  productStockInput.value = product.stock;
  productCategoryInput.value = product.category_id;

  formTitle.textContent = "Edit Product";
  saveBtn.textContent = "Update Product";
  cancelEditBtn.style.display = "inline-block";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

async function deleteProduct(productId) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/products/delete/${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Product deleted successfully");
      loadAdminProducts();
    } else {
      alert(data.error || data.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Something went wrong");
  }
}

function resetForm() {
  productForm.reset();
  productIdInput.value = "";
  formTitle.textContent = "Add New Product";
  saveBtn.textContent = "Add Product";
  cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

async function initAdminProductsPage() {
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  await loadCategories();
  await loadAdminProducts();
}

initAdminProductsPage();
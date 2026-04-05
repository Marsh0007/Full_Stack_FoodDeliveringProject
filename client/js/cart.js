const cartContainer = document.getElementById("cartContainer");
const cartSummary = document.getElementById("cartSummary");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("token");

if (!user || !token) {
  alert("Please login first");
  window.location.href = "login.html";
}

async function loadCart() {
  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/cart/${user.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const cartItems = await response.json();

    cartContainer.innerHTML = "";

    if (!cartItems || cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty-cart-box">
          <div class="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you have not added anything yet. Explore our delicious menu and start your order.</p>
          <a href="products.html" class="btn btn-primary">Browse Products</a>
        </div>
      `;
      cartSummary.style.display = "none";
      return;
    }

    let total = 0;

    cartItems.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <div class="cart-item-image-wrap">
          <img src="${item.image_url || 'https://via.placeholder.com/90'}" alt="${item.product_name}">
        </div>

        <div class="cart-info">
          <div class="cart-info-top">
            <h3>${item.product_name}</h3>
            <span class="cart-price">€${Number(item.price).toFixed(2)}</span>
          </div>

          <div class="cart-meta">
            <p><span>Quantity:</span> ${item.quantity}</p>
            <p><span>Stock:</span> ${item.stock}</p>
            <p><span>Subtotal:</span> €${subtotal.toFixed(2)}</p>
          </div>
        </div>

        <div class="cart-actions">
          <div class="quantity-box">
            <button class="qty-btn" onclick="updateQuantity(${item.cart_item_id}, ${item.quantity - 1})">−</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.cart_item_id}, ${item.quantity + 1})">+</button>
          </div>

          <button class="remove-btn" onclick="removeItem(${item.cart_item_id})">Remove</button>
        </div>
      `;

      cartContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
    cartSummary.style.display = "block";
  } catch (error) {
    console.error("Error loading cart:", error);
    cartContainer.innerHTML = `
      <div class="empty-cart-box">
        <div class="empty-cart-icon">⚠️</div>
        <h2>Failed to load cart</h2>
        <p>Please try again in a moment.</p>
      </div>
    `;
    cartSummary.style.display = "none";
  }
}

async function updateQuantity(cartItemId, newQuantity) {
  if (newQuantity <= 0) {
    await removeItem(cartItemId);
    return;
  }

  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/cart/update/${cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQuantity })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update quantity");
      return;
    }

    loadCart();
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}

async function removeItem(cartItemId) {
  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/cart/remove/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to remove item");
      return;
    }

    loadCart();
  } catch (error) {
    console.error("Error removing item:", error);
  }
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

loadCart();
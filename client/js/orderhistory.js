const ordersContainer = document.getElementById("ordersContainer");

const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("token");

if (!user || !token) {
  alert("Please login first");
  window.location.href = "login.html";
}

async function loadOrderHistory() {
  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/orders/user/${user.user_id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const orders = await response.json();

    ordersContainer.innerHTML = "";

    if (!response.ok) {
      ordersContainer.innerHTML = `<p class="empty-message">${orders.message || "Failed to load orders."}</p>`;
      return;
    }

    if (!orders || orders.length === 0) {
      ordersContainer.innerHTML = `<p class="empty-message">No orders found.</p>`;
      return;
    }

    orders.forEach(order => {
      const orderCard = document.createElement("div");
      orderCard.classList.add("order-card");

      orderCard.innerHTML = `
        <h3>Order #${order.order_id}</h3>
        <p><strong>Total Amount:</strong> €${order.total_amount}</p>
        <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
        <p><strong>Status:</strong> ${order.order_status}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
      `;

      ordersContainer.appendChild(orderCard);
    });

  } catch (error) {
    console.error("Error loading orders:", error);
    ordersContainer.innerHTML = `<p class="empty-message">Failed to load orders.</p>`;
  }
}

loadOrderHistory();
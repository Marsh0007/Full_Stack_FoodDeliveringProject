const ordersContainer = document.getElementById("ordersContainer");
const token = sessionStorage.getItem("token");

async function loadAllOrders() {
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://https://full-stack-fooddeliveringproject.onrender.com/api/orders/all", {
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

      const statusClass = getStatusClass(order.order_status);

      orderCard.innerHTML = `
        <h3>Order #${order.order_id}</h3>

        <p><strong>Customer:</strong> ${order.full_name}</p>

        <p><strong>Total Amount:</strong> 
          <span class="order-price">€${Number(order.total_amount).toFixed(2)}</span>
        </p>

        <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>

        <p>
          <strong>Current Status:</strong> 
          <span class="status-badge ${statusClass}">
            ${order.order_status}
          </span>
        </p>

        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>

        <div class="order-actions">
          <select id="status-${order.order_id}">
            <option value="Pending" ${order.order_status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Confirmed" ${order.order_status === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option value="Preparing" ${order.order_status === "Preparing" ? "selected" : ""}>Preparing</option>
            <option value="Delivered" ${order.order_status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>

          <button onclick="updateStatus(${order.order_id})">
            Update Status
          </button>
        </div>
      `;

      ordersContainer.appendChild(orderCard);
    });

  } catch (error) {
    console.error("Error loading admin orders:", error);
    ordersContainer.innerHTML = `<p class="empty-message">Failed to load orders.</p>`;
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Confirmed":
      return "status-confirmed";
    case "Preparing":
      return "status-preparing";
    case "Delivered":
      return "status-delivered";
    default:
      return "";
  }
}

async function updateStatus(orderId) {
  const select = document.getElementById(`status-${orderId}`);
  const newStatus = select.value;

  try {
    const response = await fetch(`http://https://full-stack-fooddeliveringproject.onrender.com/api/orders/status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        order_status: newStatus
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order status updated successfully");
      loadAllOrders();
    } else {
      alert(data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Something went wrong");
  }
}

loadAllOrders();
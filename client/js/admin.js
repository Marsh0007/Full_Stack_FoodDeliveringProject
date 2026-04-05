const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const deliveredOrders = document.getElementById("deliveredOrders");

async function loadAdminAnalytics() {
  const token = sessionStorage.getItem("token");

  totalProducts.textContent = "0";
  totalOrders.textContent = "0";
  pendingOrders.textContent = "0";
  deliveredOrders.textContent = "0";

  try {
    const productsResponse = await fetch("https://full-stack-fooddeliveringproject.onrender.com/api/products/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (productsResponse.ok) {
      const products = await productsResponse.json();
      totalProducts.textContent = Array.isArray(products) ? products.length : 0;
    } else {
      console.error("Failed to fetch products:", productsResponse.status);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  try {
    const ordersResponse = await fetch("https://full-stack-fooddeliveringproject.onrender.com/api/orders/all", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (ordersResponse.ok) {
      const orders = await ordersResponse.json();
      totalOrders.textContent = Array.isArray(orders) ? orders.length : 0;

      if (Array.isArray(orders)) {
        const pendingCount = orders.filter(
          order => order.order_status === "Pending"
        ).length;

        const deliveredCount = orders.filter(
          order => order.order_status === "Delivered"
        ).length;

        pendingOrders.textContent = pendingCount;
        deliveredOrders.textContent = deliveredCount;
      }
    } else {
      console.error("Failed to fetch orders:", ordersResponse.status);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

loadAdminAnalytics();
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("token");

emailjs.init("kRVeqrx5cAXDTjpHO");

if (!user || !token) {
  alert("Please login first");
  window.location.href = "login.html";
}

async function loadCheckoutTotal() {
  const response = await fetch(`https://full-stack-fooddeliveringproject.onrender.com/api/cart/${user.user_id}`);
  const cartItems = await response.json();

  let total = 0;

  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });

  checkoutTotal.textContent = total.toFixed(2);
}

checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  try {
    const response = await fetch("https://full-stack-fooddeliveringproject.onrender.com/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        user_id: user.user_id,
        delivery_address: address,
        phone: phone,
        payment_method: paymentMethod
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("User object:", user);
      console.log("Sending to email:", user.email);

      try {
        const emailResponse = await emailjs.send("service_2njldxt", "template_nuq3ok7", {
          user_name: user.name || user.username || "Customer",
          user_email: user.email,
          address: address,
          payment_method: paymentMethod
        });

        console.log("Email sent successfully:", emailResponse);
      } catch (error) {
        console.error("Email failed:", error);
      }

      alert("Order placed successfully");
      window.location.href = "orderhistory.html";
    } else {
      alert(data.message || "Failed to place order");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Something went wrong while placing order");
  }
});

loadCheckoutTotal();
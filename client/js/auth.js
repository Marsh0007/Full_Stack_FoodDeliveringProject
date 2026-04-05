const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Register
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name,
          email,
          password,
          phone,
          address
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "User registered successfully");
        window.location.href = "login.html";
      } else {
        alert(data.message || data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Something went wrong during registration");
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        alert(data.message || "Login successful");

        if (data.user.role?.toLowerCase() === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "products.html";
        }
      } else {
        alert(data.message || data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login");
    }
  });
}

// Profile name display
const user = JSON.parse(sessionStorage.getItem("user"));

if (user) {
  const profileName = document.getElementById("profileName");

  if (profileName) {
    profileName.textContent = user.full_name + " ▾";
  }
}
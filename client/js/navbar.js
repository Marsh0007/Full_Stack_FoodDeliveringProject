async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar");

  if (!navbarContainer) return;

  try {
    const response = await fetch("components/navbar.html");
    const data = await response.text();

    navbarContainer.innerHTML = data;

    setupNavbar();
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

function setupNavbar() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const cartLink = document.getElementById("cartLink");
  const adminLink = document.getElementById("adminLink");
  const profilePageLink = document.getElementById("profilePageLink");
  const profileMenu = document.getElementById("profileMenu");
  const profileName = document.getElementById("profileName");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";

    if (profileMenu) profileMenu.style.display = "flex";
    if (profileName) profileName.textContent = `${user.full_name} ▾`;

    if (user.role === "admin") {
      if (cartLink) cartLink.style.display = "none";
      if (adminLink) adminLink.style.display = "block";
      if (profilePageLink) profilePageLink.style.display = "none";

      if (dropdownMenu) {
        dropdownMenu.innerHTML = `
          <a href="adminorders.html">Manage Orders</a>
          <a href="#" id="logoutLink">Logout</a>
        `;
      }
    } else {
      if (cartLink) cartLink.style.display = "block";
      if (adminLink) adminLink.style.display = "none";
      if (profilePageLink) profilePageLink.style.display = "block";

      if (dropdownMenu) {
        dropdownMenu.innerHTML = `
          <a href="orderhistory.html">My Orders</a>
          <a href="#" id="logoutLink">Logout</a>
        `;
      }
    }

    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        logoutUser();
      });
    }
  } else {
    if (profileMenu) profileMenu.style.display = "none";
    if (cartLink) cartLink.style.display = "block";
    if (adminLink) adminLink.style.display = "none";
    if (profilePageLink) profilePageLink.style.display = "none";
  }
}

function logoutUser() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  alert("Logged out successfully");
  window.location.href = "login.html";
}

loadNavbar();
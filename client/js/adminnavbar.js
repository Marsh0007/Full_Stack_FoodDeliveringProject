async function loadAdminNavbar() {
  const navbarContainer = document.getElementById("adminNavbar");

  if (!navbarContainer) return;

  try {
    const response = await fetch("components/adminnavbar.html");
    const data = await response.text();

    navbarContainer.innerHTML = data;

    setupAdminNavbar();
    setActiveAdminLink();
  } catch (error) {
    console.error("Error loading admin navbar:", error);
  }
}

function setupAdminNavbar() {
  const logoutBtn = document.getElementById("adminLogoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      alert("Logged out successfully");
      window.location.href = "login.html";
    });
  }
}

function setActiveAdminLink() {
  const path = window.location.pathname;

  let currentPage = "";

  if (path.includes("admin.html")) {
    currentPage = "dashboard";
  } else if (path.includes("adminproducts.html")) {
    currentPage = "products";
  } else if (path.includes("adminorders.html")) {
    currentPage = "orders";
  }

  const navLinks = document.querySelectorAll(".admin-topbar-right a[data-page]");

  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active-admin-link");
    }
  });
}

loadAdminNavbar();
const user = JSON.parse(sessionStorage.getItem("user"));
const token = sessionStorage.getItem("token");

if (!user || !token) {
  alert("Please login first");
  window.location.href = "login.html";
}

const userId = user.user_id;

const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const displayPhone = document.getElementById("displayPhone");
const displayJoined = document.getElementById("displayJoined");
const displayRole = document.getElementById("displayRole");
const profileAvatar = document.getElementById("profileAvatar");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

const profileMessage = document.getElementById("profileMessage");
const passwordMessage = document.getElementById("passwordMessage");

const toggleEditBtn = document.getElementById("toggleEditBtn");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");

const editProfileCard = document.getElementById("editProfileCard");
const passwordCard = document.getElementById("passwordCard");

const logoutBtn = document.getElementById("logoutBtn");

function formatDate(dateString) {
  if (!dateString) return "Not available";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString();
}

function updateAvatar(name) {
  if (!profileAvatar) return;
  profileAvatar.textContent = name ? name.charAt(0).toUpperCase() : "U";
}

function scrollToSection(section) {
  if (!section) return;
  setTimeout(() => {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 100);
}

function openSection(sectionToOpen) {
  if (!sectionToOpen) return;

  if (sectionToOpen === editProfileCard) {
    passwordCard.classList.add("hidden");

    if (editProfileCard.classList.contains("hidden")) {
      editProfileCard.classList.remove("hidden");
      scrollToSection(editProfileCard);
    } else {
      editProfileCard.classList.add("hidden");
    }
  }

  if (sectionToOpen === passwordCard) {
    editProfileCard.classList.add("hidden");

    if (passwordCard.classList.contains("hidden")) {
      passwordCard.classList.remove("hidden");
      scrollToSection(passwordCard);
    } else {
      passwordCard.classList.add("hidden");
    }
  }
}

async function loadProfile() {
  try {
    const response = await fetch(`https://full-stack-fooddeliveringproject.onrender.com/api/auth/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load profile");
    }

    displayName.textContent = data.full_name || "User Name";
    displayEmail.textContent = data.email || "No email";
    displayPhone.textContent = data.phone || "Not added";
    displayJoined.textContent = formatDate(data.created_at);
    displayRole.textContent = data.role || "customer";

    fullNameInput.value = data.full_name || "";
    emailInput.value = data.email || "";
    phoneInput.value = data.phone || "";
    addressInput.value = data.address || "";

    updateAvatar(data.full_name);
  } catch (error) {
    console.error("Error loading profile:", error);
    profileMessage.textContent = "Failed to load profile information.";
    profileMessage.classList.add("error-message");
  }
}

if (toggleEditBtn) {
  toggleEditBtn.addEventListener("click", () => {
    openSection(editProfileCard);
  });
}

if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    openSection(passwordCard);
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
      user_id: userId,
      full_name: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim()
    };

    try {
      const response = await fetch("https://full-stack-fooddeliveringproject.onrender.com/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      user.full_name = updatedData.full_name;
      user.email = updatedData.email;
      user.phone = updatedData.phone;
      user.address = updatedData.address;
      sessionStorage.setItem("user", JSON.stringify(user));

      displayName.textContent = updatedData.full_name;
      displayEmail.textContent = updatedData.email;
      displayPhone.textContent = updatedData.phone || "Not added";

      updateAvatar(updatedData.full_name);

      profileMessage.textContent = data.message || "Profile updated successfully.";
      profileMessage.classList.remove("error-message");
      profileMessage.classList.add("success-message");
    } catch (error) {
      console.error("Error updating profile:", error);
      profileMessage.textContent = error.message || "Failed to update profile.";
      profileMessage.classList.remove("success-message");
      profileMessage.classList.add("error-message");
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (newPassword !== confirmPassword) {
      passwordMessage.textContent = "New password and confirm password do not match.";
      passwordMessage.classList.remove("success-message");
      passwordMessage.classList.add("error-message");
      return;
    }

    try {
      const response = await fetch("https://full-stack-fooddeliveringproject.onrender.com/api/auth/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      passwordForm.reset();
      passwordMessage.textContent = data.message || "Password updated successfully.";
      passwordMessage.classList.remove("error-message");
      passwordMessage.classList.add("success-message");
    } catch (error) {
      console.error("Error resetting password:", error);
      passwordMessage.textContent = error.message || "Failed to reset password.";
      passwordMessage.classList.remove("success-message");
      passwordMessage.classList.add("error-message");
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.href = "login.html";
  });
}

loadProfile();
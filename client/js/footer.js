async function loadFooter() {
  const footerContainer = document.getElementById("footer");

  if (!footerContainer) return;

  try {
    const response = await fetch("components/footer.html");
    const data = await response.text();

    footerContainer.innerHTML = data;
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

loadFooter();
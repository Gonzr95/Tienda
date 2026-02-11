document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleAside");
  const aside = document.getElementById("aside");
  const marcasBtn = document.getElementById("marcas-btn");

  toggle.addEventListener("click", () => {
    aside.classList.toggle("collapsed");
  });

  marcasBtn.addEventListener("click", () => {
    
});


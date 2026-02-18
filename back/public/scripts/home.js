// traer los controllers de brands
import { renderBrandsSection, fetchBrands } from "./controllers/brands.js";
import { handleProductosClick } from "./controllers/products.js";

const homeBtn = document.getElementById("home-btn");
const productosBtn = document.getElementById("products-btn");
const marcasBtn = document.getElementById("marcas-btn");
const mainContainer = document.getElementById("main-container");

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleAside");
  const aside = document.getElementById("aside");
  
  toggle.addEventListener("click", () => {
    aside.classList.toggle("collapsed");
  });

});


// Esto SI queda en el home porque es inherente a todo el documento 
// Utils para el home
export function setSectionTitle(title, titleId) {
  const sectionTitle = document.getElementById(titleId);
  sectionTitle.textContent = title;
}
export function clearMainContainer() {
  mainContainer.innerHTML = "";
}

/* ***** Manejadores de eventos *******/
marcasBtn.addEventListener("click", () => {
  //cambiar el titulo de la seccion a Marcas
  setSectionTitle("Marcas", "section-title");
  //borrar contenido del main-container
  clearMainContainer();

  const data = fetchBrands(1, 10, "asc").then(data => {
    renderBrandsSection(data, mainContainer);
  });
});


productosBtn.addEventListener("click", handleProductosClick);





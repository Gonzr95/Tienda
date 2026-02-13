// traer los controllers de brands
import { renderBrandsSection, fetchBrands } from "./controllers/brands.js";


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
function setSectionTitle(title, titleId) {
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




/*
function createBrandsHeader() {
  const container = document.createElement("div");
  container.classList.add("brands-header");
  const newBtn = createNewBrandButton();
  container.appendChild(newBtn);

  return container;
}
*/

//************** funciones de brand 
/*
function renderBrandsSection(data) {
  const table = createBrandsTable(data.brands);
  const pagination = createPagination(data.pagination);
  const header = createBrandsHeader();

  mainContainer.appendChild(header);

  mainContainer.appendChild(table);
  mainContainer.appendChild(pagination);
}
  */


// function createNewBrandButton() {
//   const btn = document.createElement("button");
//   btn.textContent = "Nueva Marca";
//   btn.classList.add("btn-primary");

//   btn.addEventListener("click", openCreateBrandModal);

//   return btn;
// }


// function openCreateBrandModal() {
//   const overlay = document.createElement("div");
//   overlay.classList.add("modal-overlay");

//   const modal = document.createElement("div");
//   modal.classList.add("modal");

//   modal.innerHTML = `
//     <h3>Nueva Marca</h3>
//     <input type="text" id="brand-name-input" placeholder="Nombre de la marca" />
//     <div class="modal-actions">
//       <button id="save-brand-btn">Guardar</button>
//       <button id="cancel-brand-btn">Cancelar</button>
//     </div>
//   `;

//   overlay.appendChild(modal);
//   document.body.appendChild(overlay);

//   document
//     .getElementById("save-brand-btn")
//     .addEventListener("click", createBrand);

//   document
//     .getElementById("cancel-brand-btn")
//     .addEventListener("click", () => closeModal(overlay));
// }

/*
async function fetchBrands(page, limit, sort) {
  const response = await fetch(
    `/api/brands?page=${page}&limit=${limit}&sort=${sort}`
  );

  return await response.json();
}
*/

// function createBrandActions(brand) {
//   const container = document.createElement("div");

//   const editBtn = document.createElement("button");
//   editBtn.textContent = "Edit";
//   editBtn.addEventListener("click", () => editBrand(brand.id));

//   const deleteBtn = document.createElement("button");
//   deleteBtn.textContent = "Delete";
//   deleteBtn.addEventListener("click", () => deleteBrand(brand.id));

//   container.appendChild(editBtn);
//   container.appendChild(deleteBtn);

//   return container;
// }



// function createPagination(pagination) {
//   const container = document.createElement("div");
//   container.classList.add("pagination");

//   for (let i = 1; i <= pagination.totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;

//     if (i === pagination.currentPage) {
//       btn.classList.add("active-page");
//     }

//     btn.addEventListener("click", async () => {
//       clearMainContainer();
//       const data = await fetchBrands(i, pagination.itemsPerPage, "asc");
//       renderBrandsSection(data);
//     });

//     container.appendChild(btn);
//   }

//   return container;
// }





// function closeModal(overlay) {
//   overlay.remove();
// }

// async function createBrand() {
//   const input = document.getElementById("brand-name-input");
//   const name = input.value.trim();

//   if (!name) {
//     alert("El nombre es obligatorio");
//     return;
//   }

//   await fetch("/api/brands", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name }),
//   });

//   // cerrar modal
//   document.querySelector(".modal-overlay").remove();

//   // refrescar tabla
//   refreshBrands();
// }

// async function refreshBrands() {
//   clearMainContainer();

//   const data = await fetchBrands(1, 5, "asc");

//   renderBrandsSection(data);
// }






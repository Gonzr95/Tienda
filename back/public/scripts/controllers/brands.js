import { createPagination } from "../utils/pagination.js";
import { clearMainContainer } from "../home.js";






export async function fetchBrands(page, limit, sort) {
  const response = await fetch(
    `/api/brands?page=${page}&limit=${limit}&sort=${sort}`
  );

  return await response.json();
}

function createBrandsTable(brands) {
  const table = document.createElement("table");
  table.classList.add("brands-table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Actions</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  brands.forEach(brand => {
    const row = document.createElement("tr");

    const brandIdTd = document.createElement("td");
    brandIdTd.textContent = brand.id;



    const nameTd = document.createElement("td");
    nameTd.textContent = brand.name;

    const actionsTd = document.createElement("td");
    actionsTd.appendChild(createBrandActions(brand));
    row.appendChild(brandIdTd);
    row.appendChild(nameTd);
    row.appendChild(actionsTd);

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  return table; 
}

//falta hacer controller de deletBrand
function createBrandActions(brand) {
  const container = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editBrand(brand));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteBrand(brand));

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}

function editBrand(brand)
{
  openEditBrandModal(brand);
}

function openEditBrandModal(brand) {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <h3>Editar Marca</h3>
    <input type="text" id="brand-name-input" value="${brand.name}" />
    <div class="modal-actions">
      <button id="update-brand-btn">Actualizar</button>
      <button id="cancel-brand-btn">Cancelar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("update-brand-btn")
    .addEventListener("click", () => updateBrand(brand.id, overlay));

  document
    .getElementById("cancel-brand-btn")
    .addEventListener("click", () => closeModal(overlay));
}

async function updateBrand(id, overlay) {
  const input = document.getElementById("brand-name-input");
  const name = input.value.trim();

  if (!name) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El nombre es obligatorio",
    });
    return;
  }

  const response = await fetch(`/api/brands/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo actualizar la marca",
    });
    return;
  }

  closeModal(overlay);

  Swal.fire({
    icon: "success",
    title: "Actualizado",
    text: "La marca fue actualizada correctamente",
    timer: 1500,
    showConfirmButton: false,
  });

  refreshBrands();
}

async function deleteBrand(brand) {
  const result = await Swal.fire({
    title: "¿Eliminar marca?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  const response = await fetch("/api/brands", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: brand.name, id: brand.id }),
  });

  if (!response.ok) {
    Swal.fire("Error", "No se pudo eliminar la marca", "error");
    return;
  }

  Swal.fire({
    icon: "success",
    title: "Eliminado",
    text: "La marca fue eliminada",
    timer: 1500,
    showConfirmButton: false,
  });

  refreshBrands();
}

async function refreshBrands() {
  clearMainContainer();

  const data = await fetchBrands(1, 5, "asc");

  const mainContainer = document.getElementById("main-container");
  renderBrandsSection(data, mainContainer);
}

 //OK
async function createBrand() {
  const input = document.getElementById("brand-name-input");
  const name = input.value.trim();

  if (!name) {
    alert("El nombre es obligatorio");
    return;
  }

  await fetch("/api/brands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  // cerrar modal
  document.querySelector(".modal-overlay").remove();

  // refrescar tabla
  refreshBrands();
}

//OK
function closeModal(overlay) {
  overlay.remove();
}

//falta close modal
function openCreateBrandModal() {
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `
    <h3>Nueva Marca</h3>
    <input type="text" id="brand-name-input" placeholder="Nombre de la marca" />
    <div class="modal-actions">
      <button id="save-brand-btn">Guardar</button>
      <button id="cancel-brand-btn">Cancelar</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document
    .getElementById("save-brand-btn")
    .addEventListener("click", createBrand);

  document
    .getElementById("cancel-brand-btn")
    .addEventListener("click", () => closeModal(overlay));
}

function createNewBrandButton() {
  const btn = document.createElement("button");
  btn.textContent = "Nueva Marca";
  btn.classList.add("btn-primary");

  btn.addEventListener("click", openCreateBrandModal);

  return btn;
}

//OK
function createBrandsHeader() {
  const container = document.createElement("div");
  container.classList.add("brands-header");
  //const newBtn = createNewBrandButton();
  container.appendChild(createNewBrandButton());

  return container;
}


export function renderBrandsSection(data, container) {
  const table = createBrandsTable(data.brands);
  const pagination = createPagination(data.pagination);
  const header = createBrandsHeader();

  container.appendChild(header);
  container.appendChild(table);
  container.appendChild(pagination);
}
import { createPaginationV2 } from "../utils/pagination.js";
import { clearMainContainer, setSectionTitle } from "../home.js";



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
/**
 * 
 * @returns it only returns div that contains the button to create a brand
 */
function createBrandsHeader() {
  const container = document.createElement("div");
  container.classList.add("brands-header");
  setSectionTitle("Marcas", "section-title");
  container.appendChild(createNewBrandButton());

  return container;
}
function createBrandActions(brand) {
  const container = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => openBrandModal({ mode: "edit", brand }));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteBrand(brand));

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}


// ****** ABM de Marcas *******
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
  //document.querySelector(".modal-overlay").remove();

  // refrescar tabla
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

function closeModal(overlay) {
  overlay.remove();
}

function createNewBrandButton() {
  const btn = document.createElement("button");
  btn.textContent = "Nueva Marca";
  btn.classList.add("btn-primary");

  btn.addEventListener("click", () => openBrandModal({ mode: "create" }));

  return btn;
}



function renderBrandsSection(data, container) {
  clearMainContainer();
  const header = createBrandsHeader();
  const table = createBrandsTable(data.brands);
  const pagination = createPaginationV2(data.pagination, async (page) => {
      clearMainContainer();
      const newData = await fetchBrands(page, data.pagination.itemsPerPage, "asc");
      renderBrandsSection(newData, container);
    });

  container.appendChild(header);
  container.appendChild(table);
  container.appendChild(pagination);
}


export async function handleBrandsClick() {
  const data = fetchBrands(1, 10, "asc").then(data => {
      const mainContainer = document.getElementById("main-container");
      renderBrandsSection(data, mainContainer);
    });
}

function openBrandModal({ mode, brand = null }) {

  const isEdit = mode === "edit";

  const modalHTML = `
    <div class="modal fade" id="brandModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">

          <div class="modal-header">
            <h5 class="modal-title">
              ${isEdit ? "Editar Marca" : "Nueva Marca"}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <input 
              type="text"
              id="brand-name-input"
              class="form-control"
              placeholder="Nombre de la marca"
              value="${isEdit && brand ? brand.name : ""}"
            >
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button class="btn btn-primary" id="save-brand-btn">
              ${isEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("brandModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  document
    .getElementById("save-brand-btn")
    .addEventListener("click", async () => {

      const name = document.getElementById("brand-name-input").value.trim();

      if (!name) {
        Swal.fire("Error", "El nombre es obligatorio", "error");
        return;
      }

      if (isEdit) {
        await updateBrand(brand.id, name);
      } else {
        await createBrand(name);
      }

      modal.hide();
    });

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}
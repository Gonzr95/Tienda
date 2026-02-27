import { createPaginationV2 } from "../utils/pagination.js";
import { clearMainContainer, setSectionTitle } from "../home.js";
import { fetchBrands } from "./brands.js";



export async function fetchProducts(page, limit, sortBy, sortOrder = "asc") {
  const response = await fetch(
  `/api/products?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder || "asc"}`
  );
  return await response.json();
}

function createProductosTable(products) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";
  const table = document.createElement("table");
  table.className = "table table-hover align-middle";
  table.id = "products-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Imagen</th>
        <th>Producto</th>
        <th>Marca</th>
        <th>Linea</th>
        <th>Descripcion</th>
        <th>Activo</th>
        <th>Precio</th>
        <th>Stock</th>
        <th>Acciones</th>
      </tr>
    </thead>
<tbody>
  ${products.map(product => {

    const imageUrl = product.images && product.images.length > 0
      ? `/${product.images[0]}`
      : '/img/no-image.png'; // opcional imagen fallback

    return `
      <tr>
        <td>${product.id}</td>

        <td>
          <img 
            src="${imageUrl}" 
            alt="${product.name}"
            style="max-height:80px; width:auto; object-fit:contain;"
            class="img-fluid rounded"
          >
        </td>

        <td>${product.name}</td>

        <td>${product.brand?.name || 'Sin marca'}</td>

        <td>${product.lineUp || '-'}</td>

        <td>${product.description || '-'}</td>

        <td>
          ${
            product.isActive
              ? '<span class="badge bg-success">Activo</span>'
              : '<span class="badge bg-danger">Inactivo</span>'
          }
        </td>

        <td>$${Number(product.price).toLocaleString()}</td>

        <td>${product.stock}</td>

        <td>
          <button class="btn btn-sm btn-outline-info me-2"
            onclick="viewProduct(${product.id})">
            <i class="bi bi-eye"></i>
          </button>

          <button 
            class="btn btn-sm btn-outline-warning me-2 edit-btn" 
            data-product='${encodeURIComponent(JSON.stringify(product))}'>
            <i 
              class="bi bi-pencil">
            </i>
          </button>

          <button class="btn btn-sm btn-outline-danger"
            onclick="deleteProduct(${product.id})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("")}
</tbody>
`;

  wrapper.appendChild(table);

  return wrapper;
}

function assingnEvents(){
  const table = document.getElementById("products-table");
  table.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (!editBtn) return;

    try {
      const product = JSON.parse(
        decodeURIComponent(editBtn.dataset.product)
        
      )

      openProductModal({
        mode: "edit",
        product
      });

    } catch (error) {
      console.error("Error parseando producto:", error);
    }
  });
}

async function refreshBrands() {
  clearMainContainer();

  const data = await fetchBrands(1, 5, "asc");

  const mainContainer = document.getElementById("main-container");
  renderBrandsSection(data, mainContainer);
}

//OK BIEN, crea header y button de add product
function createProductsHeader() {
const div = document.createElement("div");
  div.className = "d-flex justify-content-between align-items-center mb-4";

  setSectionTitle("Productos", "section-title");

  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.id = "new-product-btn";
  btn.innerHTML = `<i class="bi bi-plus-lg"></i> Nuevo Producto`;

  btn.addEventListener("click", () => openProductModal({ mode: "create" }));
  div.appendChild(btn);

  return div;
}

export function renderProductsSection(data, container) {
  const header = createProductsHeader();
  const table = createProductosTable(data.products);

  const pagination = createPaginationV2(
    data.pagination, (page) => {
      fetchProducts(page, 10, "name", "asc").then(newData => {
        clearMainContainer();
        renderProductsSection(newData, container);
      });
    });

  container.appendChild(header);
  container.appendChild(table);
  assingnEvents();
  container.appendChild(pagination);

  // asignar los eventos
}

export async function handleProductosClick() {
  clearMainContainer();
  const response = await fetchProducts(1, 10, "name", "asc");
  const mainContainer = document.getElementById("main-container");
  renderProductsSection(response, mainContainer);
}

export async function openProductModal({ mode = "create", product = null } = {}) {

  const allBrands = await fetchBrands(0, 'all', 'asc').then(data => data.brands);
  //console.log("Marcas disponibles:", allBrands);
  const modalHTML = buildProductModalHTML({
    mode,
    product,
    brands: allBrands
  });

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modalElement = document.getElementById("productModal");
  const modal = new bootstrap.Modal(modalElement);

  document.getElementById("product-description").value = product ? product.description : "";
  document.getElementById("product-active").checked = product ? product.isActive : true;

  const brandSelect = document.getElementById("brand-select");

brandSelect.innerHTML = allBrands.map(brand => `
    <option value="${brand.id}" 
        ${brand.id === product.brandId ? "selected" : ""}>
        ${brand.name}
    </option>
`).join("");



  modal.show();

  attachProductModalEvents({ modal, mode, product, allBrands });

  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
} 
function buildProductModalHTML({ mode, product, brands }) {

  const isEdit = mode === "edit";
  console.log(product);
  return `
  <div class="modal fade" id="productModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark text-light">

        <div class="modal-header">
          <h5 class="modal-title">
            ${isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">

          <input 
            class="form-control mb-3" 
            id="product-type" 
            placeholder="Tipo (ej: jabón)"
            value="${isEdit ? product.name : ""}"
            >

          <input 
            class="form-control mb-1" 
            id="brand-search" 
            placeholder="Buscar marca..."
            value="${isEdit ? product.brand.name : ""}"
          >

          <select class="form-select mb-3" id="brand-select">
            ${brands.map(b => 
              `<option value="${b.id}">${b.name}</option>`).join("")}
          </select>

          <input class="form-control mb-3" 
          id="product-line" 
          placeholder="Línea"
          value="${isEdit ? product.lineUp : ""}"
          >

          <textarea 
            class="form-control mb-3"
            id="product-description"
            placeholder="Descripción"
            value="${isEdit ? product.description : ""}"
          ></textarea>

          <input class="form-control mb-3" 
          id="product-price" 
          type="number" 
          placeholder="Precio"
          value="${isEdit ? product.price : ""}"
          >


          <input class="form-control mb-3" 
            id="product-stock" 
            type="number" 
            placeholder="Stock" 
            value="${isEdit ? product.stock : ""}">

          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="product-active" checked>
            <label class="form-check-label">Activo</label>
          </div>

          <input class="form-control" type="file" id="product-image">

        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
            Cancelar
          </button>
          <button class="btn btn-primary" id="save-product-btn">
            ${isEdit ? "Actualizar" : "Guardar"}
          </button>
        </div>

      </div>
    </div>
  </div>
  `;
}
function attachProductModalEvents({ modal, allBrands, product }) {

  const brandSearch = document.getElementById("brand-search");
  const brandSelect = document.getElementById("brand-select");
  const saveBtn = document.getElementById("save-product-btn");
  const productInfo = product;

  // 🔎 Filtro frontend
  brandSearch.addEventListener("input", (e) => {

    const term = e.target.value.toLowerCase();

    const filtered = allBrands.filter(b =>
      b.name.toLowerCase().includes(term)
    );

    renderBrandOptions(filtered, brandSelect);
  });

  saveBtn.addEventListener("click", async () => {

    const payload = collectProductFormData();
    payload.id = productInfo.id;
    try {
      if ( modal._element.querySelector(".modal-title").textContent.includes("Editar") ) {
        console.log("es editar");
        console.log("payload a enviar:", payload);
        await updateProduct(payload);
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          text: "El producto fue actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
      } else
      {
        await createProduct(payload);

      }
      modal.hide();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo crear el producto"
      });
    }
  });
}

export async function updateProduct(payload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("brandName", payload.brandName);
  formData.append("lineUp", payload.lineUp);
  formData.append("description", payload.description);
  formData.append("stock", payload.stock);
  formData.append("price", payload.price);
  formData.append("isActive", payload.isActive);
/*
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
  }
*/
//Tratamiento de imagenes
if (payload.images) {
  // Si viene como FileList
  if (payload.images.length !== undefined) {
    for (let i = 0; i < payload.images.length; i++) {
      formData.append("images", payload.images[i]);
    }
  } else {
    // Si es un solo File
    formData.append("images", payload.images);
  }
}
  const response = await fetch(`/api/products/${payload.id}`, {
    method: "PUT",
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error del servidor");
  }
  else{
  Swal.fire({
    icon: "success",
    title: "Eliminado",
    text: "La marca fue eliminada",
    timer: 1500,
    showConfirmButton: false,
  });  }

  return await response.json();
}

export async function createProduct(payload) {

  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("brandName", payload.brandName);
  formData.append("lineUp", payload.lineUp);
  formData.append("description", payload.description);
  formData.append("stock", payload.stock);
  formData.append("price", payload.price);
  formData.append("isActive", payload.isActive);
/*
  for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
  }
*/
//Tratamiento de imagenes
if (payload.images) {
  // Si viene como FileList
  if (payload.images.length !== undefined) {
    for (let i = 0; i < payload.images.length; i++) {
      formData.append("images", payload.images[i]);
    }
  } else {
    // Si es un solo File
    formData.append("images", payload.images);
  }
}
  const response = await fetch("/api/products", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error del servidor");
  }
  else{
  Swal.fire({
    icon: "success",
    title: "Eliminado",
    text: "La marca fue eliminada",
    timer: 1500,
    showConfirmButton: false,
  });  }

  return await response.json();
}

export async function fetchBrandsForSelect(search = "") {

  const response = await fetch(`/api/brands?search=${search}`);
  const data = await response.json();

  return data.data || data;
}

function collectProductFormData() {
  const select = document.getElementById("brand-select");
  const brandName = select.options[select.selectedIndex].text;

  const data = {
    name: document.getElementById("product-type").value.trim(),
    brandName: brandName,
    lineUp: document.getElementById("product-line").value.trim(),
    description: document.getElementById("product-description").value.trim(),
    stock: parseInt(document.getElementById("product-stock").value),
    price: parseFloat(document.getElementById("product-price").value),
    isActive: document.getElementById("product-active").checked,
    images: document.getElementById("product-image").files
    
  };

  return data;


}








function renderBrandOptions(brands, selectElement) {

  selectElement.innerHTML = brands
    .map(b => `<option value="${b.id}">${b.name}</option>`)
    .join("");
}
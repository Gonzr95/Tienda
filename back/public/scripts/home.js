document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleAside");
  const aside = document.getElementById("aside");
  const marcasBtn = document.getElementById("marcas-btn");
  const mainContainer = document.getElementById("main-container");

  toggle.addEventListener("click", () => {
    aside.classList.toggle("collapsed");
  });

  marcasBtn.addEventListener("click", () => {
    //cambiar el titulo de la seccion a Marcas
    setSectionTitle("Marcas", "section-title");
    //borrar contenido del main-container
    clearMainContainer();



    //hacer un fetch a /marcas y mostrar las marcas en el main-container
    //funcion para crear la tabla
    //funcion para crear botones de editar, eliminar y agregar
    //funcion para crear los botones de paginacion

  });
});






// **************************** 
function setSectionTitle(title, titleId) {
  const sectionTitle = document.getElementById(titleId);
  sectionTitle.textContent = title;
}

function clearMainContainer() {
  mainContainer.innerHTML = "";
}


//************** funciones de brand 
function renderBrandsSection(data) {
  const table = createBrandsTable(data.brands);
  const pagination = createPagination(data.pagination);

  mainContainer.appendChild(table);
  mainContainer.appendChild(pagination);
}

async function fetchBrands(page, limit, sort) {
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
      <th>Name</th>
      <th>Actions</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  brands.forEach(brand => {
    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = brand.name;

    const actionsTd = document.createElement("td");
    actionsTd.appendChild(createBrandActions(brand));

    row.appendChild(nameTd);
    row.appendChild(actionsTd);

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  return table;
}

function createBrandActions(brand) {
  const container = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editBrand(brand.id));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteBrand(brand.id));

  container.appendChild(editBtn);
  container.appendChild(deleteBtn);

  return container;
}

function createPagination(pagination) {
  const container = document.createElement("div");
  container.classList.add("pagination");

  for (let i = 1; i <= pagination.totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === pagination.currentPage) {
      btn.classList.add("active-page");
    }

    btn.addEventListener("click", async () => {
      clearMainContainer();
      const data = await fetchBrands(i, pagination.itemsPerPage, "asc");
      renderBrandsSection(data);
    });

    container.appendChild(btn);
  }

  return container;
}
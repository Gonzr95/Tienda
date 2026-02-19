import { clearMainContainer } from "../home.js";
import { fetchBrands, renderBrandsSection} from "../controllers/brands.js"; 

export function createPagination(pagination) {
  const container = document.createElement("div");
  container.classList.add("pagination");

  for (let i = 1; i <= pagination.totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === pagination.currentPage) {
      btn.classList.add("active-page");
    }

    btn.addEventListener("click", async () => {
      const mainContainer = document.getElementById("main-container");
      clearMainContainer(mainContainer);
      const data = await fetchBrands(i, pagination.itemsPerPage, "asc");
      renderBrandsSection(data, mainContainer);
    });

    container.appendChild(btn);
  }

  return container;
}

export function createPaginationV2(pagination, onPageChange) {
  const container = document.createElement("div");
  container.classList.add("pagination");

  for (let i = 1; i <= pagination.totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === pagination.currentPage) {
      btn.classList.add("active-page");
    }

    btn.addEventListener("click", () => {
      onPageChange(i);
    });

    container.appendChild(btn);
  }

  return container;
}
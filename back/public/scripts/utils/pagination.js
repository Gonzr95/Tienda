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
      if( i !== pagination.currentPage) {
        onPageChange(i);
      }
    });

    container.appendChild(btn);
  }

  return container;
}
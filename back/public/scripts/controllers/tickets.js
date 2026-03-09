import { createPaginationV2 } from "../utils/pagination.js";
import { clearMainContainer, setSectionTitle } from "../home.js";

export async function fetchTickets(page, limit, sortBy, sortOrder = "asc") {
  const response = await fetch(
  `/api/tickets?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
  return await response.json();
}

export async function handleTicketsClick() {
  clearMainContainer();
  const response = await fetchTickets(1, 10, "name", "desc");
   const mainContainer = document.getElementById("main-container");
//   renderProductsSection(response, mainContainer);
}

function renderTicketsSection(ticketsData, container) {
  setSectionTitle("Tickets", "sectionTitle");

  const tableHead = createtableHead();

};

function createTableHead() {
  

};
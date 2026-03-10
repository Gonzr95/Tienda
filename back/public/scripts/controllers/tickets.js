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
  const response = await fetchTickets(1, 10, "name", "asc");
  const mainContainer = document.getElementById("main-container");
  renderTicketsSection(response, mainContainer);
}

function renderTicketsSection(ticketsData, container) {
  setSectionTitle("Pedidos", "section-title");

  createTableHead(container);
  createTableBody(ticketsData.tickets, container);


};

// Crea el encabezado de la tabla y lo inserta en el main container de la seccion
function createTableHead(container) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";
  const table = document.createElement("table");
  table.className = "table table-hover align-middle";
  table.id = "products-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Estado</th>
        <th>Comentario</th>
        <th>Total</th>
        <th>Acciones</th>
      </tr>
    </thead>
  `;
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

function createTableBody(ticketsData, container) {
  const tbody = document.createElement("tbody");
  ticketsData.forEach(ticket => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${ticket.id}</td>
      <td>${new Date(ticket.createdAt).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })}</td>
      <td>${ticket.customerName} ${ticket.customerLastName}</td>
      <td>${ticket.status}</td>
      <td>${ticket.comentario || "Sin comentario"}</td>
      <td>$${ticket.total}</td>
      <td>

        <button class="btn btn-sm btn-outline-info me-2 view-btn"
          data-product='${encodeURIComponent(JSON.stringify(ticket.products))}'>
          <i class="bi bi-eye"></i>
        </button>

        <button 
          class="btn btn-sm btn-outline-warning me-2 edit-btn" 
          data-ticket='${encodeURIComponent(JSON.stringify(ticket))}'>
          <i class="bi bi-pencil">
          </i>
        </button>

    `;
    tbody.appendChild(tr);
    container.querySelector("table").appendChild(tbody);

  });
  assignViewEvents();
  assignEditEvents();
  

}


/* ******VIEW FUNCTIONS*******/
function assignViewEvents() {

  console.log("Asignando eventos de vista a los botones...");
  const viewButtons = document.querySelectorAll(".view-btn");

  viewButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productsData = JSON.parse(
        decodeURIComponent(button.getAttribute("data-product")));
      openViewModal(productsData);

    });

  });

}

function openViewModal(products) {

  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = createViewModal(products, overlay);

  overlay.appendChild(modal);

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

}

function createViewModal(products, overlay) {

  const modal = document.createElement("div");
  modal.classList.add("products-modal");

  const rows = products.map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.brand ?? "-"}</td>
      <td>${p.lineUp}</td>
      <td>${p.description}</td>
      <td>$${p.price}</td>
      <td>${p.quantity}</td>
    </tr>
  `).join("");

  modal.innerHTML = `
    <div class="modal-header">
      <h3>Productos del pedido</h3>
      <button class="modal-close">✖</button>
    </div>

    <table class="modal-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Marca</th>
          <th>Línea</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  modal.hide

  return modal;
}


/* ******edit FUNCTIONS*******/

function assignEditEvents() {
  const viewButtons = document.querySelectorAll(".edit-btn");

  viewButtons.forEach(button => {
    button.addEventListener("click", () => {
      const ticketData = JSON.parse(
        decodeURIComponent(button.getAttribute("data-ticket")));
      openEditModal(ticketData);

    });
  });
}

function openEditModal(ticket) {

  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");

  const modal = createEditModal(ticket, overlay);

  overlay.appendChild(modal);

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

}

function createEditModal(ticket, overlay) {

  const modal = document.createElement("div");
  modal.classList.add("products-modal");

  const statusOptions = [
            "pendiente",
            "en revision",
            "aguardando pago",
            "confirmada",
            "cancelada",
            "finalizada exitosamente"];

  const statusDropdown = statusOptions.map(status => `
    <option value="${status}" ${ticket.status === status ? "selected" : ""}>
      ${status}
    </option>
  `).join("");

  modal.innerHTML = `
    <div class="modal-header">
      <h3>Editar pedido #${ticket.id}</h3>
      <small>Cliente: ${ticket.customerName} ${ticket.customerLastName}</small>
      <button class="modal-close">✖</button>
    </div>

    <div class="ticket-edit-section">
      <label>Estado del pedido</label>
      <select class="ticket-status">
        ${statusDropdown}
      </select>
    </div>

    <div class="ticket-edit-section">
      <label>Comentario</label>
      <textarea class="ticket-comment" placeholder="Agregar comentario...">${ticket.comentario ?? ""}</textarea>
    </div>

    <div class="modal-actions">
      <button class="save-ticket-btn">Guardar cambios</button>
    </div>
  `;

  // cerrar modal
  modal.querySelector(".modal-close").addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.remove();
  });



  modal.querySelector(".save-ticket-btn").addEventListener("click", async () => {

  const payload = collectTicketEditData(modal, ticket.id);
  const updatedTicket = await saveTicketChanges(ticket.id, payload);

  if (updatedTicket) {
    overlay.remove();
    // refrescar lista de tickets
    //loadTickets();
    alert("Cambios guardados exitosamente, desarrolla funcion de refrescar");

  }

});



  return modal;
}


/* ******SAVE FUNCTIONS*******/

function collectTicketEditData(modal) {

  const status = modal.querySelector(".ticket-status").value;

  const comentario = modal.querySelector(".ticket-comment").value.trim();

  return {
    status,
    comentario
  };
}


async function saveTicketChanges(ticketId, payload) {

  try {

    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el ticket");
    }

    const data = await response.json();

    console.log("Ticket actualizado:", data);

    return data;

  } catch (error) {

    console.error(error);
    alert("No se pudo actualizar el ticket");

  }

}
// DATA
const landlordsData = [
  { business:"Dela Cruz Properties",  businessAddress:"Zone 1, Canelar, Zamboanga City",        businessNumber:"09123456789", owner:"Juan Dela Cruz",     idType:"Driver's License", idNumber:"DL-234123", businessPermit:"Permit_DelaCruz.pdf",   dorms:3, email:"juan.delacruz@example.com",     status:"Pending" },
  { business:"Santos Housing",         businessAddress:"Baliwasan, Zamboanga City",               businessNumber:"09988765432", owner:"Maria Santos",        idType:"Passport",         idNumber:"P-998123",  businessPermit:"Permit_Santos.pdf",      dorms:2, email:"maria.santos@example.com",       status:"Pending" },
  { business:"Reyes Dormitory",        businessAddress:"Tetuan, Zamboanga City",                  businessNumber:"09171234567", owner:"Pedro Reyes",         idType:"SSS ID",           idNumber:"SS-123456", businessPermit:"Permit_Reyes.pdf",        dorms:4, email:"pedro.reyes@example.com",         status:"Pending" },
  { business:"Gonzales Residences",    businessAddress:"San Roque, Zamboanga City",               businessNumber:"09279876543", owner:"Ana Gonzales",        idType:"PhilHealth ID",    idNumber:"PH-654321", businessPermit:"Permit_Gonzales.pdf",     dorms:1, email:"ana.gonzales@example.com",        status:"Pending" },
  { business:"Villanueva Homes",       businessAddress:"Putik, Zamboanga City",                   businessNumber:"09351122334", owner:"Carlos Villanueva",   idType:"Voter's ID",       idNumber:"VI-789012", businessPermit:"Permit_Villanueva.pdf",   dorms:5, email:"carlos.villanueva@example.com",   status:"Pending" },
  { business:"Flores Boarding House",  businessAddress:"Camino Nuevo, Zamboanga City",            businessNumber:"09462233445", owner:"Luisa Flores",        idType:"Driver's License", idNumber:"DL-345678", businessPermit:"Permit_Flores.pdf",       dorms:2, email:"luisa.flores@example.com",        status:"Pending" },
  { business:"Cruz Properties",        businessAddress:"Guiwan, Zamboanga City",                  businessNumber:"09573344556", owner:"Roberto Cruz",        idType:"Passport",         idNumber:"P-456789",  businessPermit:"Permit_Cruz.pdf",         dorms:3, email:"roberto.cruz@example.com",         status:"Pending" },
  { business:"Morales Lodging",        businessAddress:"Talon-Talon, Zamboanga City",             businessNumber:"09684455667", owner:"Elena Morales",       idType:"SSS ID",           idNumber:"SS-567890", businessPermit:"Permit_Morales.pdf",      dorms:2, email:"elena.morales@example.com",       status:"Pending" },
  { business:"Torres Boarding",        businessAddress:"Mampang, Zamboanga City",                 businessNumber:"09175566778", owner:"Jose Torres",         idType:"PhilHealth ID",    idNumber:"PH-678901", businessPermit:"Permit_Torres.pdf",        dorms:6, email:"jose.torres@example.com",          status:"Pending" },
  { business:"Ramirez Residences",     businessAddress:"Culianan, Zamboanga City",                businessNumber:"09286677889", owner:"Carmen Ramirez",      idType:"Voter's ID",       idNumber:"VI-789123", businessPermit:"Permit_Ramirez.pdf",      dorms:1, email:"carmen.ramirez@example.com",      status:"Pending" },
  { business:"Garcia Dorm",            businessAddress:"Divisoria, Zamboanga City",               businessNumber:"09397788990", owner:"Fernando Garcia",     idType:"Driver's License", idNumber:"DL-890234", businessPermit:"Permit_Garcia.pdf",        dorms:4, email:"fernando.garcia@example.com",      status:"Pending" },
  { business:"Hernandez Haven",        businessAddress:"Recodo, Zamboanga City",                  businessNumber:"09458899001", owner:"Nora Hernandez",      idType:"Passport",         idNumber:"P-901345",  businessPermit:"Permit_Hernandez.pdf",     dorms:2, email:"nora.hernandez@example.com",       status:"Pending" },
  { business:"Aquino Properties",      businessAddress:"Ayala, Zamboanga City",                   businessNumber:"09569910112", owner:"Benjamin Aquino",     idType:"SSS ID",           idNumber:"SS-012456", businessPermit:"Permit_Aquino.pdf",        dorms:3, email:"benjamin.aquino@example.com",      status:"Pending" },
  { business:"Bautista Lodging",       businessAddress:"Vitali, Zamboanga City",                  businessNumber:"09171021223", owner:"Rosario Bautista",    idType:"PhilHealth ID",    idNumber:"PH-123567", businessPermit:"Permit_Bautista.pdf",      dorms:2, email:"rosario.bautista@example.com",     status:"Pending" },
  { business:"Domingo Dwellings",      businessAddress:"Calarian, Zamboanga City",                businessNumber:"09282132334", owner:"Andres Domingo",      idType:"Voter's ID",       idNumber:"VI-234678", businessPermit:"Permit_Domingo.pdf",       dorms:5, email:"andres.domingo@example.com",       status:"Pending" },
  { business:"Pascual Properties",     businessAddress:"Lunzuran, Zamboanga City",                businessNumber:"09393243445", owner:"Gloria Pascual",      idType:"Driver's License", idNumber:"DL-345789", businessPermit:"Permit_Pascual.pdf",       dorms:1, email:"gloria.pascual@example.com",       status:"Pending" },
  { business:"Mendoza Manor",          businessAddress:"San Jose Cawa-Cawa, Zamboanga City",      businessNumber:"09404354556", owner:"Eduardo Mendoza",     idType:"Passport",         idNumber:"P-456890",  businessPermit:"Permit_Mendoza.pdf",       dorms:3, email:"eduardo.mendoza@example.com",      status:"Pending" },
  { business:"Aguilar Apartments",     businessAddress:"Tumaga, Zamboanga City",                  businessNumber:"09515465667", owner:"Concepcion Aguilar",  idType:"SSS ID",           idNumber:"SS-567901", businessPermit:"Permit_Aguilar.pdf",       dorms:4, email:"concepcion.aguilar@example.com",   status:"Pending" },
  { business:"Vargas Villas",          businessAddress:"Pasonanca, Zamboanga City",               businessNumber:"09626576778", owner:"Ignacio Vargas",      idType:"PhilHealth ID",    idNumber:"PH-678912", businessPermit:"Permit_Vargas.pdf",        dorms:2, email:"ignacio.vargas@example.com",       status:"Pending" },
  { business:"Castillo Casa",          businessAddress:"Rio Hondo, Zamboanga City",               businessNumber:"09737687889", owner:"Felicidad Castillo",  idType:"Voter's ID",       idNumber:"VI-789234", businessPermit:"Permit_Castillo.pdf",      dorms:3, email:"felicidad.castillo@example.com",   status:"Pending" },
  { business:"Navarro Nook",           businessAddress:"Zone 3, Zamboanga City",                  businessNumber:"09848798990", owner:"Arsenio Navarro",     idType:"Driver's License", idNumber:"DL-890345", businessPermit:"Permit_Navarro.pdf",       dorms:1, email:"arsenio.navarro@example.com",      status:"Pending" },
  { business:"Ramos Rooms",            businessAddress:"Sta. Catalina, Zamboanga City",           businessNumber:"09959809001", owner:"Milagros Ramos",      idType:"Passport",         idNumber:"P-901456",  businessPermit:"Permit_Ramos.pdf",         dorms:2, email:"milagros.ramos@example.com",       status:"Pending" },
];

const historyData = [];
const PAGE_SIZE = 8;
let currentPage = 1;
let filteredData = [...landlordsData];

// ── REALISTIC PHOTO SOURCES ───────────────────────────────────────
const dormPhotoSeeds = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=640&h=360&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=640&h=360&fit=crop",
];

const ownerPhotoSeeds = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1546961342-ea5f60b193cb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1558898479-33c0457a5516?w=400&h=400&fit=crop&crop=face",
];

function getDormPhotoUrl(index) {
  return dormPhotoSeeds[index % dormPhotoSeeds.length];
}

function getOwnerPhotoUrl(index) {
  return ownerPhotoSeeds[index % ownerPhotoSeeds.length];
}

// ── IMAGE HTML HELPERS ────────────────────────────────────────────
function dormImgHTML(index) {
  const url = getDormPhotoUrl(index);
  return `<img
    src="${url}"
    alt="Dormitory building"
    style="width:100%;height:100%;object-fit:cover;display:block;"
    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
  /><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:var(--surface2);color:var(--text-muted);font-size:12px;">Photo unavailable</div>`;
}

function ownerImgHTML(index, name) {
  const url = getOwnerPhotoUrl(index);
  const initials = name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return `<img
    src="${url}"
    alt="Photo of ${name}"
    style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"
    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
  /><div style="display:none;width:100%;height:100%;align-items:center;justify-content:center;background:var(--accent-light);color:var(--accent);font-size:28px;font-weight:700;font-family:var(--font);">${initials}</div>`;
}

// ── TAB SWITCHING ─────────────────────────────────────────────────
document.querySelectorAll(".tabs__tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tabs__tab").forEach(t => t.classList.remove("tabs__tab--active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("tab-content--active"));
    tab.classList.add("tabs__tab--active");
    document.getElementById(tab.dataset.tab).classList.add("tab-content--active");
  });
});

// ── SEARCH ────────────────────────────────────────────────────────
document.getElementById("landlord-search").addEventListener("input", function () {
  const q = this.value.toLowerCase().trim();
  filteredData = landlordsData.filter(u =>
    u.business.toLowerCase().includes(q) ||
    u.owner.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.businessAddress.toLowerCase().includes(q) ||
    u.status.toLowerCase().includes(q)
  );
  currentPage = 1;
  renderLandlords();
});

// ── RENDER LANDLORDS ──────────────────────────────────────────────
function renderLandlords() {
  const tbody = document.getElementById("landlord-table-body");
  tbody.innerHTML = "";

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredData.slice(start, start + PAGE_SIZE);

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="16" cy="16" r="11" stroke="currentColor" stroke-width="1.5"/>
            <path d="M24 24L33 33" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M11 16h10M16 11v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="empty-state__text">No landlords found</div>
      </div>
    </td></tr>`;
  } else {
    pageItems.forEach(u => {
      const globalIndex = landlordsData.indexOf(u);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${u.business}</strong></td>
        <td>${u.owner}</td>
        <td style="text-align:center">${u.dorms}</td>
        <td style="color:var(--text-muted);font-size:13px">${u.email}</td>
        <td><span class="status status--${u.status.toLowerCase()}">${u.status}</span></td>
        <td><button class="btn-view" onclick="openLandlordForm(${globalIndex})">View</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("landlord-count").textContent = filteredData.length + " landlords";
  renderPagination(totalPages);
}

// ── PAGINATION ────────────────────────────────────────────────────
function renderPagination(totalPages) {
  const wrap = document.getElementById("landlord-pagination");
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, filteredData.length);
  const info = filteredData.length === 0 ? "No results" : `Showing ${start}–${end} of ${filteredData.length}`;
  wrap.innerHTML = `<span class="pagination__info">${info}</span>`;

  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.textContent = "←";
  prev.disabled = currentPage === 1;
  prev.onclick = () => { currentPage--; renderLandlords(); };
  wrap.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = (function (p) { return () => { currentPage = p; renderLandlords(); }; })(i);
    wrap.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = "→";
  next.disabled = currentPage === totalPages;
  next.onclick = () => { currentPage++; renderLandlords(); };
  wrap.appendChild(next);
}

// ── MODAL ─────────────────────────────────────────────────────────
function openLandlordForm(index) {
  const u = landlordsData[index];

  const fileIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="flex-shrink:0">
    <rect x="2" y="1" width="8" height="11" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
    <path d="M4 4.5h4M4 7h4M4 9.5h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M8 1v3h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-header">
        <h2>Landlord Review</h2>
        <button class="modal-close" id="modal-close-btn">&#x2715;</button>
      </div>

      <div class="modal-images">
        <div class="modal-img-block">
          <div class="modal-img-label">Dormitory Photo</div>
          <div class="modal-img-wrap" style="overflow:hidden;">${dormImgHTML(index)}</div>
        </div>
        <div class="modal-img-block">
          <div class="modal-img-label">Owner Photo</div>
          <div class="modal-img-wrap modal-img-wrap--owner" style="overflow:hidden;">${ownerImgHTML(index, u.owner)}</div>
        </div>
      </div>

      <div class="modal-body">
        <div class="modal-field">
          <div class="modal-field__label">Business Name</div>
          <div class="modal-field__value">${u.business}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field__label">Business Address</div>
          <div class="modal-field__value">${u.businessAddress}</div>
        </div>
        <div class="modal-grid">
          <div class="modal-field">
            <div class="modal-field__label">Contact Number</div>
            <div class="modal-field__value">${u.businessNumber}</div>
          </div>
          <div class="modal-field">
            <div class="modal-field__label">Dormitories Owned</div>
            <div class="modal-field__value">${u.dorms}</div>
          </div>
        </div>
        <div class="modal-grid">
          <div class="modal-field">
            <div class="modal-field__label">ID Type</div>
            <div class="modal-field__value">${u.idType}</div>
          </div>
          <div class="modal-field">
            <div class="modal-field__label">ID Number</div>
            <div class="modal-field__value" style="font-family:var(--mono)">${u.idNumber}</div>
          </div>
        </div>
        <div class="modal-field">
          <div class="modal-field__label">Business Permit</div>
          <div class="modal-field__value modal-field__value--file">${fileIcon} ${u.businessPermit}</div>
        </div>
        <div class="modal-field">
          <div class="modal-field__label">Email</div>
          <div class="modal-field__value">${u.email}</div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="decline-btn" id="modal-decline">Decline</button>
        <button class="approve-btn" id="modal-approve">Approve</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#modal-close-btn").onclick = () => document.body.removeChild(modal);
  modal.addEventListener("click", e => { if (e.target === modal) document.body.removeChild(modal); });

  modal.querySelector("#modal-approve").onclick = () => {
    u.status = "Approved";
    historyData.push({ name: u.owner, type: "Landlord", status: "Approved", date: new Date().toLocaleString() });
    document.body.removeChild(modal);
    renderLandlords(); renderOverview();
    showToast(`${u.owner} approved successfully`, "success");
  };

  modal.querySelector("#modal-decline").onclick = () => {
    u.status = "Declined";
    historyData.push({ name: u.owner, type: "Landlord", status: "Declined", date: new Date().toLocaleString() });
    document.body.removeChild(modal);
    renderLandlords(); renderOverview();
    showToast(`${u.owner} declined`, "error");
  };
}

// ── OVERVIEW ──────────────────────────────────────────────────────
function renderOverview() {
  const approved = landlordsData.filter(u => u.status === "Approved").length;
  const declined = landlordsData.filter(u => u.status === "Declined").length;

  document.querySelector("#card-total .card__num").textContent     = landlordsData.length;
  document.querySelector("#card-landlords .card__num").textContent  = landlordsData.length;
  document.querySelector("#card-approved .card__num").textContent   = approved;
  document.querySelector("#card-declined .card__num").textContent   = declined;

  const tbody = document.getElementById("history-table-body");
  tbody.innerHTML = "";

  if (historyData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="6" y="4" width="24" height="28" rx="3" stroke="currentColor" stroke-width="1.5" opacity=".3"/>
            <path d="M12 12h12M12 17h12M12 22h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".3"/>
          </svg>
        </div>
        <div class="empty-state__text">No activity yet</div>
      </div>
    </td></tr>`;
  } else {
    historyData.slice().reverse().forEach(h => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${h.name}</td>
        <td>${h.type}</td>
        <td><span class="status status--${h.status.toLowerCase()}">${h.status}</span></td>
        <td style="color:var(--text-muted);font-size:12.5px">${h.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("history-count").textContent = historyData.length + " records";
}

// ── TOAST ─────────────────────────────────────────────────────────
function showToast(msg, type = "success") {
  const checkIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#fff" stroke-width="1.2"/><path d="M4 7l2 2 4-4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const crossIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#fff" stroke-width="1.2"/><path d="M5 5l4 4M9 5l-4 4" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  const t = document.createElement("div");
  t.className = `toast toast--${type}`;
  t.innerHTML = (type === "success" ? checkIcon : crossIcon) + `<span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0"; t.style.transition = "opacity .3s";
    setTimeout(() => document.body.removeChild(t), 300);
  }, 2800);
}

// ── INIT ──────────────────────────────────────────────────────────
renderLandlords();
renderOverview();
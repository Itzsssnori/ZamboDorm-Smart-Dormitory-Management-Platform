// Generic function to open modal by ID
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

// Generic function to close modal by ID
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Open the "View Details" modal with dynamic data
function openView(name, business, email, phone, dorms, date, documents) {
  document.getElementById("viewName").innerText = name;
  document.getElementById("viewBusiness").innerText = business;
  document.getElementById("viewEmail").innerText = email;
  document.getElementById("viewPhone").innerText = phone;
  document.getElementById("viewDorms").innerText = dorms;
  document.getElementById("viewDate").innerText = date;

  let docList = document.getElementById("viewDocs");
  docList.innerHTML = "";
  documents.forEach(doc => {
    let li = document.createElement("li");
    li.textContent = "✔ " + doc;
    docList.appendChild(li);
  });

  openModal("viewModal");
}

function closeView() {
  closeModal("viewModal");
}

// Open the comment modal with the name of applicant
function openComment(name) {
  document.getElementById("commentName").innerText = name;
  openModal("commentModal");
}

function closeComment() {
  closeModal("commentModal");
}

// Close modals when clicking outside the modal content
window.onclick = function(e) {
  const modals = ["viewModal", "commentModal"];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (e.target === modal) modal.style.display = "none";
  });
};

// Close modals on ESC key press
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    closeView();
    closeComment();
  }
});
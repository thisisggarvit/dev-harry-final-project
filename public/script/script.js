// ===== Auth / User =====
const token = localStorage.getItem("token");
const API = {
  items: "/api/items",
  me: "/api/auth/me"
};

function requireAuth() {
  if (!token && document.body.id === "index") {
    window.location.href = "/auth.html";
  }
}
requireAuth();

async function authFetch(url, options = {}) {
  if (!token) throw new Error("Not authenticated");
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || res.statusText);
  }
  return res.json();
}

(async function greet() {
  if (document.body.id !== "index") return;
  try {
    const me = await authFetch(API.me);
    const hello = document.getElementById("helloUser");
    if (hello) hello.textContent = `Hi, ${me.username}!`;
  } catch {}
})();

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/auth.html";
});

// ===== State =====
let allItems = [];
let editingId = null;

// ===== Load & Render =====
async function loadItems() {
  try {
    allItems = await authFetch(API.items);
    renderItems();
  } catch (e) {
    console.error(e);
    if (String(e).includes("401")) window.location.href = "/auth.html";
  }
}

function renderItems() {
  const list = document.getElementById("itemsList");
  if (!list) return;
  list.innerHTML = "";

  const q = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const cat = document.getElementById("categoryFilter")?.value || "";
  const store = document.getElementById("storeFilter")?.value || "";

  const filtered = allItems.filter(i => {
    const matchQ = !q || [i.itemName, i.category, i.store].some(v => String(v).toLowerCase().includes(q));
    const matchC = !cat || i.category === cat;
    const matchS = !store || i.store === store;
    return matchQ && matchC && matchS;
  });

  if (!filtered.length) {
    list.innerHTML = `<p>No items match your filters.</p>`;
    return;
  }

  for (const i of filtered) {
    const el = document.createElement("div");
    el.className = "item-card";
    el.innerHTML = `
      <div class="item-head">
        <div class="item-title">${escapeHtml(i.itemName)}</div>
        <span class="badge">${escapeHtml(i.category)}</span>
      </div>
      <div class="item-meta">
        <div><strong>Qty:</strong> ${i.quantity}</div>
        <div><strong>Store:</strong> ${escapeHtml(i.store)}</div>
        <div><strong>Pickup:</strong> ${escapeHtml(i.pickupDate)} @ ${escapeHtml(i.pickupTime)}</div>
        <div><strong>Priority:</strong> ${i.highPriority ? "High" : "Normal"}</div>
      </div>
      <div class="actions">
        <button class="btn warn" data-edit="${i._id}">Edit</button>
        <button class="btn danger" data-del="${i._id}">Delete</button>
      </div>
    `;
    list.appendChild(el);
  }
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))}

// ===== Filters =====
document.getElementById("searchInput")?.addEventListener("input", renderItems);
document.getElementById("categoryFilter")?.addEventListener("change", renderItems);
document.getElementById("storeFilter")?.addEventListener("change", renderItems);

// ===== Create =====
document.getElementById("addForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  data.quantity = Number(data.quantity);
  data.highPriority = !!data.highPriority;

  try {
    await authFetch(API.items, { method: "POST", body: JSON.stringify(data) });
    e.target.reset();
    await loadItems();
  } catch (err) {
    alert("Failed to add item");
    console.error(err);
  }
});

// ===== Edit / Delete (delegation) =====
document.getElementById("itemsList")?.addEventListener("click", (e) => {
  const editId = e.target.getAttribute("data-edit");
  const delId  = e.target.getAttribute("data-del");

  if (editId) openEdit(editId);
  if (delId)  confirmDelete(delId);
});

function confirmDelete(id){
  if(!confirm("Delete this item?")) return;
  authFetch(`${API.items}/${id}`, { method: "DELETE" })
    .then(loadItems)
    .catch(e=>console.error(e));
}

// ===== Edit Modal =====
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const editForm = document.getElementById("editForm");

function openEdit(id){
  const item = allItems.find(x=>x._id===id);
  if(!item) return;
  editingId = id;

  for (const [k,v] of Object.entries(item)) {
    const input = editForm.elements.namedItem(k);
    if (!input) continue;
    if (input.type === "checkbox") input.checked = !!v;
    else input.value = v;
  }

  modal.classList.remove("hidden");
}

modalClose?.addEventListener("click", ()=> modal.classList.add("hidden"));
modal?.addEventListener("click", (e)=>{ if(e.target===modal) modal.classList.add("hidden"); });

editForm?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  if(!editingId) return;
  const body = Object.fromEntries(new FormData(e.target).entries());
  body.quantity = Number(body.quantity);
  body.highPriority = !!body.highPriority;

  try{
    await authFetch(`${API.items}/${editingId}`, { method:"PUT", body: JSON.stringify(body) });
    modal.classList.add("hidden");
    editingId = null;
    await loadItems();
  }catch(err){
    alert("Failed to update item");
    console.error(err);
  }
});

// ===== Init =====
if (document.body.id === "index") loadItems();

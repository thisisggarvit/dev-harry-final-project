// === Edit Plan support ===
let editingId = null;

// Save / Update Plan
document.getElementById('grocery-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Gather inputs
    const itemName     = document.getElementById('item-name').value.trim();
    const quantity     = document.getElementById('quantity').value.trim();
    const category     = document.getElementById('category').value;
    const store        = document.getElementById('store').value;
    const pickupDate   = document.getElementById('pickup-date').value;
    const pickupTime   = document.getElementById('pickup-time').value;
    const highPriority = document.getElementById('high-priority').checked;

    // Validate
    if (!itemName || !quantity || !category || !store || !pickupDate || !pickupTime) {
        alert('Please fill out all fields!');
        return;
    }

    const plans = JSON.parse(localStorage.getItem('plans')) || [];

    if (editingId) {
        // Update existing by id
        const idx = plans.findIndex(p => p.id === editingId);
        if (idx !== -1) {
            plans[idx] = {
                id: editingId,
                itemName, quantity, category, store, pickupDate, pickupTime, highPriority
            };
        }
        editingId = null;
        setSubmitButtonLabel('Add Plan');
        alert('Plan updated successfully!');
    } else {
        // Create new with stable id
        const plan = {
            id: crypto.randomUUID(),
            itemName, quantity, category, store, pickupDate, pickupTime, highPriority
        };
        plans.push(plan);
        alert('Plan saved successfully!');
    }

    localStorage.setItem('plans', JSON.stringify(plans));
    document.getElementById('grocery-form').reset();
    displayPlans();
});

// Display Plans (renders Edit button right before Delete)
function displayPlans() {
    const plansContainer = document.getElementById('plans-container');
    const plans = JSON.parse(localStorage.getItem('plans')) || [];

    // Backfill ids for any legacy items
    let mutated = false;
    for (const p of plans) {
        if (!p.id) { p.id = crypto.randomUUID(); mutated = true; }
    }
    if (mutated) localStorage.setItem('plans', JSON.stringify(plans));

    plansContainer.innerHTML = '';

    if (plans.length === 0) {
        plansContainer.innerHTML = `<p class="text-center">No plans available. Create a new plan above!</p>`;
        return;
    }

    plans.forEach((plan) => {
        const planCard = document.createElement('div');
        planCard.classList.add('col-md-6', 'mb-4');
        planCard.innerHTML = `
            <div class="card p-3 shadow-lg">
                <h5>${plan.itemName} (${plan.category})</h5>
                <p><strong>Quantity:</strong> ${plan.quantity}</p>
                <p><strong>Store:</strong> ${plan.store}</p>
                <p><strong>Pickup Date:</strong> ${plan.pickupDate}</p>
                <p><strong>Pickup Time:</strong> ${plan.pickupTime}</p>
                <p><strong>Priority:</strong> ${plan.highPriority ? 'High' : 'Normal'}</p>
                <!-- EDIT BUTTON: exactly here, before Delete -->
                <button class="btn btn-warning me-2" onclick="editPlan('${plan.id}')">Edit</button>
                <button class="btn btn-danger" onclick="deletePlan('${plan.id}')">Delete</button>
            </div>
        `;
        plansContainer.appendChild(planCard);
    });
}

// Delete Plan by id (stable even if order changes)
function deletePlan(id) {
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    const next = plans.filter(p => p.id !== id);
    localStorage.setItem('plans', JSON.stringify(next));
    alert('Plan deleted successfully!');
    displayPlans();

    // If we deleted the one we were editing, reset state
    if (editingId === id) {
        editingId = null;
        document.getElementById('grocery-form').reset();
        setSubmitButtonLabel('Add Plan');
    }
}

// Put selected plan back into the form and switch to "Update"
function editPlan(id) {
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    document.getElementById('item-name').value       = plan.itemName;
    document.getElementById('quantity').value        = plan.quantity;
    document.getElementById('category').value        = plan.category;
    document.getElementById('store').value           = plan.store;
    document.getElementById('pickup-date').value     = plan.pickupDate;
    document.getElementById('pickup-time').value     = plan.pickupTime;
    document.getElementById('high-priority').checked = plan.highPriority;

    editingId = id;
    setSubmitButtonLabel('Update Plan');
}

// Helper to set submit button text (works for button or input submit)
function setSubmitButtonLabel(text) {
    const btn = document.querySelector('#grocery-form button[type="submit"], #grocery-form input[type="submit"]');
    if (btn) btn.textContent = text;
}

// Load on page ready
document.addEventListener('DOMContentLoaded', displayPlans);

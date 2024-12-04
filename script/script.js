// Save Plan Functionality
document.getElementById('grocery-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get input values
    const itemName = document.getElementById('item-name').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const category = document.getElementById('category').value;
    const store = document.getElementById('store').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const highPriority = document.getElementById('high-priority').checked;

    // Validate inputs
    if (!itemName || !quantity || !category || !store || !pickupDate || !pickupTime) {
        alert('Please fill out all fields!');
        return;
    }

    // Create plan object
    const plan = { itemName, quantity, category, store, pickupDate, pickupTime, highPriority };

    // Retrieve existing plans or initialize an empty array
    let plans = JSON.parse(localStorage.getItem('plans')) || [];
    plans.push(plan);
    localStorage.setItem('plans', JSON.stringify(plans));

    // Success message and reset form
    alert('Plan saved successfully!');
    document.getElementById('grocery-form').reset();
    displayPlans();
});

// Display Plans
function displayPlans() {
    const plansContainer = document.getElementById('plans-container');
    const plans = JSON.parse(localStorage.getItem('plans')) || [];

    // Clear the container
    plansContainer.innerHTML = '';

    // Check if there are no plans
    if (plans.length === 0) {
        plansContainer.innerHTML = `<p class="text-center">No plans available. Create a new plan above!</p>`;
        return;
    }

    // Generate HTML for each plan
    plans.forEach((plan, index) => {
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
                <button class="btn btn-danger" onclick="deletePlan(${index})">Delete</button>
            </div>
        `;
        plansContainer.appendChild(planCard);
    });
}

// Delete Plan
function deletePlan(index) {
    // Retrieve existing plans
    const plans = JSON.parse(localStorage.getItem('plans')) || [];
    
    // Remove the selected plan
    plans.splice(index, 1);
    localStorage.setItem('plans', JSON.stringify(plans));

    // Refresh the plans display
    alert('Plan deleted successfully!');
    displayPlans();
}

// Load plans on page load
document.addEventListener('DOMContentLoaded', displayPlans);

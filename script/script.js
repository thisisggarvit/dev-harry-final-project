let dataItems = []; // Store fetched data

// Fetch data from the text file
fetch('data.txt')
    .then(response => response.text())
    .then(data => {
        // Split the data into lines
        const lines = data.split('\n');
        const container = document.getElementById('data-container');

        // Loop through each line and create an object for each item
        lines.forEach(line => {
            const [id, name] = line.trim().split(' ');
            if (id && name) {
                // Store each item in an array
                dataItems.push({ id, name });
            }
        });
        
        // Display all data initially
        displayData(dataItems);
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// Display data in the container
function displayData(data) {
    const container = document.getElementById('data-container');
    container.innerHTML = ''; // Clear previous content

    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'data-item';
        itemDiv.textContent = `ID: ${item.id}, Name: ${item.name}`;
        
        // Add the 'show' class to trigger animation
        setTimeout(() => {
            itemDiv.classList.add('show');
        }, 10);

        container.appendChild(itemDiv);
    });
}

// Filter data based on search input
function filterData() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredData = dataItems.filter(item => item.name.toLowerCase().includes(searchValue));
    displayData(filteredData);
}

// Add new data from the form
function addData(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get values from the input fields
    const id = document.getElementById('new-id').value.trim();
    const name = document.getElementById('new-name').value.trim();

    // Check if both ID and Name are provided
    if (id && name) {
        // Add the new data to the dataItems array
        const newItem = { id, name };
        dataItems.push(newItem);

        // Clear the input fields
        document.getElementById('new-id').value = '';
        document.getElementById('new-name').value = '';

        // Display updated data
        displayData(dataItems);
    }
}

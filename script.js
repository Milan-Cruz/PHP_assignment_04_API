/******w**************
    
    Assignment 4 Javascript
    Name: Milan Cruz
    Date: 28-06-2024
    Description: Api Query for City of Winnipeg Building Permits

*********************/

// Function to fetch data from API
function fetchData(queryParams) {
    const url = `https://data.winnipeg.ca/resource/it4w-cpf4.json?${queryParams}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data; // Return the JSON data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return []; // Return empty array in case of error
        });
}

// Function to handle form submission
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const permitTypeInput = document.getElementById('permitType').value.trim().toLowerCase();
    const orderBy = document.getElementById('orderBy').value;
    const limit = document.getElementById('limit').value.trim();

    // Validate permit type input
    if (permitTypeInput.length < 4) {
        alert('Please enter at least 4 characters for Permit Type search.');
        return;
    }

    // Construct query parameters
    let queryParams = `$limit=100&$order=issue_date%20${orderBy}&$where=lower(permit_type) like '%25${permitTypeInput}%25'`;

    // Add limit parameter if provided and valid
    if (limit !== '' && !isNaN(limit) && parseInt(limit) > 0 && parseInt(limit) <= 100) {
        queryParams += `&$limit=${limit}`;
    }

    // Fetch data based on query parameters
    fetchData(queryParams)
        .then(data => {
            displayResults(data);
        });
});

// Function to display results
function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    data.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('permit-item');

        resultItem.innerHTML = `
            <h3>Permit Number: ${item.permit_number}</h3>
            <p>Issue Date: ${item.issue_date}</p>
            <p>Permit Type: ${item.permit_type}</p>
            <p>Work Type: ${item.work_type}</p>
            <p>Neighbourhood: ${item.neighbourhood_name}, ${item.community}</p>
            <p>Status: ${item.status}</p>
            <p>Final Date: ${item.final_date}</p>
        `;

        resultsContainer.appendChild(resultItem);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const bloodStockList = document.getElementById('blood-stock-list');
    const requestBloodForm = document.getElementById('request-blood-form');
    const requestBloodFormMessage = document.querySelector('#request-blood p'); // Message above the form

    // Check if user is authenticated and update the request form visibility
    if (isAuthenticated()) {
        requestBloodForm.style.display = 'flex'; // Show the form if logged in
        requestBloodFormMessage.style.display = 'none'; // Hide the "Please log in" message
    } else {
        requestBloodForm.style.display = 'none'; // Hide the form if not logged in
        requestBloodFormMessage.style.display = 'block'; // Show the "Please log in" message
    }

    // Function to fetch and display blood stock
    async function fetchBloodStock() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/blood-stock/available`);
            const data = await response.json();

            if (response.ok) {
                bloodStockList.innerHTML = ''; // Clear previous entries
                if (data.length > 0) {
                    data.forEach(stock => {
                        const li = document.createElement('li');
                        li.textContent = `Blood Group: ${stock.bloodGroup}, Unit: ${stock.unit}, Blood Bank: ${stock.bloodBank ? stock.bloodBank.name : 'N/A'}`; // Added check for bloodBank existence
                        bloodStockList.appendChild(li);
                    });
                } else {
                    bloodStockList.textContent = 'No blood stock available at the moment.';
                }
            } else {
                console.error('Failed to fetch blood stock:', data.message);
                bloodStockList.textContent = 'Error loading blood stock.';
            }
        } catch (error) {
            console.error('Network error fetching blood stock:', error);
            bloodStockList.textContent = 'Network error. Please try again.';
        }
    }

    if (bloodStockList) {
        fetchBloodStock(); // Load stock when the page loads
    }

    if (requestBloodForm) {
        requestBloodForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const bloodGroup = document.getElementById('request-blood-group').value;
            const unit = document.getElementById('request-unit').value;

            const token = getAuthToken();
            if (!token) {
                alert('Please log in to request blood.');
                window.location.href = '/login.html';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ bloodGroup, unit })
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Blood request placed successfully!');
                    requestBloodForm.reset();
                    fetchBloodStock(); // Refresh blood stock after request
                } else {
                    document.getElementById('request-error-message').textContent = data.message || 'Failed to place blood request.';
                }
            } catch (error) {
                document.getElementById('request-error-message').textContent = 'Network error placing request.';
                console.error('Request blood error:', error);
            }
        });
    }
});
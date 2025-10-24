document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    // Login Form Logic
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    setAuthToken(data.token); // Store the JWT token
                    // Redirect to a dashboard or home page
                    window.location.href = '/'; 
                } else {
                    errorMessage.textContent = data.message || 'Login failed.';
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again.';
                console.error('Login error:', error);
            }
        });
    }

    // Register Form Logic
    if (registerForm) {
        const userTypeSelect = document.getElementById('userType');
        const additionalFieldsDiv = document.getElementById('additional-fields');

        // Function to dynamically add fields based on user type
        const updateAdditionalFields = () => {
            additionalFieldsDiv.innerHTML = ''; // Clear previous fields
            const userType = userTypeSelect.value;

            if (userType === 'bloodBank' || userType === 'hospital') {
                const locationLabel = document.createElement('label');
                locationLabel.htmlFor = 'location';
                locationLabel.textContent = 'Location:';
                additionalFieldsDiv.appendChild(locationLabel);
                const locationInput = document.createElement('input');
                locationInput.type = 'text';
                locationInput.id = 'location';
                locationInput.name = 'location';
                locationInput.required = true;
                additionalFieldsDiv.appendChild(locationInput);

                const contactLabel = document.createElement('label');
                contactLabel.htmlFor = 'contactNumber';
                contactLabel.textContent = 'Contact Number:';
                additionalFieldsDiv.appendChild(contactLabel);
                const contactInput = document.createElement('input');
                contactInput.type = 'text';
                contactInput.id = 'contactNumber';
                contactInput.name = 'contactNumber';
                contactInput.required = true;
                additionalFieldsDiv.appendChild(contactInput);
            }
            // Add more specific fields if needed for different roles
        };

        userTypeSelect.addEventListener('change', updateAdditionalFields);
        updateAdditionalFields(); // Call on load to set initial fields

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userType = document.getElementById('userType').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match.';
                return;
            }

            const registrationData = {
                userType,
                name,
                email,
                password,
            };

            if (userType === 'bloodBank' || userType === 'hospital') {
                registrationData.location = document.getElementById('location').value;
                registrationData.contactNumber = document.getElementById('contactNumber').value;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/users/register`, { // Adjust endpoint as needed
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful! Please log in.');
                    window.location.href = '/login.html';
                } else {
                    errorMessage.textContent = data.message || 'Registration failed.';
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again.';
                console.error('Registration error:', error);
            }
        });
    }
});
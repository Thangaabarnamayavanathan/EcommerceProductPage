const API_BASE_URL = window.location.origin; // Dynamically get the base URL

function setAuthToken(token) {
    localStorage.setItem('jwtToken', token);
}

function getAuthToken() {
    return localStorage.getItem('jwtToken');
}

function removeAuthToken() {
    localStorage.removeItem('jwtToken');
}

function isAuthenticated() {
    return !!getAuthToken();
}

// Example: Redirect if not authenticated (for protected pages)
function protectRoute(redirectUrl = '/login.html') {
    if (!isAuthenticated()) {
        window.location.href = redirectUrl;
    }
}

// Basic navigation update based on auth status (can be expanded)
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (isAuthenticated()) {
            // Add a logout link if authenticated
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                removeAuthToken();
                window.location.href = '/'; // Go to home after logout
            });
            nav.appendChild(logoutLink);
        }
    }
});

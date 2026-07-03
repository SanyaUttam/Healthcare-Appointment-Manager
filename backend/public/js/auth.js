let isLogin = false;
const authTitle = document.getElementById('authTitle');
const nameGroup = document.getElementById('nameGroup');
const nameInput = document.getElementById('name');
const authBtn = document.getElementById('authBtn');
const toggleAuth = document.getElementById('toggleAuth');
const toggleText = document.getElementById('toggleText');

toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    if (isLogin) {
        authTitle.innerText = "Account Login";
        nameGroup.style.display = "none";
        nameInput.removeAttribute('required');
        authBtn.innerText = "Login";
        toggleText.innerText = "New to CareSync?";
        toggleAuth.innerText = "Create an account";
    } else {
        authTitle.innerText = "Create Account";
        nameGroup.style.display = "block";
        nameInput.setAttribute('required', 'required');
        authBtn.innerText = "Create Account";
        toggleText.innerText = "Already have an account?";
        toggleAuth.innerText = "Login here";
    }
});

document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const payload = { email, password, role };
    if (!isLogin) {
        payload.name = nameInput.value;
    }

    const API_BASE = "https://healthcare-appointment-manager-stjl.onrender.com";

    const endpoint = isLogin
        ? `${API_BASE}/auth/login` 
        : `${API_BASE}/auth/register`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', role);
            
            if (role === 'admin') {
                window.location.href = '/admin.html';
            } else if (role === 'doctor') {
                window.location.href = '/doctor';
            } else {
                window.location.href = '/patient';
            }
        } else {
            alert(data.message || "Authentication failed.");
        }
    } catch (err) {
        console.error("Auth routing failure:", err);
        alert("Server error occurred during login/registration.");
    }
});

const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:5213/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem('token', data.token);  // Store JWT token
        console.log('Login Successful:', data);
    } else {
        console.error('Login Failed:', data);
    }
};

const registerUser = async (username, email, password) => {
    const response = await fetch('http://localhost:5213/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, passwordHash: password })
    });

    const data = await response.json();
    console.log('Registration Response:', data);
};
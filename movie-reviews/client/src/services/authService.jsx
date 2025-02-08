import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate an ID

export const loginUser = async (email, password) => {
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

export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch('http://localhost:5213/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: uuidv4(),  // Generate a unique ID for MongoDB
                username,
                email,
                passwordHash: password  // Backend expects 'passwordHash'
            })
        });

        const data = await response.json();
        console.log('Registration Response:', data);

        if (!response.ok) {
            console.error('Registration failed:', data);
            throw new Error(data.message || 'Registration failed');
        }

        return response;
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error;
    }
};
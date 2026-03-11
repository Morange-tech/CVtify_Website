

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('API_URL:', API_URL);


// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Register - No token needed
export async function registerUser(credentials) {
    console.log('Sending credentials:', credentials);  // Add this

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    console.log('Response status:', response.status);  // Add this


    if (!response.ok) {
        const error = await response.json();
        console.log('Error response:', error);  // Add this
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
}

// Login - No token needed
export async function loginUser(credentials) {
    try{
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout - Token required
export async function logoutUser() {
    const token = getToken();

    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Logout failed');
    }

    return response.json();
}

// Get User - Token required
export async function getUser() {
    const token = getToken();

    const response = await fetch(`${API_URL}/user`, {
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get user');
    }

    return response.json();
}

// Forgot Password - No token needed
export async function forgotPassword(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
}

// Reset Password - No token needed
export async function resetPassword(data) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
}
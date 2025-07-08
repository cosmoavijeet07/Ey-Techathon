export function login(email, password) {
    return fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('roles', JSON.stringify(data.roles));

            return { roles: data.roles, user_id: data.user_id, username: data.username }; // Return stored data for frontend usage
        }
        throw new Error('Invalid credentials');
    });
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
}

export function getRoles() {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
}

export function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

export function getUserId() {
    return localStorage.getItem('user_id');
}

export function getUsername() {
    return localStorage.getItem('username');
}

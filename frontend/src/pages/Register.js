import React, { useState } from 'react';
import './Register.css'; // Import the same CSS file

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [roles, setRoles] = useState(['user']); // Default role
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name, roles }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('User registered successfully! Please login.');
            } else {
                setMessage(data.msg || 'An error occurred');
            }
        } catch (error) {
            setMessage('An error occurred');
        }
    };

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Register</h1>
            </header>

            <main className="dashboard-main">
                <div className="glass-card register-container">
                    <h2 className="register-title">Create an Account</h2>
                    <form onSubmit={handleRegister} className="register-form">
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-input"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass-input"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="glass-input"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Role</label>
                            <select
                                value={roles}
                                onChange={(e) => setRoles([e.target.value])}
                                className="glass-input"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="agent">Agent</option>
                            </select>
                        </div>
                        <button type="submit" className="register-button">
                            Register
                        </button>
                    </form>
                    {message && <p className="register-message">{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default Register;
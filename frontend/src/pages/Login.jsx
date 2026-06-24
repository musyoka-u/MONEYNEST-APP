// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let result;
    if (isRegistering) {
      result = await register(name, email, password);
    } else {
      result = await login(email, password);
    }

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>💰 MoneyNest</h1>
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          
          {error && <p className="auth-error">{error}</p>}
          
          <button type="submit">
            {isRegistering ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <p className="auth-toggle">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
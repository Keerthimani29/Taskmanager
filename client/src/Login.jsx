import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const switchTab = (tab) => setActiveTab(tab);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch('http://localhost:5000/server/login/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.text();
    if (result === 'success') {
      navigate('/app');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch('http://localhost:5000/server/login/submitted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.text();
    if (result === 'success') {
      alert('Signup successful. Please login.');
      setActiveTab('login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
          onClick={() => switchTab('login')}
        >
          Login
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'signup' ? styles.active : ''}`}
          onClick={() => switchTab('signup')}
        >
          Sign Up
        </div>
      </div>

      {activeTab === 'login' && (
        <form onSubmit={handleLogin}>
          <h1>Welcome Back</h1>
          <div className={styles['form-group']}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" required />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <button type="submit">Login</button>
          <div className={styles['forgot-password']}>
            <a href="#">Forgot Password?</a>
          </div>
        </form>
      )}

      {activeTab === 'signup' && (
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className={styles['form-group']}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" required />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      )}
    </div>
  );
};



export default Login;

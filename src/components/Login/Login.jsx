import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // The base URL is https://frontend-take-home-service.fetch.com.
  // POST /auth/login
  // Body Parameters
  // name - the user’s name
  // email - the user’s email
  // Including credentials with fetch (set credentials: 'include' in request config)

  // handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    try {
      const response = await fetch(
        'https://frontend-take-home-service.fetch.com/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email }),
        },
      );

      if (!response.ok) throw new Error('Login failed');

      // response is not JSON // use .text() instead
      if (response.status === 200) {
        // handle non-JSON response
        const data = await response.text();
        console.log('Login successful, redirect to search page', data); // it logs OK

        //Once a user is successfully authenticated, they should be brought to a search page where they can browse available dogs.
        // redirect to search page
        navigate('/search');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Login failed. Please check your name and email.');
    }
  };

  // {
  //     name: string,
  //     email: string
  // }
  // {
  //     "name": "ploy",
  //     "email": "ploy@ploynapa.com"
  // }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;

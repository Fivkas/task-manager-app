import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clearing old errors

    try {
      // 1. Send the data to the Backend
      const response = await api.post('/auth/login', { email, password });
      
      // 2. We get the token from the response
      const { access_token } = response.data;
      
      // 3. We save it to the browser's LocalStorage
      localStorage.setItem('token', access_token);
      
      // 4. Transfer to the home page (Dashboard)
      navigate('/'); 
      
    } catch (err: any) {
      // If the Backend returns an error (e.g. 401 Unauthorized)
      setError('Invalid email or password');
      console.error('Login failed:', err);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Sign In
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
}

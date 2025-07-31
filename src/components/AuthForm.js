import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const url = `http://localhost:5000/api/users/${endpoint}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na autenticação');
      }

      // Salva o token e redireciona
      localStorage.setItem('token', data.token);
      navigate('/album'); // Ou para a página desejada após login

    } catch (err) {
      setError(err.message || 'Erro ao conectar com o servidor');
      console.error('Erro:', err);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && ( 
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>

        <button type="submit" className="auth-button">
          {isLogin ? 'To enter' : 'Register'}
        </button>
        <p className="toggle-text">
        {isLogin ? 'Create a new account ' : 'Already have an account? '}
        <button 
          type="button" 
          className="toggle-button"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </button>
      </p>
      </form>

    </div>
  );
};

export default AuthForm;
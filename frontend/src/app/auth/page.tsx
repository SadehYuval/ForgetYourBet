'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    confirmEmail: ''
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    emailMismatch: false,
    serverError: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ passwordMismatch: false, emailMismatch: false, serverError: '' }); // clear errors on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: form.email,
          password: form.password
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, userId: data.userId }));
        router.push('../dashboard');
      } else {
        setErrors({ ...errors, serverError: data.error });
      }
    } else {
      const passwordMismatch = form.password !== form.confirmPassword;
      const emailMismatch = form.email !== form.confirmEmail;

      if (passwordMismatch || emailMismatch) {
        setErrors({ ...errors, passwordMismatch, emailMismatch });
        return;
      }

      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setErrors({ passwordMismatch: false, emailMismatch: false, serverError: '' });
        setIsLogin(true);
      } else {
        setErrors({ ...errors, serverError: data.error });
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <input
              name="confirmEmail"
              type="email"
              placeholder="Confirm Email"
              value={form.confirmEmail}
              onChange={handleChange}
              required
            />
            {errors.emailMismatch && (
              <p className="error">Emails do not match</p>
            )}
          </>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.passwordMismatch && (
              <p className="error">Passwords do not match</p>
            )}
          </>
        )}

        {errors.serverError && (
          <p className="error">{errors.serverError}</p>
        )}

        <button className="submit-btn" type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="toggle-auth">
        <button className="switch-btn" type="button" onClick={() => {
          setIsLogin(!isLogin);
          setForm({
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            confirmEmail: ''
          });
          setErrors({ passwordMismatch: false, emailMismatch: false, serverError: '' });
        }}>
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
}

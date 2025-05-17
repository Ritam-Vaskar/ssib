import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/login.module.css'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'client' // Default role
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // TODO: Implement API call for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', formData.role)
        
        // Redirect based on role
        switch(formData.role) {
          case 'admin':
            navigate('/admin-dashboard')
            break
          case 'client':
            navigate('/client-dashboard')
            break
          case 'security':
            navigate('/security-dashboard')
            break
          default:
            navigate('/client-dashboard')
        }
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Login to SSIB Service</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Role:</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className={styles.select}
            >
              <option value="client">Client</option>
              <option value="security">Security Guard</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>

        <div className={styles.links}>
          <a href="/signup">Don't have an account? Sign up</a>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  )
}

export default Login
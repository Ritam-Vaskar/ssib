import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/login.module.css'
import { auth } from '../../api'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'client' // Default role
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role })
      const response = await auth.login(formData)
      console.log('Login response:', response.data)
      
      // Store the actual token from response if available
      const token = response.data?.token || 'dummy-token'
      localStorage.setItem('token', token)
      localStorage.setItem('role', formData.role)
      
      // Force a state change to trigger re-render
      window.location.href = getRedirectPath(formData.role)
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.'
      setError(errorMsg)
      
      // Display more detailed error for debugging
      // if (errorMsg === 'Invalid credentials') {
      //   console.log('Debug info: Server returned invalid credentials. This could mean:')
      //   console.log('1. The email does not exist in the database')
      //   console.log('2. The password is incorrect')
      //   console.log('3. The role might not match what in the database)
      // }
    } finally {
      setIsLoading(false)
    }
  }
  
  const getRedirectPath = (role) => {
    switch(role) {
      case 'admin':
        return '/admin-dashboard'
      case 'client':
        return '/client-dashboard'
      case 'security':
        return '/security-dashboard'
      default:
        return '/client-dashboard'
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

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
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
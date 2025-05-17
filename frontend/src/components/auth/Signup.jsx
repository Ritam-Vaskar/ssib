import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/signup.module.css'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: ''
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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      // Send signup request
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        // Store email temporarily for OTP verification
        sessionStorage.setItem('verificationEmail', formData.email)
        navigate('/otp-verification')
      } else {
        const data = await response.json()
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h2>Create Account</h2>
        {error && <p className={styles.error}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.signupForm}>
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
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
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
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
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

          <div className={styles.formGroup}>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
        </form>

        <div className={styles.links}>
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  )
}

export default Signup
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/signup.module.css'
import { auth } from '../../api'
import Toast from '../common/Toast'
import LoadingSpinner from '../common/LoadingSpinner'

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
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

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
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setToastMessage('Passwords do not match')
      setToastType('error')
      setShowToast(true)
      setIsLoading(false)
      return
    }

    try {
      await auth.register(formData)
      // Store email temporarily for OTP verification
      sessionStorage.setItem('verificationEmail', formData.email)
      navigate('/otp-verification')
    } catch (err) {
      const errorMsg = err.message || 'Something went wrong. Please try again.'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.signupContainer}>
      {isLoading && <LoadingSpinner />}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className={styles.signupBox}>
        <h2>Create Account</h2>
        
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
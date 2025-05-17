import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/forgotPassword.module.css'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setStep(2)
        // Start timer for OTP
        const interval = setInterval(() => {
          setTimer((prev) => prev > 0 ? prev - 1 : 0)
        }, 1000)
        return () => clearInterval(interval)
      } else {
        setError('Email not found')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      if (response.ok) {
        setStep(3)
      } else {
        setError('Invalid OTP')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })

      if (response.ok) {
        navigate('/login')
      } else {
        setError('Password reset failed')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const resendOTP = async () => {
    if (timer > 0) return
    try {
      const response = await fetch('/api/auth/resend-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setTimer(60)
        setError('')
      } else {
        setError('Failed to resend OTP')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2>Reset Password</h2>
        {error && <p className={styles.error}>{error}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Email Address:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>
              Send Reset Link
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOTPSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Enter OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>
              Verify OTP
            </button>
            <div className={styles.resendSection}>
              {timer > 0 ? (
                <p>Resend OTP in {timer}s</p>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className={styles.resendButton}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className={styles.form}>
            <div className={styles.formGroup}>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.button}>
              Reset Password
            </button>
          </form>
        )}

        <div className={styles.links}>
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/forgotPassword.module.css'
import { auth } from '../../api'

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
      await auth.forgotPassword({ email })
      setStep(2)
      const interval = setInterval(() => {
        setTimer((prev) => prev > 0 ? prev - 1 : 0)
      }, 1000)
      return () => clearInterval(interval)
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    try {
      await auth.verifyOTP({ email, otp })
      setStep(3)
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
      await auth.resetPassword({ email, otp, newPassword })
      navigate('/login')
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const resendOTP = async () => {
    if (timer > 0) return
    try {
      await auth.resendOTP({ email })
      setTimer(60)
      setError('')
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
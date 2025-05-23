import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/forgotPassword.module.css'
import { auth } from '../../api'
import Toast from '../common/Toast'
import LoadingSpinner from '../common/LoadingSpinner'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await auth.forgotPassword({ email })
      setStep(2)
      const interval = setInterval(() => {
        setTimer((prev) => prev > 0 ? prev - 1 : 0)
      }, 1000)
      setToastMessage('Reset link sent successfully')
      setToastType('success')
      setShowToast(true)
      return () => clearInterval(interval)
    } catch (err) {
      const errorMsg = 'Failed to send reset link'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await auth.verifyOTP({ email, otp })
      setStep(3)
      setToastMessage('OTP verified successfully')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      const errorMsg = 'Invalid OTP'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      const errorMsg = 'Passwords do not match'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
      return
    }

    setIsLoading(true)
    try {
      await auth.resetPassword({ email, otp, newPassword })
      setToastMessage('Password reset successful')
      setToastType('success')
      setShowToast(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      const errorMsg = 'Failed to reset password'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    if (timer > 0) return
    setIsLoading(true)
    try {
      await auth.resendOTP({ email })
      setTimer(60)
      setError('')
      setToastMessage('OTP resent successfully')
      setToastType('success')
      setShowToast(true)
    } catch (err) {
      const errorMsg = 'Failed to resend OTP'
      setError(errorMsg)
      setToastMessage(errorMsg)
      setToastType('error')
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {isLoading && <LoadingSpinner />}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
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
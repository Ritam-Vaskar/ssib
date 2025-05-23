import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/otpVerification.module.css'
import { auth } from '../../api'
import Toast from '../common/Toast'
import LoadingSpinner from '../common/LoadingSpinner'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(timer - 1), 1000)
    return () => clearInterval(countdown)
  }, [timer])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const resendOTP = async () => {
    const email = sessionStorage.getItem('verificationEmail')
    if (!email) {
      navigate('/signup')
      return
    }
    setIsLoading(true)

    setIsResending(true)
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
    }
    setIsResending(false)
    setIsLoading(false)
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    const email = sessionStorage.getItem('verificationEmail')
    if (!email) {
      navigate('/signup')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      await auth.verifyOTP({ email, otp: otp.join('') })
      sessionStorage.removeItem('verificationEmail')
      setToastMessage('Email verified successfully')
      setToastType('success')
      setShowToast(true)
      setTimeout(() => navigate('/login'), 1500)
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

  return (
    <div className={styles.otpContainer}>
      {isLoading && <LoadingSpinner />}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      <div className={styles.otpBox}>
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit code sent to your email</p>

        <form onSubmit={verifyOTP} className={styles.otpForm}>
          <div className={styles.otpInputs}>
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onFocus={e => e.target.select()}
                  className={styles.otpInput}
                />
              )
            })}
          </div>

          <button type="submit" className={styles.verifyButton}>
            Verify OTP
          </button>
        </form>

        <div className={styles.resendSection}>
          {timer > 0 ? (
            <p>Resend code in {timer}s</p>
          ) : (
            <button
              onClick={resendOTP}
              disabled={isResending}
              className={styles.resendButton}
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
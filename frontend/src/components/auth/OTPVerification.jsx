import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/components/auth/otpVerification.module.css'

const OTPVerification = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [isResending, setIsResending] = useState(false)

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

    setIsResending(true)
    try {
      const response = await fetch('/api/auth/resend-otp', {
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
    setIsResending(false)
  }

  const verifyOTP = async (e) => {
    e.preventDefault()
    const email = sessionStorage.getItem('verificationEmail')
    if (!email) {
      navigate('/signup')
      return
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.join('')
        })
      })

      if (response.ok) {
        sessionStorage.removeItem('verificationEmail')
        navigate('/login')
      } else {
        setError('Invalid OTP')
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.otpContainer}>
      <div className={styles.otpBox}>
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit code sent to your email</p>
        
        {error && <p className={styles.error}>{error}</p>}

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
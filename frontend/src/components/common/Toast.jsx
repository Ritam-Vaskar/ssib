import { useEffect } from 'react'
import styles from '../../styles/components/common/toast.module.css'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  )
}

export default Toast
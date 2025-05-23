import styles from '../../styles/components/common/loading.module.css'

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default LoadingSpinner
import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'
import { client } from '../../api'
import LoadingSpinner from '../common/LoadingSpinner'
import { useToast } from '../../context/ToastContext'
const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('status')
  const [guardInfo, setGuardInfo] = useState(null)
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const [applicationForm, setApplicationForm] = useState({
    serviceType: 'FULL_TIME',
    location: '',
    startDate: '',
    endDate: '',
    numberOfGuards: 1,
    additionalDetails: ''
  })

  useEffect(() => {
    fetchGuardInfo()
    fetchBills()
  }, [])

  const fetchGuardInfo = async () => {
    setIsLoading(true)
    try {
      const response = await client.getProfile()
      setGuardInfo(response.data.assignedGuard || null)
    } catch (err) {
      console.error('Error fetching guard info:', err)
      showToast('Failed to fetch guard information', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  

  const fetchBills = async () => {
    setIsLoading(true)
    try {
      const response = await client.getBills()
      setBills(response.data)
    } catch (err) {
      console.error('Error fetching bills:', err)
      showToast('Failed to fetch bills', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  
  

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await client.submitApplication(applicationForm)
      setApplicationForm({
        serviceType: 'FULL_TIME',
        location: '',
        startDate: '',
        endDate: '',
        numberOfGuards: 1,
        additionalDetails: ''
      })
      showToast('Application submitted successfully!', 'success')
    } catch (err) {
      console.error('Error submitting application:', err)
      showToast('Failed to submit application', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className={styles.dashboard}>
      {isLoading && <LoadingSpinner />}
      <div className={styles.sidebar}>
        <h2>Client Dashboard</h2>
        <nav>
          <button
            className={activeTab === 'status' ? styles.active : ''}
            onClick={() => setActiveTab('status')}
          >
            Guard Status
          </button>
          <button
            className={activeTab === 'apply' ? styles.active : ''}
            onClick={() => setActiveTab('apply')}
          >
            Apply for Service
          </button>
          <button
            className={activeTab === 'bills' ? styles.active : ''}
            onClick={() => setActiveTab('bills')}
          >
            Bills
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        {activeTab === 'status' && (
          <div className={styles.section}>
            <h3>Assigned Guard Information</h3>
            {guardInfo ? (
              <div className={styles.guardInfo}>
                <h4>{guardInfo.name}</h4>
                <p>Contact: {guardInfo.phone}</p>
                <p>Experience: {guardInfo.experience} years</p>
                <p>Status: {guardInfo.status}</p>
                <p>Shift Timing: {guardInfo.shiftTiming}</p>
              </div>
            ) : (
              <p>No guard assigned yet</p>
            )}
          </div>
        )}

        {activeTab === 'apply' && (
          <div className={styles.section}>
            <h3>Apply for Security Service</h3>
            <form onSubmit={handleApplicationSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Service Type:</label>
                <select
                  value={applicationForm.serviceType}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    serviceType: e.target.value
                  })}
                  required
                >
                  <option value="FULL_TIME">24/7 Security</option>
                  <option value="DAY_SHIFT">Day Shift</option>
                  <option value="NIGHT_SHIFT">Night Shift</option>
                  <option value="EVENT_SECURITY">Event Security</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  type="date"
                  value={applicationForm.startDate}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    startDate: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Date:</label>
                <input
                  type="date"
                  value={applicationForm.endDate}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    endDate: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Number of Guards:</label>
                <input
                  type="number"
                  min="1"
                  value={applicationForm.numberOfGuards}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    numberOfGuards: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location:</label>
                <input
                  type="text"
                  value={applicationForm.location}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    location: e.target.value
                  })}
                  required
                  placeholder="Service location address"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Additional Details:</label>
                <textarea
                  value={applicationForm.additionalDetails}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    additionalDetails: e.target.value
                  })}
                  placeholder="Any additional requirements or details..."
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit Application
              </button>
            </form>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className={styles.section}>
            <h3>Bills & Payments</h3>
            <div className={styles.billsList}>
              {bills.map(bill => (
                <div key={bill._id} className={styles.billCard}>
                  <div className={styles.billHeader}>
                    <h4>Bill #{bill.billNumber}</h4>
                    <span className={styles[bill.status]}>{bill.status}</span>
                  </div>
                  <p>Amount: ₹{bill.amount}</p>
                  <p>Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
                  <p>Description: {bill.description}</p>
                  {bill.driveLink && (
                    <a
                      href={bill.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.billLink}
                    >
                      View Bill
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientDashboard
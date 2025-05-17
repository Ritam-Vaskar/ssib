import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('status')
  const [guardInfo, setGuardInfo] = useState(null)
  const [bills, setBills] = useState([])
  const [applicationForm, setApplicationForm] = useState({
    serviceType: 'residential',
    requirements: '',
    duration: '',
    location: ''
  })

  useEffect(() => {
    fetchGuardInfo()
    fetchBills()
  }, [])

  const fetchGuardInfo = async () => {
    try {
      const response = await fetch('/api/client/guard-info')
      const data = await response.json()
      setGuardInfo(data)
    } catch (err) {
      console.error('Error fetching guard info:', err)
    }
  }

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/client/bills')
      const data = await response.json()
      setBills(data)
    } catch (err) {
      console.error('Error fetching bills:', err)
    }
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/client/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationForm)
      })
      if (response.ok) {
        setApplicationForm({
          serviceType: 'residential',
          requirements: '',
          duration: '',
          location: ''
        })
        alert('Application submitted successfully!')
      }
    } catch (err) {
      console.error('Error submitting application:', err)
    }
  }

  return (
    <div className={styles.dashboard}>
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
                  <option value="residential">Residential Security</option>
                  <option value="commercial">Commercial Security</option>
                  <option value="event">Event Security</option>
                  <option value="personal">Personal Security</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Requirements:</label>
                <textarea
                  value={applicationForm.requirements}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    requirements: e.target.value
                  })}
                  required
                  placeholder="Describe your security requirements..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Duration:</label>
                <input
                  type="text"
                  value={applicationForm.duration}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    duration: e.target.value
                  })}
                  required
                  placeholder="e.g., 6 months, 1 year"
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
import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'
import api, { security } from '../../api'
import LoadingSpinner from '../common/LoadingSpinner'
import { useToast } from '../../context/ToastContext'

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments')
  const [assignments, setAssignments] = useState([])
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    experience: '',
    qualifications: '',
    previousEmployer: '',
    documents: [],
    additionalDetails: ''
  })

  useEffect(() => {
    fetchAssignments()
    fetchBills()
  }, [])

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/assignments')
      setAssignments(response.data)
    } catch (err) {
      console.error('Error fetching assignments:', err)
      showToast('Failed to fetch assignments', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBills = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/security/bills')
      setBills(response.data)
    } catch (err) {
      console.error('Error fetching bills:', err)
      showToast('Failed to fetch bills', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateAssignmentStatus = async (assignmentId, status) => {
    setIsLoading(true)
    try {
      const payload = { assignmentId, status }
      await security.updateAssignmentStatus(payload)
      await fetchAssignments()
      showToast('Status updated successfully', 'success')
    } catch (err) {
      console.error('Error updating status:', err)
      showToast('Failed to update status', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.post('/security/application/submit', applicationForm)
      if (response.data.success) {
        showToast('Application submitted successfully!', 'success')
        setApplicationForm({
          fullName: '',
          dateOfBirth: '',
          address: '',
          phoneNumber: '',
          experience: '',
          qualifications: '',
          previousEmployer: '',
          documents: [],
          additionalDetails: ''
        })
      }
    } catch (err) {
      console.error('Error submitting application:', err)
      showToast(err.response?.data?.message || 'Error submitting application. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.dashboard}>
      {isLoading && <LoadingSpinner />}
      <div className={styles.sidebar}>
        <h2>Security Dashboard</h2>
        <nav>
          <button
            className={activeTab === 'assignments' ? styles.active : ''}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={activeTab === 'bills' ? styles.active : ''}
            onClick={() => setActiveTab('bills')}
          >
            Bills
          </button>
          <button
            className={activeTab === 'apply' ? styles.active : ''}
            onClick={() => setActiveTab('apply')}
          >
            Apply for Job
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        {activeTab === 'assignments' && (
          <div className={styles.section}>
            <h3>Current Assignments</h3>
            <div className={styles.assignmentsList}>
              {assignments.map(assignment => (
                <div key={assignment._id} className={styles.assignmentCard}>
                  <div className={styles.assignmentHeader}>
                    <h4>{assignment.client.name}</h4>
                    <span className={styles[assignment.status]}>
                      {assignment.status}
                    </span>
                  </div>
                  <p>Location: {assignment.location}</p>
                  <p>Shift: {assignment.shiftTiming}</p>
                  <p>Duration: {assignment.duration}</p>
                  <div className={styles.statusButtons}>
                    <button
                      onClick={() => updateAssignmentStatus(assignment._id, 'active')}
                      className={assignment.status === 'active' ? styles.active : ''}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => updateAssignmentStatus(assignment._id, 'onBreak')}
                      className={assignment.status === 'onBreak' ? styles.active : ''}
                    >
                      On Break
                    </button>
                    <button
                      onClick={() => updateAssignmentStatus(assignment._id, 'completed')}
                      className={assignment.status === 'completed' ? styles.active : ''}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

        {activeTab === 'apply' && (
          <div className={styles.section}>
            <h3>Apply for Security Position</h3>
            <form onSubmit={handleApplicationSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name:</label>
                <input
                  type="text"
                  value={applicationForm.fullName}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    fullName: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={applicationForm.dateOfBirth}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    dateOfBirth: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address:</label>
                <textarea
                  value={applicationForm.address}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    address: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number:</label>
                <input
                  type="tel"
                  value={applicationForm.phoneNumber}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    phoneNumber: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Experience (in years):</label>
                <input
                  type="number"
                  min="0"
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    experience: Number(e.target.value)
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Qualifications:</label>
                <textarea
                  value={applicationForm.qualifications}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    qualifications: e.target.value
                  })}
                  placeholder="List your educational qualifications and certifications..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Previous Employer:</label>
                <input
                  type="text"
                  value={applicationForm.previousEmployer}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    previousEmployer: e.target.value
                  })}
                  placeholder="Enter your previous employer's name"
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
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecurityDashboard

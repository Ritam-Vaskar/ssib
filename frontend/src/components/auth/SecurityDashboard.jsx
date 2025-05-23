import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'
import api, { security } from '../../api'

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments')
  const [assignments, setAssignments] = useState([])
  const [bills, setBills] = useState([])
  const [applicationForm, setApplicationForm] = useState({
    experience: '',
    availability: 'FULL_TIME',
    preferredLocation: '',
    skills: '',
    expectedSalary: '',
    additionalDetails: ''
  })

  useEffect(() => {
    fetchAssignments()
    fetchBills()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/security/assignments')
      setAssignments(response.data)
    } catch (err) {
      console.error('Error fetching assignments:', err)
    }
  }

  const fetchBills = async () => {
    try {
      const response = await api.get('/security/bills')
      setBills(response.data)
    } catch (err) {
      console.error('Error fetching bills:', err)
    }
  }

  const updateAssignmentStatus = async (assignmentId, status) => {
    try {
      const payload = { assignmentId, status }
      await security.updateAssignmentStatus(payload)
      fetchAssignments()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  return (
    <div className={styles.dashboard}>
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
                <label>Experience (in years):</label>
                <input
                  type="number"
                  min="0"
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    experience: e.target.value
                  })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Availability:</label>
                <select
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    availability: e.target.value
                  })}
                  required
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="DAY_SHIFT">Day Shift</option>
                  <option value="NIGHT_SHIFT">Night Shift</option>
                  <option value="EVENT_SECURITY">Event Security</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Preferred Location:</label>
                <input
                  type="text"
                  value={applicationForm.preferredLocation}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    preferredLocation: e.target.value
                  })}
                  required
                  placeholder="Enter your preferred work location"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Skills:</label>
                <textarea
                  value={applicationForm.skills}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    skills: e.target.value
                  })}
                  placeholder="List your relevant skills and certifications..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Expected Salary (₹):</label>
                <input
                  type="number"
                  min="0"
                  value={applicationForm.expectedSalary}
                  onChange={(e) => setApplicationForm({
                    ...applicationForm,
                    expectedSalary: e.target.value
                  })}
                  required
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

              <button type="submit" className={styles.submitButton}>
                Submit Application
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

const handleApplicationSubmit = async (e) => {
  e.preventDefault()
  try {
    await security.submitApplication(applicationForm)
    setApplicationForm({
      experience: '',
      availability: 'FULL_TIME',
      preferredLocation: '',
      skills: '',
      expectedSalary: '',
      additionalDetails: ''
    })
    alert('Application submitted successfully!')
  } catch (err) {
    console.error('Error submitting application:', err)
    alert('Error submitting application. Please try again.')
  }
}

export default SecurityDashboard

import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('assignments')
  const [assignments, setAssignments] = useState([])
  const [bills, setBills] = useState([])

  useEffect(() => {
    fetchAssignments()
    fetchBills()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/security/assignments')
      const data = await response.json()
      setAssignments(data)
    } catch (err) {
      console.error('Error fetching assignments:', err)
    }
  }

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/security/bills')
      const data = await response.json()
      setBills(data)
    } catch (err) {
      console.error('Error fetching bills:', err)
    }
  }

  const updateAssignmentStatus = async (assignmentId, status) => {
    try {
      const response = await fetch('/api/security/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, status })
      })
      if (response.ok) {
        fetchAssignments()
      }
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
      </div>
    </div>
  )
}

export default SecurityDashboard
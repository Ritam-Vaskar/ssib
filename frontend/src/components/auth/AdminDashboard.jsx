import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('guards')
  const [guards, setGuards] = useState([])
  const [clients, setClients] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedGuard, setSelectedGuard] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [billFormData, setBillFormData] = useState({
    amount: '',
    dueDate: '',
    description: '',
    driveLink: ''
  })

  useEffect(() => {
    // Fetch initial data
    fetchGuards()
    fetchClients()
    fetchApplications()
  }, [])

  const fetchGuards = async () => {
    try {
      const response = await fetch('/api/admin/guards')
      const data = await response.json()
      setGuards(data)
    } catch (err) {
      console.error('Error fetching guards:', err)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      setClients(data)
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/applications')
      const data = await response.json()
      setApplications(data)
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }

  const handleAssignGuard = async (clientId, guardId) => {
    try {
      const response = await fetch('/api/admin/assign-guard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, guardId })
      })
      if (response.ok) {
        fetchClients()
        fetchGuards()
      }
    } catch (err) {
      console.error('Error assigning guard:', err)
    }
  }

  const handleApplicationResponse = async (applicationId, status) => {
    try {
      const response = await fetch('/api/admin/application-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status })
      })
      if (response.ok) {
        fetchApplications()
      }
    } catch (err) {
      console.error('Error responding to application:', err)
    }
  }

  const handleBillSubmit = async (e, userId) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/generate-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...billFormData })
      })
      if (response.ok) {
        setBillFormData({
          amount: '',
          dueDate: '',
          description: '',
          driveLink: ''
        })
      }
    } catch (err) {
      console.error('Error generating bill:', err)
    }
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <nav>
          <button
            className={activeTab === 'guards' ? styles.active : ''}
            onClick={() => setActiveTab('guards')}
          >
            Security Guards
          </button>
          <button
            className={activeTab === 'clients' ? styles.active : ''}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={activeTab === 'applications' ? styles.active : ''}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        {activeTab === 'guards' && (
          <div className={styles.section}>
            <h3>Security Guards</h3>
            <div className={styles.list}>
              {guards.map(guard => (
                <div key={guard._id} className={styles.card}>
                  <h4>{guard.name}</h4>
                  <p>Email: {guard.email}</p>
                  <p>Status: {guard.status}</p>
                  <button onClick={() => setSelectedGuard(guard)}>
                    Generate Bill
                  </button>
                </div>
              ))}
            </div>

            {selectedGuard && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h3>Generate Bill for {selectedGuard.name}</h3>
                  <form onSubmit={(e) => handleBillSubmit(e, selectedGuard._id)}>
                    <div className={styles.formGroup}>
                      <label>Amount:</label>
                      <input
                        type="number"
                        value={billFormData.amount}
                        onChange={(e) => setBillFormData({
                          ...billFormData,
                          amount: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Due Date:</label>
                      <input
                        type="date"
                        value={billFormData.dueDate}
                        onChange={(e) => setBillFormData({
                          ...billFormData,
                          dueDate: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description:</label>
                      <textarea
                        value={billFormData.description}
                        onChange={(e) => setBillFormData({
                          ...billFormData,
                          description: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Drive Link:</label>
                      <input
                        type="url"
                        value={billFormData.driveLink}
                        onChange={(e) => setBillFormData({
                          ...billFormData,
                          driveLink: e.target.value
                        })}
                        required
                      />
                    </div>
                    <div className={styles.modalActions}>
                      <button type="submit">Generate Bill</button>
                      <button
                        type="button"
                        onClick={() => setSelectedGuard(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className={styles.section}>
            <h3>Clients</h3>
            <div className={styles.list}>
              {clients.map(client => (
                <div key={client._id} className={styles.card}>
                  <h4>{client.name}</h4>
                  <p>Email: {client.email}</p>
                  <p>Status: {client.status}</p>
                  <button onClick={() => setSelectedClient(client)}>
                    Assign Guard
                  </button>
                </div>
              ))}
            </div>

            {selectedClient && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h3>Assign Guard to {selectedClient.name}</h3>
                  <div className={styles.guardList}>
                    {guards
                      .filter(guard => guard.status === 'available')
                      .map(guard => (
                        <div key={guard._id} className={styles.guardCard}>
                          <h4>{guard.name}</h4>
                          <p>Experience: {guard.experience}</p>
                          <button
                            onClick={() => {
                              handleAssignGuard(selectedClient._id, guard._id)
                              setSelectedClient(null)
                            }}
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                  </div>
                  <button
                    className={styles.closeButton}
                    onClick={() => setSelectedClient(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className={styles.section}>
            <h3>New Applications</h3>
            <div className={styles.list}>
              {applications.map(application => (
                <div key={application._id} className={styles.card}>
                  <h4>{application.name}</h4>
                  <p>Email: {application.email}</p>
                  <p>Service Type: {application.serviceType}</p>
                  <p>Requirements: {application.requirements}</p>
                  <div className={styles.actions}>
                    <button
                      className={styles.acceptButton}
                      onClick={() => handleApplicationResponse(application._id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className={styles.rejectButton}
                      onClick={() => handleApplicationResponse(application._id, 'rejected')}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
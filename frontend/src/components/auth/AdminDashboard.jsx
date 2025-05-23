import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'
import api from '../../api'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('guards')
  const [guards, setGuards] = useState([])
  const [clients, setClients] = useState([])
  const [applications, setApplications] = useState([])
  const [securityApplications, setSecurityApplications] = useState([])
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
    fetchSecurityApplications()
  }, [])

  const fetchSecurityApplications = async () => {
    try {
      const response = await api.get('/admin/security-applications')
      setSecurityApplications(Array.isArray(response.data) ? response.data : [response.data])
    } catch (err) {
      console.error('Error fetching security applications:', err)
    }
  }

  const handleSecurityApplicationResponse = async (applicationId, status) => {
    try {
      await api.post('/admin/security-applications/respond', { applicationId, status })
      fetchSecurityApplications()
      if (status === 'approved') {
        fetchGuards()
      }
    } catch (err) {
      console.error('Error responding to security application:', err)
    }
  }

  const fetchGuards = async () => {
    try {
      const response = await api.get('/admin/guards')
      console.log('Guards response:', response.data)
      setGuards(response.data?.data || [])
    } catch (err) {
      console.error('Error fetching guards:', err)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await api.get('/admin/clients')
      console.log('Clients response:', response.data)
      setClients(Array.isArray(response.data)? response.data : [response.data])
    } catch (err) {
      console.error('Error fetching clients:', err)
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await api.get('/admin/applications')
      console.log('Applications response:', response.data)
      // Ensure applications is always an array
      setApplications(Array.isArray(response.data) ? response.data : [response.data])
    } catch (err) {
      console.error('Error fetching applications:', err)
    }
  }

  const handleAssignGuard = async (clientId, guardId) => {
    try {
      await api.post('/admin/assign-guard', { clientId, guardId })
      fetchClients()
      fetchGuards()
      setSelectedClient(null)
    } catch (err) {
      console.error('Error assigning guard:', err)
    }
  }

  const handleApplicationResponse = async (applicationId, status) => {
    try {
      await api.post('/admin/accept-application', { applicationId, status })
      fetchApplications()
    } catch (err) {
      console.error('Error responding to application:', err)
    }
  }

  const handleBillSubmit = async (e, userId) => {
    e.preventDefault()
    try {
      await api.post('/admin/generate-bill', { userId, ...billFormData })
      setBillFormData({
        amount: '',
        dueDate: '',
        description: '',
        driveLink: ''
      })
      setSelectedGuard(null)
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
            Client Applications
          </button>
          <button
            className={activeTab === 'security-applications' ? styles.active : ''}
            onClick={() => setActiveTab('security-applications')}
          >
            Guard Applications
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        {/* Guards Tab */}
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

        {/* Clients Tab */}
{activeTab === 'clients' && (
  <div className={styles.section}>
    <h3>Clients</h3>
    <div className={styles.list}>
      {clients.map(client => (
        <div key={client._id} className={styles.card}>
          <h4>{client.user.name}</h4>
          <p>Email: {client.user.email}</p>
          <p>Service Type: {client.serviceType}</p>
          <p>Status: {client.status || 'Unassigned'}</p>
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
                    }}
                  >
                    Assign
                  </button>
                </div>
              ))}
            {guards.filter(guard => guard.status === 'available').length === 0 && (
              <p>No available guards to assign.</p>
            )}
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


        {/* Client Applications Tab */}
        {activeTab === 'applications' && (
          <div className={styles.section}>
            <h3>New Client Applications</h3>
            <div className={styles.list}>
              {applications.map(application => (
                <div key={application._id} className={styles.card}>
                  <h4>{application.user.name}</h4>
                  <p>Email: {application.user.email}</p>
                  <p>Service Type: {application.serviceType}</p>
                  <p>Guards Required: {application.numberOfGuards}</p>
                  <p>Start Date: {new Date(application.startDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(application.endDate).toLocaleDateString()}</p>
                  <p>Location: {application.location}</p>
                  <p>Additional Details: {application.additionalDetails || 'N/A'}</p>
                  <p>Status: <span className={styles[application.status]}>{application.status}</span></p>
                  {application.status === 'pending' && (
                    <div className={styles.actions}>
                      <button
                        className={styles.acceptButton}
                        onClick={() => handleApplicationResponse(application._id, 'approved')}
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Applications Tab */}
        {activeTab === 'security-applications' && (
          <div className={styles.section}>
            <h3>Security Guard Applications</h3>
            <div className={styles.list}>
              {securityApplications.map(application => (
                <div key={application._id} className={styles.card}>
                  <h4>{application.user.name}</h4>
                  <p>Email: {application.user.email}</p>
                  <p>Experience: {application.experience} years</p>
                  <p>Availability: {application.availability}</p>
                  <p>Preferred Location: {application.preferredLocation}</p>
                  <p>Skills: {application.skills}</p>
                  <p>Expected Salary: ₹{application.expectedSalary}</p>
                  <p>Additional Details: {application.additionalDetails || 'N/A'}</p>
                  <p>Status: <span className={styles[application.status]}>{application.status}</span></p>
                  {application.status === 'pending' && (
                    <div className={styles.actions}>
                      <button
                        className={styles.acceptButton}
                        onClick={() => handleSecurityApplicationResponse(application._id, 'approved')}
                      >
                        Accept
                      </button>
                      <button
                        className={styles.rejectButton}
                        onClick={() => handleSecurityApplicationResponse(application._id, 'rejected')}
                      >
                        Decline
                      </button>
                    </div>
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

export default AdminDashboard

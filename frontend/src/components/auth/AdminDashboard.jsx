import { useState, useEffect } from 'react'
import styles from '../../styles/components/auth/dashboard.module.css'
import api, { admin } from '../../api'
import LoadingSpinner from '../common/LoadingSpinner'
import { useToast } from '../../context/ToastContext'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('guards')
  const [guards, setGuards] = useState([])
  const [clients, setClients] = useState([])
  const [applications, setApplications] = useState([])
  const [securityApplications, setSecurityApplications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const [selectedGuard, setSelectedGuard] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedGuards, setSelectedGuards] = useState([])

  const [billFormData, setBillFormData] = useState({
    amount: '',
    dueDate: '',
    description: '',
    driveLink: ''
  })

  const fetchAvailableGuards = async () => {
    try {
      setIsLoading(true)
      const response = await admin.getAllGuards()
      const availableGuards = response.data.data.filter(guard => guard.status === 'available')
      setGuards(availableGuards)
    } catch (error) {
      showToast('Error fetching guards: ' + error.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  

  const handleAssignmentFormChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1]
      setAssignmentForm(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }))
    } else {
      setAssignmentForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  useEffect(() => {
    // Fetch initial data
    fetchAvailableGuards()
    fetchClients()
    fetchApplications()
    fetchSecurityApplications()
  }, [])

  const fetchSecurityApplications = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/admin/security-applications')
      setSecurityApplications(response.data.data)
    } catch (err) {
      console.error('Error fetching security applications:', err)
      showToast('Failed to fetch security applications', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptSecurityApplication = async (applicationId) => {
    setIsLoading(true)
    try {
      await api.post('/admin/accept-security-application', { applicationId })
      showToast('Application accepted successfully', 'success')
      fetchSecurityApplications()
    } catch (err) {
      console.error('Error accepting application:', err)
      showToast('Failed to accept application', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectSecurityApplication = async (applicationId) => {
    setIsLoading(true)
    try {
      await api.post('/admin/reject-security-application', { applicationId })
      showToast('Application rejected successfully', 'success')
      fetchSecurityApplications()
    } catch (err) {
      console.error('Error rejecting application:', err)
      showToast('Failed to reject application', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecurityApplicationResponse = async (applicationId, status) => {
    setIsLoading(true)
    try {
      await api.post('/admin/security-applications/respond', { applicationId, status })
      await fetchSecurityApplications()
      if (status === 'approved') {
        await fetchGuards()
      }
      showToast(`Application ${status} successfully`, 'success')
    } catch (err) {
      console.error('Error responding to security application:', err)
      showToast('Failed to respond to application', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGuards = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/admin/guards')
      setGuards(Array.isArray(response.data) ? response.data.map(guard => ({
          _id: guard._id,
          name: guard.user.name,
          email: guard.user.email,
          status: guard.status,
          experience: guard.experience,
          specialization: guard.specialization,
          currentAssignment: guard.currentAssignment,
          rating: guard.rating,
          reviews: guard.reviews
        })) : [response.data]);
    } catch (err) {
      console.error('Error fetching guards:', err)
      showToast('Failed to fetch guards', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await admin.getAllClients();
  
      const clientsWithAssignments = Array.isArray(response.data)
        ? response.data.map((client) => {
            // Directly use the activeAssignments data, no need to re-fetch
            return {
              ...client,
              activeAssignments: client.activeAssignments || [],
            };
          })
        : [];
  
      setClients(clientsWithAssignments);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showToast('Error fetching clients: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/admin/applications')
      setApplications(Array.isArray(response.data) ? response.data : [response.data])
    } catch (err) {
      console.error('Error fetching applications:', err)
      showToast('Failed to fetch applications', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignGuard = async (clientId, guardId) => {
    setIsLoading(true)
    try {
      await admin.assignGuard({ clientId, guardId })
      await fetchClients()
      await fetchGuards()
      setSelectedClient(null)
      showToast('Guard assigned successfully', 'success')
    } catch (err) {
      console.error('Error assigning guard:', err)
      showToast('Failed to assign guard', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawGuard = async (clientId, guardId) => {
    setIsLoading(true)
    try {
      await admin.withdrawGuard({ clientId, guardId })
      await fetchClients()
      await fetchGuards()
      showToast('Guard withdrawn successfully', 'success')
    } catch (err) {
      console.error('Error withdrawing guard:', err)
      showToast('Failed to withdraw guard', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplicationResponse = async (applicationId, status) => {
    setIsLoading(true)
    try {
      await api.post('/admin/accept-application', { applicationId, status })
      await fetchApplications()
      showToast(`Application ${status} successfully`, 'success')
    } catch (err) {
      console.error('Error responding to application:', err)
      showToast('Failed to respond to application', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBillSubmit = async (e, userId) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/admin/generate-bill', { userId, ...billFormData })
      setBillFormData({
        amount: '',
        dueDate: '',
        description: '',
        driveLink: ''
      })
      setSelectedGuard(null)
      showToast('Bill generated successfully', 'success')
    } catch (err) {
      console.error('Error generating bill:', err)
      showToast('Failed to generate bill', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.dashboard}>
      {isLoading && <LoadingSpinner />}
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
            Security Applications
          </button>
        </nav>
      </div>

      <div className={styles.content}>
        {activeTab === 'security-applications' && (
          <div className={styles.section}>
            <h3>Security Guard Applications</h3>
            <div className={styles.list}>
              {securityApplications.map(application => (
                <div key={application._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h4>{application.fullName}</h4>
                    <span className={styles[application.status]}>
                      {application.status}
                    </span>
                  </div>
                  <p>Email: {application.user.email}</p>
                  <p>Phone: {application.phoneNumber}</p>
                  <p>Experience: {application.experience} years</p>
                  <p>Qualifications: {application.qualifications}</p>
                  {application.previousEmployer && (
                    <p>Previous Employer: {application.previousEmployer}</p>
                  )}
                  <div className={styles.actions}>
                    {application.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAcceptSecurityApplication(application._id)}
                          className={styles.acceptButton}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectSecurityApplication(application._id)}
                          className={styles.rejectButton}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Guards Tab */}
        {activeTab === 'assignments' && (
          <div className={styles.section}>
            <h2>Assign Guards to Clients</h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className={styles.assignmentContainer}>
                <form onSubmit={handleAssignmentSubmit} className={styles.assignmentForm}>
                  <div className={styles.formGroup}>
                    <label>Select Guard:</label>
                    <select
                      name="guardId"
                      value={assignmentForm.guardId}
                      onChange={handleAssignmentFormChange}
                      required
                    >
                      <option value="">Select a guard</option>
                      {guards.map((guard) => (
                        <option key={guard._id} value={guard._id}>
                          {guard.user.name} - {guard.experience} years exp.
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Select Client:</label>
                    <select
                      name="clientId"
                      value={assignmentForm.clientId}
                      onChange={handleAssignmentFormChange}
                      required
                    >
                      <option value="">Select a client</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Start Date:</label>
                    <input
                      type="date"
                      name="startDate"
                      value={assignmentForm.startDate}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>End Date:</label>
                    <input
                      type="date"
                      name="endDate"
                      value={assignmentForm.endDate}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Shift:</label>
                    <select
                      name="shift"
                      value={assignmentForm.shift}
                      onChange={handleAssignmentFormChange}
                      required
                    >
                      <option value="day">Day Shift</option>
                      <option value="night">Night Shift</option>
                      <option value="24h">24 Hours</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location.street"
                      placeholder="Street"
                      value={assignmentForm.location.street}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                    <input
                      type="text"
                      name="location.city"
                      placeholder="City"
                      value={assignmentForm.location.city}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                    <input
                      type="text"
                      name="location.state"
                      placeholder="State"
                      value={assignmentForm.location.state}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                    <input
                      type="text"
                      name="location.zipCode"
                      placeholder="ZIP Code"
                      value={assignmentForm.location.zipCode}
                      onChange={handleAssignmentFormChange}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Assigning...' : 'Assign Guard'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'guards' && (
          <div className={styles.section}>
            <h3>Security Guards</h3>
            <div className={styles.list}>
              {guards.map(guard => (
                <div key={guard._id} className={styles.card}>
                  <h4>{guard?.user?.name}</h4>
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

    {isLoading ? (
      <p>Loading clients...</p>
    ) : clients.length === 0 ? (
      <p>No clients found.</p>
    ) : (
      <div className={styles.list}>
        {clients.map(client => (
          <div key={client._id} className={styles.card}>
            <h4>{client?.user?.name || 'No Name'}</h4>
            <p>Email: {client?.user?.email || 'N/A'}</p>
            <p>Service Type: {client?.serviceType || 'N/A'}</p>
            <p>Status: {client?.status || 'Unassigned'}</p>

            {client?.activeAssignments?.length > 0 ? (
              <div className={styles.assignmentInfo}>
                <h4>Active Assignments</h4>
                {client.activeAssignments.map((assignment) => (
                  <div key={assignment._id} className={styles.assignmentDetails}>
                    <p><strong>Guard Name:</strong> {assignment?.guard?.user?.name || 'N/A'}</p>
                    <p><strong>Guard Phone:</strong> {assignment?.guard?.phoneNumber || 'N/A'}</p>
                    <p><strong>Location:</strong> {assignment?.location?.street || 'N/A'}, {assignment?.location?.city || ''}</p>
                    <p><strong>Shift:</strong> {assignment?.shift || 'N/A'}</p>
                    <p><strong>Start Date:</strong> {assignment?.startDate ? new Date(assignment.startDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>End Date:</strong> {assignment?.endDate ? new Date(assignment.endDate).toLocaleDateString() : 'Ongoing'}</p>
                    <button
                      className={styles.withdrawButton}
                      onClick={() => handleWithdrawGuard(client._id, assignment?.guard?._id)}
                    >
                      Withdraw Guard
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={() => {
                  setSelectedClient(client);
                  setShowAssignModal(true);
                }}
              >
                Assign Guard
              </button>
            )}
          </div>
        ))}
      </div>
    )}

    {selectedClient && showAssignModal && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <h3>Assign Guard to {selectedClient?.user?.name || 'Client'}</h3>
          <div className={styles.guardList}>
            {guards.filter(guard => guard.status === 'available').length === 0 ? (
              <p>No available guards to assign.</p>
            ) : (
              guards
                .filter(guard => guard.status === 'available')
                .map(guard => (
                  <div key={guard._id} className={styles.guardCard}>
                    <h4>{guard?.name || 'N/A'}</h4>
                    <p>Experience: {guard?.experience || 'N/A'}</p>
                    <button
                      onClick={() => {
                        handleAssignGuard(selectedClient._id, guard._id);
                      }}
                    >
                      Assign
                    </button>
                  </div>
                ))
            )}
          </div>
          <button
            className={styles.closeButton}
            onClick={() => {
              setSelectedClient(null);
              setShowAssignModal(false);
            }}
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

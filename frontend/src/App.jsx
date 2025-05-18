import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Import components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Landing from './pages/Landing'
import About from './pages/About'
import Services from './pages/Services'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import OTPVerification from './components/auth/OTPVerification'
import ForgotPassword from './components/auth/ForgotPassword'
import AdminDashboard from './components/auth/AdminDashboard'
import ClientDashboard from './components/auth/ClientDashboard'
import SecurityDashboard from './components/auth/SecurityDashboard'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    
    if (token) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/security-dashboard"
              element={
                <ProtectedRoute allowedRoles={['security']}>
                  <SecurityDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default App
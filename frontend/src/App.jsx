import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Import components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Landing from './pages/LandingPage'
import About from './pages/About'
import Services from './pages/Services'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import OTPVerification from './components/auth/OTPVerification'
import ForgotPassword from './components/auth/ForgotPassword'
import AdminDashboard from './components/auth/AdminDashboard'
import ClientDashboard from './components/auth/ClientDashboard'
import SecurityDashboard from './components/auth/SecurityDashboard'
import { AuthProvider } from './context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check auth status
    if (token && allowedRoles.includes(role)) {
      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [token, role, allowedRoles])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />
  }

  return children
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

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
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
    </AuthProvider>
  )
}

export default App
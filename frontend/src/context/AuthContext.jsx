import { createContext, useState, useEffect } from 'react'

// Create auth context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      
      if (token) {
        setIsAuthenticated(true)
        setUserRole(role)
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setIsAuthenticated(false)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
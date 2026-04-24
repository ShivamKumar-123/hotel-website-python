import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearStoredTokens,
  fetchMe,
  getStoredTokens,
  loginRequest,
  setStoredTokens,
} from '../services/api'
import { AuthContext } from './sessionContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [bootstrapping, setBootstrapping] = useState(true)

  const refreshProfile = useCallback(async () => {
    const { access } = getStoredTokens()
    if (!access) {
      setUser(null)
      return null
    }
    try {
      const me = await fetchMe()
      setUser(me)
      return me
    } catch {
      clearStoredTokens()
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await refreshProfile()
      if (!cancelled) setBootstrapping(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshProfile])

  const login = useCallback(
    async (email, password) => {
      const data = await loginRequest(email, password)
      if (data.user) {
        setUser(data.user)
      } else {
        await refreshProfile()
      }
      return data
    },
    [refreshProfile],
  )

  const logout = useCallback(() => {
    clearStoredTokens()
    setUser(null)
  }, [])

  const applySession = useCallback((access, refresh, nextUser) => {
    setStoredTokens(access, refresh)
    if (nextUser) setUser(nextUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      login,
      logout,
      refreshProfile,
      applySession,
      isStaff: Boolean(user && (user.role === 'staff' || user.role === 'admin')),
      isAdmin: Boolean(user && user.role === 'admin'),
    }),
    [user, bootstrapping, login, logout, refreshProfile, applySession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

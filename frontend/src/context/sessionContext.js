import { createContext } from 'react'

/**
 * React context instance (separate file name avoids Windows resolving
 * `./AuthContext` to `authContext.js` instead of `AuthContext.jsx`).
 */
export const AuthContext = createContext(null)

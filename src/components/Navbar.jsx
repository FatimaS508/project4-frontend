import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout, user} = useAuth()
  return (
    <nav>
      {user ? (
        <>
          <button onClick={logout}>Sign Out</button>

          {user.role === "employee" && (
            <>
              <Link to="/dashboard">Support</Link>
              <Link to="/requests">All Requests</Link>
            </>
          )}
        </>
      ) : (
        <>
          <Link to="/sign-up">Sign Up</Link>
          <Link to="/sign-in">Sign In</Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
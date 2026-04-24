/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../dashboard/layout/DashboardLayout'
import Loader from '../components/common/Loader'
import { useAuth } from '../hooks/useAuth'

// Lazy-loaded marketing + auth pages
const Home = lazy(() => import('../pages/Home.jsx'))
const Rooms = lazy(() => import('../pages/Rooms.jsx'))
const RoomDetails = lazy(() => import('../pages/RoomDetails.jsx'))
const BookingLayout = lazy(() => import('../pages/booking/BookingLayout.jsx'))
const BookingStepStay = lazy(() => import('../pages/booking/BookingStepStay.jsx'))
const BookingStepGuests = lazy(() => import('../pages/booking/BookingStepGuests.jsx'))
const BookingStepPayment = lazy(() => import('../pages/booking/BookingStepPayment.jsx'))
const MyBookings = lazy(() => import('../pages/MyBookings.jsx'))
const Contact = lazy(() => import('../pages/Contact.jsx'))
const About = lazy(() => import('../pages/About.jsx'))
const Login = lazy(() => import('../pages/Login.jsx'))
const Register = lazy(() => import('../pages/Register.jsx'))
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('../pages/ResetPassword.jsx'))

// Lazy-loaded dashboard modules
const DashboardHome = lazy(() => import('../dashboard/pages/DashboardHome.jsx'))
const RoomsManage = lazy(() => import('../dashboard/pages/RoomsManage.jsx'))
const BookingsManage = lazy(() => import('../dashboard/pages/BookingsManage.jsx'))
const UsersManage = lazy(() => import('../dashboard/pages/UsersManage.jsx'))
const ReviewsManage = lazy(() => import('../dashboard/pages/ReviewsManage.jsx'))
const HomeContentManage = lazy(() => import('../dashboard/pages/HomeContentManage.jsx'))

function SuspensePage({ children }) {
  return (
    <Suspense fallback={<Loader label="Arriving…" variant="overlay" />}>{children}</Suspense>
  )
}

/**
 * Restricts /dashboard/* to staff and admin accounts.
 */
function StaffGate() {
  const { bootstrapping, isStaff } = useAuth()
  const location = useLocation()

  if (bootstrapping) {
    return <Loader label="Restoring session…" variant="overlay" />
  }
  if (!isStaff) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <SuspensePage><Home /></SuspensePage> },
      { path: 'rooms', element: <SuspensePage><Rooms /></SuspensePage> },
      { path: 'rooms/:slug', element: <SuspensePage><RoomDetails /></SuspensePage> },
      {
        path: 'booking',
        element: <SuspensePage><BookingLayout /></SuspensePage>,
        children: [
          { index: true, element: <SuspensePage><BookingStepStay /></SuspensePage> },
          { path: 'guests', element: <SuspensePage><BookingStepGuests /></SuspensePage> },
          { path: 'payment', element: <SuspensePage><BookingStepPayment /></SuspensePage> },
        ],
      },
      { path: 'my-bookings', element: <SuspensePage><MyBookings /></SuspensePage> },
      { path: 'contact', element: <SuspensePage><Contact /></SuspensePage> },
      { path: 'about', element: <SuspensePage><About /></SuspensePage> },
      { path: 'login', element: <SuspensePage><Login /></SuspensePage> },
      { path: 'register', element: <SuspensePage><Register /></SuspensePage> },
      { path: 'forgot-password', element: <SuspensePage><ForgotPassword /></SuspensePage> },
      { path: 'reset-password', element: <SuspensePage><ResetPassword /></SuspensePage> },
    ],
  },
  {
    path: '/dashboard',
    element: <StaffGate />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <SuspensePage><DashboardHome /></SuspensePage> },
          { path: 'rooms', element: <SuspensePage><RoomsManage /></SuspensePage> },
          { path: 'bookings', element: <SuspensePage><BookingsManage /></SuspensePage> },
          { path: 'users', element: <SuspensePage><UsersManage /></SuspensePage> },
          { path: 'reviews', element: <SuspensePage><ReviewsManage /></SuspensePage> },
          { path: 'home-content', element: <SuspensePage><HomeContentManage /></SuspensePage> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

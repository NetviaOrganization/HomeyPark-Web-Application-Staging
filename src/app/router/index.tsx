import { createBrowserRouter, Navigate } from 'react-router'
import FindYourParkPage from '../features/parking/pages/FindYourParkPage'
import MyReservationsPage from '../features/reservations/pages/MyReservationsPage'
import MyParkingsPage from '../features/parking/pages/MyParkingsPage'
import NotFoundPage from '../../shared/page/NotFoundPage'
import ParkingDetailPage from '../features/parking/pages/ParkingDetailPage'
import CreateEditParkingPage from '../features/parking/pages/CreateEditParkingPage'
import ProfilePage from '../features/profile/ProfilePage'
import MyVehiclesListPage from '../features/vehicles/pages/MyVehiclesListPage'
import { LoginRedirect, SignupRedirect, ProtectedRoute } from './ProtectedRoute'
import ReservationParkingPage from '../features/reservations/pages/ReservationParkingPage'
import HostReservationsPage from '../features/reservations/pages/HostReservationsPage'
import ReservationDetailPage from '../features/reservations/pages/ReservationDetailPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRedirect />,
  },
  { path: '/signup', element: <SignupRedirect /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    // Component: ProtectedRoute,
    children: [
      {
        path: '',
        Component: () => <Navigate to="/find-your-parking" replace />,
      },
      {
        path: '/find-your-parking',
        children: [
          {
            path: '',
            Component: FindYourParkPage,
          },
          {
            path: ':id',
            Component: ParkingDetailPage,
          },
        ],
      },
      {
        path: '/my-reservations',
        Component: MyReservationsPage,
      },
      {
        path: '/host-reservations',
        Component: HostReservationsPage,
      },
      {
        path: '/reservations/:id',
        Component: ReservationDetailPage,
      },
      {
        path: '/checkout/:parkingId',
        Component: ReservationParkingPage,
      },
      {
        path: '/my-garages',
        // Component: MyParkingsPage,
        children: [
          { path: '', Component: MyParkingsPage },
          {
            id: 'parking/create',
            path: 'create',
            Component: CreateEditParkingPage,
          },
          {
            id: 'parking/edit',
            path: 'edit/:id',
            Component: CreateEditParkingPage,
          },
        ],
      },
      {
        path: '/profile',
        Component: ProfilePage,
      },
      {
        path: '/vehicles',
        Component: MyVehiclesListPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
])

import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { classNames } from 'primereact/utils'
import { NavLink } from 'react-router-dom'

import logo from '@/assets/logo.png'
import { useAppStore } from '@/app/store/store'
import { logout } from '@/app/features/auth/useCases/logout'

const Sidebar = () => {
  const email = useAppStore((state) => state.auth.email)
  const profile = useAppStore((state) => state.profileData.profile)

  const items: MenuItem[] = [
    {
      label: 'Explora',
      items: [
        {
          label: 'Buscar un garage',
          template: (item) => (
            <NavLink
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
              to="/find-your-parking"
            >
              {item.label}
            </NavLink>
          ),
        },
        {
          label: 'Mis reservas',
          template: (item) => (
            <NavLink
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
              to="/my-reservations"
            >
              {item.label}
            </NavLink>
          ),
        },
      ],
    },
    {
      label: 'Renta un garaje',
      items: [
        {
          label: 'Mis garages',
          template: (item) => (
            <NavLink
              to="/my-garages"
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          ),
        },
        {
          label: 'Reservas entrantes',
          template: (item) => (
            <NavLink
              to="/host-reservations"
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          ),
        },
      ],
    },
    {
      label: 'Usuario',
      items: [
        {
          label: 'Mi perfil',
          template: (item) => (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          ),
        },
        {
          label: 'Mis vehículos',
          template: (item) => (
            <NavLink
              to="/vehicles"
              className={({ isActive }) =>
                classNames('px-5 py-3 block w-full text-sm', {
                  'bg-gray-100': isActive,
                })
              }
            >
              {item.label}
            </NavLink>
          ),
        },
      ],
    },
  ]

  return (
    <div className="max-w-96 w-full border-r-slate-100 border-r px-6 py-6 flex flex-col">
      <div className="w-40 mx-auto mb-4">
        <img className="w-full" src={logo} alt="HomeyPark Logo" />
      </div>
      <Menu model={items} className="w-full text-sm" />
      <div className="h-full"></div>

      <div className="border border-slate-100 rounded-lg p-4">
        <div className="flex gap-4 items-center">
          <div className="shrink-0">
            <i className="pi pi-user"></i>
          </div>
          <div className="w-full">
            <p className="text-sm font-semibold">
              {profile?.firstName} {profile?.lastName}
            </p>
            <p className="text-xs">{email}</p>
          </div>
          <div className="shrink-0 flex">
            <Button size="small" text icon="pi pi-sign-out" severity="danger" onClick={logout} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

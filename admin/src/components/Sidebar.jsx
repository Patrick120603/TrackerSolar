import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { SolarAdminContext } from '../context/SolarAdminContext.jsx'

const Sidebar = () => {
  const { aToken } = useContext(SolarAdminContext)

  if (!aToken) return null

  return (
    <div className='min-h-screen bg-white border-r border-gray-100 w-64 pt-6 flex flex-col gap-2 shadow-sm select-none'>
      
      <NavLink 
        to='/dashboard' 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all border-l-4
          ${isActive 
            ? 'bg-amber-50 text-amber-600 border-amber-500' 
            : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700'
          }
        `}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
        </svg>
        <span>Panou Control</span>
      </NavLink>

      <NavLink 
        to='/control-manual' 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all border-l-4
          ${isActive 
            ? 'bg-amber-50 text-amber-600 border-amber-500' 
            : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700'
          }
        `}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
        </svg>
        <span>Control Manual</span>
      </NavLink>

      <NavLink 
        to='/istoric-telemetrie' 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all border-l-4
          ${isActive 
            ? 'bg-amber-50 text-amber-600 border-amber-500' 
            : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700'
          }
        `}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Istoric Telemetrie</span>
      </NavLink>

      <NavLink 
        to='/configurare-hardware' 
        className={({ isActive }) => `
          flex items-center gap-3 px-6 py-3.5 text-sm font-semibold transition-all border-l-4
          ${isActive 
            ? 'bg-amber-50 text-amber-600 border-amber-500' 
            : 'text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700'
          }
        `}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span>Configurare Panou</span>
      </NavLink>

    </div>
  )
}

export default Sidebar
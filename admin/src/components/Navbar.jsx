import { useContext } from 'react'
import { SolarAdminContext } from '../context/SolarAdminContext.jsx'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { aToken, setAToken } = useContext(SolarAdminContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white w-full shadow-sm'>
      <div className='flex items-center gap-3'>
        <div onClick={() => navigate('/')} className='flex items-center gap-2 cursor-pointer select-none'>
          <svg className="w-7 h-7 text-amber-500 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <span className='text-xl font-extrabold tracking-tight text-gray-800 font-sans'>
            Solar<span className='text-amber-500'>Track</span>
          </span>
        </div>
        
        <p className='border px-3 py-0.5 rounded-full border-amber-200 text-amber-700 text-xs font-semibold bg-amber-50/50 hidden sm:block'>
          {aToken ? 'Consolă Operator' : 'Sistem Deconectat'}
        </p>
      </div>
      
      {aToken && (
        <button onClick={logout} className='bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all shadow-md'>
          Deconectare
        </button>
      )}
    </div>
  )
}

export default Navbar
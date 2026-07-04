import { useContext, useState } from 'react'
import { SolarAdminContext } from '../context/SolarAdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setAToken, backendUrl } = useContext(SolarAdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
      if (data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='flex flex-col gap-4 p-8 min-w-[340px] bg-white rounded-xl shadow-lg border border-gray-100'>
        <div className='w-full text-center border-b pb-3'>
          <p className='text-xl font-bold text-primary'>SolarTrack Panel</p>
          <p className='text-xs text-gray-400 mt-1'>Autentificare Operator Sistem Solar</p>
        </div>
        <div className='w-full'>
          <label className='text-xs font-semibold text-gray-500'>Email Administrator</label>
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border rounded-lg w-full p-2.5 mt-1 text-sm focus:outline-none focus:border-primary' 
            required 
            placeholder="admin@email.com" 
          />
        </div>
        <div className='w-full'>
          <label className='text-xs font-semibold text-gray-500'>Parolă</label>
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border rounded-lg w-full p-2.5 mt-1 text-sm focus:outline-none focus:border-primary' 
            required 
            placeholder="••••••••" 
          />
        </div>
        <button 
          type='submit' 
          className='bg-primary text-white w-full py-2.5 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all shadow-md mt-2'
        >
          Conectare Consolă
        </button>
      </div>
    </form>
  )
}

export default Login
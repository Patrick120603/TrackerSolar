import { useState } from 'react'
import { toast } from 'react-toastify'

const ConfigurarePanou = () => {
  const [limitaMin, setLimitaMin] = useState(15)
  const [limitaMax, setLimitaMax] = useState(165)
  const [tolerantaLDR, setTolerantaLDR] = useState(40)

  const salvareConfigurare = (e) => {
    e.preventDefault()
    toast.success("Parametrii hardware au fost actualizați cu succes!")
  }

  return (
    <div className='m-5 w-full max-w-3xl'>
      <h1 className='text-xl font-semibold text-gray-800 mb-6'>Configurare Parametri Hardware</h1>
      
      <form onSubmit={salvareConfigurare} className='bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Unghi Minim Servomotoare (Siguranță)</label>
            <input 
              type="number" 
              value={limitaMin} 
              onChange={(e) => setLimitaMin(e.target.value)}
              className='w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-2'>Unghi Maxim Servomotoare (Siguranță)</label>
            <input 
              type="number" 
              value={limitaMax} 
              onChange={(e) => setLimitaMax(e.target.value)}
              className='w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-600 mb-2'>Sensibilitate / Toleranță Senzori LDR</label>
          <input 
            type="number" 
            value={tolerantaLDR} 
            onChange={(e) => setTolerantaLDR(e.target.value)}
            className='w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary'
          />
          <p className='text-[11px] text-gray-400 mt-1.5'>Valoarea reprezintă diferența de intensitate luminoasă de la care motoarele pornesc mișcarea.</p>
        </div>

        <button 
          type='submit' 
          className='bg-primary text-white text-sm px-8 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-medium'
        >
          Salvează Configurația
        </button>
      </form>
    </div>
  )
}

export default ConfigurarePanou
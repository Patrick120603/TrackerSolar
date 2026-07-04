import { useContext, useEffect } from 'react'
import { SolarAdminContext } from '../../context/SolarAdminContext.jsx'

const Dashboard = () => {
  const { telemetrie, obtineDateTelemetrie, incarcare } = useContext(SolarAdminContext)

  useEffect(() => {
    if (obtineDateTelemetrie) {
      obtineDateTelemetrie()
    }
  }, [])

  const totalLoguri = telemetrie ? telemetrie.length : 0
  const ultimaTensiune = telemetrie && telemetrie.length > 0 ? telemetrie[0].tensiunePanou : 0
  const ultimulMod = telemetrie && telemetrie.length > 0 ? telemetrie[0].modFunctionare : 'AUTOMAT_LDR'

  return (
    <div className='m-5 w-full max-w-6xl'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold text-gray-800'>Consolă Monitorizare Tracker Solar</h1>
        <p className='text-xs text-gray-400 mt-1'>Starea în timp real a parametrilor fizici și a poziției structurii</p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8'>
        
        <div className='bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-blue-50 text-blue-500 rounded-lg flex-shrink-0'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
            </svg>
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>{totalLoguri}</p>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5'>Total Înregistrări</p>
          </div>
        </div>

        <div className='bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-emerald-50 text-emerald-500 rounded-lg flex-shrink-0'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <p className='text-2xl font-bold text-emerald-600'>{ultimaTensiune} V</p>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5'>Ultima Tensiune Citită</p>
          </div>
        </div>

        <div className='bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4'>
          <div className='p-3 bg-amber-50 text-amber-500 rounded-lg flex-shrink-0'>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <div>
            <p className='text-lg font-bold text-gray-800 uppercase tracking-tight'>{totalLoguri > 0 ? 'ACTIV' : 'INACTIV'}</p>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5'>Mod: {ultimulMod}</p>
          </div>
        </div>

      </div>

      <div className='w-full bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[250px] flex flex-col justify-between'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-sm font-bold text-gray-700 uppercase tracking-wide'>Ultimele Activități Hardware</h2>
          <button 
            onClick={obtineDateTelemetrie} 
            className='text-amber-600 hover:text-amber-700 text-xs font-semibold flex items-center gap-1 transition-colors'
          >
            Reîmprospătează datele
          </button>
        </div>

        {incarcare ? (
          <div className='flex justify-center items-center py-12 text-sm text-gray-400 gap-2'>
            <span className='animate-spin'>⏳</span> Se preiau datele din baza de date...
          </div>
        ) : totalLoguri === 0 ? (
          <div className='text-center py-12 text-sm text-gray-400 select-none'>
            Nu există date recepționate recent de la trackerul solar.
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100'>
                    <th className='py-3 px-4'>Dată / Oră</th>
                    <th className='py-3 px-4'>Unghi H</th>
                    <th className='py-3 px-4'>Unghi V</th>
                    <th className='py-3 px-4'>Tensiune</th>
                    <th className='py-3 px-4'>Curent</th>
                    <th className='py-3 px-4'>Mod</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50 text-xs text-gray-700'>
                  {telemetrie.slice(0, 5).map((item, index) => (
                    <tr key={index} className='hover:bg-gray-50/80 transition-colors'>
                      <td className='py-3 px-4 text-gray-500'>
                        {item.timestamp ? new Date(item.timestamp).toLocaleString('ro-RO') : 'N/A'}
                      </td>
                      <td className='py-3 px-4'>
                        <span className='px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium'>
                          {item.unghiOrizontal || 0}°
                        </span>
                      </td>
                      <td className='py-3 px-4'>
                        <span className='px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium'>
                          {item.unghiVertical || 0}°
                        </span>
                      </td>
                      <td className='py-3 px-4 font-semibold text-emerald-600'>
                        {item.tensiunePanou || 0} V
                      </td>
                      <td className='py-3 px-4 font-semibold text-teal-600'>
                        {item.curentProdus || 0} mA
                      </td>
                      <td className='py-3 px-4'>
                        <span className='bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-medium'>
                          {item.modFunctionare || 'AUTOMAT_LDR'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='text-xs text-gray-400 mt-2 select-none'>
              Sistemul rulează stabil. Baza de date conține ultimele {totalLoguri} evenimente transmise de dispozitivul hardware.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
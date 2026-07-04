import { useContext, useEffect } from 'react'
import { SolarAdminContext } from '../../context/SolarAdminContext.jsx'

const IstoricTelemetrie = () => {
  const { telemetrie, obtineDateTelemetrie, incarcare } = useContext(SolarAdminContext)

  useEffect(() => {
    if (obtineDateTelemetrie) {
      obtineDateTelemetrie()
    }
  }, [])

  return (
    <div className='m-5 w-full max-w-6xl'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-xl font-semibold text-gray-800'>Istoric Telemetrie Tracker Solar</h1>
        <button 
          onClick={obtineDateTelemetrie} 
          className='bg-primary text-white text-xs px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2'
        >
          <span className="material-symbols-outlined text-sm">refresh</span> Refresh Date
        </button>
      </div>

      <div className='w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        {incarcare ? (
          <div className='flex justify-center items-center py-20 text-gray-500 gap-2'>
            <span className="animate-spin material-symbols-outlined">sync</span> Se încarcă datele...
          </div>
        ) : !telemetrie || telemetrie.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>
            Nu s-au găsit înregistrări în baza de date.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100'>
                  <th className='py-4 px-6'>Dată / Oră</th>
                  <th className='py-4 px-6'>Unghi Orizontal</th>
                  <th className='py-4 px-6'>Unghi Vertical</th>
                  <th className='py-4 px-6'>Tensiune</th>
                  <th className='py-4 px-6'>Mod Sistem</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50 text-sm text-gray-700'>
                {telemetrie.map((item, index) => (
                  <tr key={index} className='hover:bg-gray-50/80 transition-colors'>
                    <td className='py-4 px-6 text-gray-500'>
                      {item.timestamp ? new Date(item.timestamp).toLocaleString('ro-RO') : 'N/A'}
                    </td>
                    <td className='py-4 px-6'>
                      <span className='px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100'>
                        {item.unghiOrizontal || 0}°
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <span className='px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100'>
                        {item.unghiVertical || 0}°
                      </span>
                    </td>
                    <td className='py-4 px-6 font-semibold text-emerald-600'>
                      {item.tensiunePanou || 0} V
                    </td>
                    <td className='py-4 px-6'>
                      <span className='bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'>
                        {item.modFunctionare || 'AUTOMAT_LDR'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default IstoricTelemetrie
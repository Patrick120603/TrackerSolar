import { useContext, useState, useEffect } from 'react'
import { SolarAdminContext } from '../../context/SolarAdminContext.jsx'

const ControlMotoare = () => {
  const { telemetrie, schimbaModHardware, trimiteUnghiuriHardware } = useContext(SolarAdminContext)

  const [stareMod, setStareMod] = useState(2)
  const [unghiH, setUnghiH] = useState(90)
  const [unghiV, setUnghiV] = useState(90)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized && telemetrie && telemetrie.length > 0) {
      const celeMaiNoiDate = telemetrie[0];
      const modInitial = Number(celeMaiNoiDate.modFunctionare) || 2;
      setStareMod(modInitial);
      setUnghiH(celeMaiNoiDate.unghiOrizontal || 90);
      setUnghiV(celeMaiNoiDate.unghiVertical || 90);
      setHasInitialized(true);
    }
  }, [telemetrie, hasInitialized])

  useEffect(() => {
    if (hasInitialized && (stareMod === 1 || stareMod === 2) && telemetrie && telemetrie.length > 0) {
      const celeMaiNoiDate = telemetrie[0];
      setUnghiH(celeMaiNoiDate.unghiOrizontal || 90);
      setUnghiV(celeMaiNoiDate.unghiVertical || 90);
    }
  }, [telemetrie, stareMod, hasInitialized])

  const schimbaModSistem = async (noulMod) => {
    setStareMod(noulMod)
    await schimbaModHardware(noulMod)
  }

  const trimiteComandaDirectie = (directie) => {
    if (stareMod !== 3) return;

    let noulUnghiV = unghiV;
    let noulUnghiH = unghiH;

    if (directie === 'SUS' && unghiV < 130) {
      noulUnghiV = Math.min(130, unghiV + 5);
      setUnghiV(noulUnghiV);
    }
    if (directie === 'JOS' && unghiV > 30) {
      noulUnghiV = Math.max(30, unghiV - 5);
      setUnghiV(noulUnghiV);
    }
    if (directie === 'STANGA' && unghiH > 15) {
      noulUnghiH = Math.max(15, unghiH - 5);
      setUnghiH(noulUnghiH);
    }
    if (directie === 'DREAPTA' && unghiH < 165) {
      noulUnghiH = Math.min(165, unghiH + 5);
      setUnghiH(noulUnghiH);
    }

    trimiteUnghiuriHardware(noulUnghiH, noulUnghiV);
  }

  return (
    <div className='m-5 w-full max-w-5xl'>
      <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-xl font-bold text-gray-800'>Terminal Control Servomotoare</h1>
          <p className='text-xs text-gray-400 mt-1'>Gestionarea orientării și modului de rulare pentru axele trackerului</p>
        </div>

        <div className='flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-inner'>
          <button
            type="button"
            onClick={() => schimbaModSistem(1)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${stareMod === 1
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            🌌 1. ASTRONOMIC
          </button>

          <button
            type="button"
            onClick={() => schimbaModSistem(2)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${stareMod === 2
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            ☀️ 2. AUTOMAT (LDR)
          </button>

          <button
            type="button"
            onClick={() => schimbaModSistem(3)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${stareMod === 3
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
              }`}
          >
            🎮 3. MANUAL SITE
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden'>
          <h2 className='text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-4 left-6'>Control Direcție</h2>

          {stareMod !== 3 && (
            <div className='absolute inset-0 bg-gray-50/85 backdrop-blur-[1px] flex flex-col justify-center items-center z-10 p-6 text-center select-none'>
              <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p className='text-sm font-bold text-gray-700'>Controlul Manual este Blocat</p>
              <p className='text-xs text-gray-400 max-w-xs mt-1'>
                Sistemul rulează automat în {stareMod === 1 ? 'Modul Astronomic' : 'Modul bazat pe Senzori LDR'}. Selectați „3. MANUAL SITE” din colț pentru control la tastă.
              </p>
            </div>
          )}

          <div className='flex flex-col items-center gap-2 my-4'>
            <button
              type="button"
              onClick={() => trimiteComandaDirectie('SUS')}
              className='w-14 h-14 bg-gray-50 hover:bg-purple-50 active:scale-95 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-xl flex items-center justify-center transition-all shadow-sm'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
              </svg>
            </button>

            <div className='flex gap-8'>
              <button
                type="button"
                onClick={() => trimiteComandaDirectie('STANGA')}
                className='w-14 h-14 bg-gray-50 hover:bg-purple-50 active:scale-95 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-xl flex items-center justify-center transition-all shadow-sm'
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/xl">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => trimiteComandaDirectie('DREAPTA')}
                className='w-14 h-14 bg-gray-50 hover:bg-purple-50 active:scale-95 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-xl flex items-center justify-center transition-all shadow-sm'
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={() => trimiteComandaDirectie('JOS')}
              className='w-14 h-14 bg-gray-50 hover:bg-purple-50 active:scale-95 text-gray-600 hover:text-purple-600 border border-gray-200 rounded-xl flex items-center justify-center transition-all shadow-sm'
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center gap-4 min-h-[300px] relative'>
          <h2 className='text-xs font-bold text-gray-400 uppercase tracking-widest absolute top-4 left-6'>Poziție Servomotoare</h2>

          <div className='flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50 mt-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/xl">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-700'>Axa Orizontală (Bază)</p>
                <p className='text-xs text-gray-400'>Orientare Est-Vest</p>
              </div>
            </div>
            <span className='bg-blue-50 text-blue-700 text-sm font-bold px-3 py-1.5 rounded-lg border border-blue-100'>
              {unghiH}°
            </span>
          </div>

          <div className='flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/50'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-indigo-50 text-indigo-600 rounded-lg'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-700'>Axa Verticală (Panou)</p>
                <p className='text-xs text-gray-400'>Orientare Azimut / Eleviție</p>
              </div>
            </div>
            <span className='bg-indigo-50 text-indigo-700 text-sm font-bold px-3 py-1.5 rounded-lg border border-indigo-100'>
              {unghiV}°
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlMotoare
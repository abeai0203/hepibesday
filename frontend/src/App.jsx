import { useState } from 'react'
import Landing from './components/Landing'
import GenderSelection from './components/GenderSelection'
import DateSelection from './components/DateSelection'
import Analyzing from './components/Analyzing'
import Traits from './components/Traits'
import Results from './components/Results'

function App() {
  const [step, setStep] = useState('landing')
  const [sessionData, setSessionData] = useState({
    gender: null,
    birthDate: null,
    sessionId: null,
    zodiac: null,
    traits: []
  })

  const handleNext = (nextStep, data = {}) => {
    setSessionData(prev => ({ ...prev, ...data }))
    setStep(nextStep)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-md mx-auto">
        {step === 'landing' && <Landing onNext={() => handleNext('gender')} />}
        {step === 'gender' && <GenderSelection onNext={(gender) => handleNext('date', { gender })} />}
        {step === 'date' && <DateSelection onNext={(birthDate) => handleNext('analyzing', { birthDate })} />}
        {step === 'analyzing' && <Analyzing sessionData={sessionData} onComplete={(data) => handleNext('traits', data)} />}
        {step === 'traits' && <Traits sessionData={sessionData} onNext={() => handleNext('results')} />}
        {step === 'results' && <Results sessionData={sessionData} onRestart={() => setStep('landing')} />}
      </main>
    </div>
  )
}

export default App

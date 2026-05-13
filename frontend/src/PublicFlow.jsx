import { useState } from 'react'
import Landing from './components/Landing'
import NameSelection from './components/NameSelection'
import GenderSelection from './components/GenderSelection'
import DateSelection from './components/DateSelection'
import Analyzing from './components/Analyzing'
import Traits from './components/Traits'
import Results from './components/Results'

function PublicFlow() {
  const [step, setStep] = useState('landing')
  const [sessionData, setSessionData] = useState({
    targetName: null,
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
        {step === 'landing' && <Landing onNext={() => handleNext('name')} />}
        {step === 'name' && <NameSelection onNext={(targetName) => handleNext('gender', { targetName })} />}
        {step === 'gender' && <GenderSelection targetName={sessionData.targetName} onNext={(gender) => handleNext('date', { gender })} />}
        {step === 'date' && <DateSelection targetName={sessionData.targetName} onNext={(data) => handleNext('analyzing', data)} />}
        {step === 'analyzing' && <Analyzing sessionData={sessionData} onComplete={(data) => handleNext('traits', data)} />}
        {step === 'traits' && <Traits sessionData={sessionData} onNext={() => handleNext('results')} onRetry={() => setStep('analyzing')} />}
        {step === 'results' && <Results sessionData={sessionData} onRestart={() => setStep('landing')} />}
      </main>
    </div>
  )
}

export default PublicFlow

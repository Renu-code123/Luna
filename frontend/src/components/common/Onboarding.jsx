import React, { useState } from 'react';

const Onboarding = ({ setActiveTab, setUserData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    condition: 'unknown', // 'pcos', 'pcod', 'unknown'
    familyHistory: false,
    lifestyleFactors: [],
    symptoms: []
  });

  const lifestyleOptions = [
    'Sedentary lifestyle',
    'High sugar diet',
    'Stressful job/life',
    'Irregular sleep',
    'Smoking',
    'Alcohol consumption',
    'Regular exercise',
    'Balanced diet'
  ];

  const symptomOptions = [
    'Irregular periods',
    'Heavy bleeding',
    'Acne',
    'Weight gain',
    'Hair loss',
    'Excess hair growth',
    'Fatigue',
    'Mood swings',
    'Pelvic pain',
    'Headaches',
    'None of the above'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'lifestyleFactors' || name === 'symptoms') {
        setFormData(prev => {
          const updatedArray = checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value);
          
          return { ...prev, [name]: updatedArray };
        });
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setActiveTab('assessment');
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="neon-card">
        <h2 className="text-2xl font-bold text-neon-purple neon-text mb-6">Create Your Profile</h2>
        
        <div className="mb-6 flex justify-between">
          {[1, 2, 3].map(num => (
            <div 
              key={num} 
              className={`w-1/3 h-2 rounded-full mx-1 ${step >= num ? 'bg-neon-purple' : 'bg-gray-700'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl text-neon-pink mb-4">Basic Information</h3>
              
              <div className="mb-4">
                <label className="block text-soft-white mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="neon-input w-full"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-soft-white mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="neon-input w-full"
                  min="12"
                  max="80"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-soft-white mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="neon-input w-full"
                    min="30"
                    max="200"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-soft-white mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="neon-input w-full"
                    min="120"
                    max="220"
                    required
                  />
                </div>
              </div>
              
              {calculateBMI() && (
                <div className="p-3 bg-dark neon-border-blue rounded-lg">
                  <p className="text-aqua-blue">Your BMI: <span className="font-bold">{calculateBMI()}</span></p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl text-neon-pink mb-4">Health Status</h3>
              
              <div className="mb-6">
                <label className="block text-soft-white mb-3">Do you have a diagnosis?</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`p-3 rounded-lg cursor-pointer border ${formData.condition === 'pcos' ? 'neon-border-pink' : 'border-gray-700'}`}>
                    <input
                      type="radio"
                      name="condition"
                      value="pcos"
                      checked={formData.condition === 'pcos'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <span className="block text-lg mb-1 text-soft-white">PCOS</span>
                      <span className="text-xs text-gray-400">Diagnosed</span>
                    </div>
                  </label>
                  
                  <label className={`p-3 rounded-lg cursor-pointer border ${formData.condition === 'pcod' ? 'neon-border-pink' : 'border-gray-700'}`}>
                    <input
                      type="radio"
                      name="condition"
                      value="pcod"
                      checked={formData.condition === 'pcod'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <span className="block text-lg mb-1 text-soft-white">PCOD</span>
                      <span className="text-xs text-gray-400">Diagnosed</span>
                    </div>
                  </label>
                  
                  <label className={`p-3 rounded-lg cursor-pointer border ${formData.condition === 'unknown' ? 'neon-border-pink' : 'border-gray-700'}`}>
                    <input
                      type="radio"
                      name="condition"
                      value="unknown"
                      checked={formData.condition === 'unknown'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="text-center">
                      <span className="block text-lg mb-1 text-soft-white">Unknown</span>
                      <span className="text-xs text-gray-400">Not diagnosed</span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="familyHistory"
                    checked={formData.familyHistory}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-soft-white">Family history of PCOS/PCOD</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl text-neon-pink mb-4">Lifestyle & Symptoms</h3>
              
              <div className="mb-6">
                <label className="block text-soft-white mb-3">Lifestyle Factors (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {lifestyleOptions.map(option => (
                    <label key={option} className="flex items-center cursor-pointer p-2 hover:bg-gray-800 rounded">
                      <input
                        type="checkbox"
                        name="lifestyleFactors"
                        value={option}
                        checked={formData.lifestyleFactors.includes(option)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-soft-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-soft-white mb-3">Symptoms (select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {symptomOptions.map(option => (
                    <label key={option} className="flex items-center cursor-pointer p-2 hover:bg-gray-800 rounded">
                      <input
                        type="checkbox"
                        name="symptoms"
                        value={option}
                        checked={formData.symptoms.includes(option)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-soft-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="neon-button"
              >
                Back
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setActiveTab('home')}
                className="neon-button"
              >
                Cancel
              </button>
            )}
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="neon-button neon-button-blue"
              >
                Next
              </button>
            ) : (
              <button 
                type="submit"
                className="neon-button neon-button-pink"
              >
                Complete Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
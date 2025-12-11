import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const GiftQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
      const { enqueueSnackbar } = useSnackbar();
  
  const [answers, setAnswers] = useState({
    relationship: '',
    occasion: '',
    budget: ''
  });

  const handleSelect = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/results', { state: { ...answers, [field]: value } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-700 text-center">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
          <div className="bg-red-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Who are you buying for? 🎁</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Male', 'Female', 'Kids'].map((option) => (
                <button key={option} onClick={() => handleSelect('relationship', option)} className="p-6 bg-gray-700 rounded-xl hover:bg-red-500 transition text-xl font-bold text-white border border-gray-600">
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">What is the occasion? 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Birthday', 'Anniversary', 'Valentine', 'Random'].map((option) => (
                <button key={option} onClick={() => handleSelect('occasion', option)} className="p-5 bg-gray-700 rounded-xl hover:bg-red-500 transition text-lg font-bold text-white border border-gray-600">
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">What is your budget? 💰</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Budget Friendly ($0 - $50)', value: 'low' },
                { label: 'Mid Range ($50 - $150)', value: 'medium' },
                { label: 'Premium ($150+)', value: 'high' }
              ].map((option) => (
                <button key={option.value} onClick={() => handleSelect('budget', option.value)} className="p-5 bg-gray-700 rounded-xl hover:bg-red-500 transition text-lg font-bold text-white border border-gray-600">
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="mt-8 text-gray-400 hover:text-white underline">Go Back</button>
        )}

      </div>
    </div>
  );
};

export default GiftQuiz;
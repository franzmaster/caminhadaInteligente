import React, { useState } from 'react';
import { Footprints, Check, RotateCcw, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserData, FitnessLevel } from './types';
import { generateWalkingPlan } from './services/geminiService';
import { InputSection } from './components/InputSection';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState<UserData>({
    height: 165,
    currentWeight: 80,
    weightToLose: 10,
    age: 40,
    level: 'Iniciante',
  });
  const [plan, setPlan] = useState<string>('');

  // Handlers
  const handleCalculate = async () => {
    setStep('loading');
    const result = await generateWalkingPlan(formData);
    setPlan(result);
    setStep('result');
  };

  const handleReset = () => {
    setStep('form');
    setPlan('');
  };

  const handleWhatsAppShare = () => {
    const phoneNumber = "5585992121215";
    const message = `*Meu Plano de Caminhada Personalizado*\n\n` +
                    `*Perfil:*\n` +
                    `- Idade: ${formData.age} anos\n` +
                    `- Altura: ${formData.height} cm\n` +
                    `- Peso: ${formData.currentWeight} kg\n` +
                    `- Meta: Perder ${formData.weightToLose} kg\n\n` +
                    `*Plano Sugerido:*\n${plan}`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Render Form
  const renderForm = () => (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col items-center">
      <div className="text-center mb-6">
        <p className="text-sm font-bold text-pink-700 uppercase tracking-widest mb-3 bg-pink-200/80 inline-block px-4 py-1.5 rounded-full shadow-sm">
          Caminhando com Inteligência
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-black leading-tight uppercase">
          QUANTO DEVO <span className="text-pink-600">CAMINHAR</span> <br />
          PARA PERDER <span className="underline decoration-pink-500 decoration-4">{formData.weightToLose} KG</span>?
        </h1>
      </div>

      <div className="w-full bg-pink-100/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-pink-200">
        
        {/* Meta de Perda */}
        <InputSection
          label="QUILOS PARA PERDER"
          value={formData.weightToLose}
          onChange={(val) => setFormData({ ...formData, weightToLose: val })}
          min={1}
          max={50}
          unit="kg"
          presetValues={[1, 10, 20, 30, 40, 50]}
        />

        {/* Height */}
        <InputSection
          label="ALTURA"
          value={formData.height}
          onChange={(val) => setFormData({ ...formData, height: val })}
          min={140}
          max={200}
          unit="cm"
          presetValues={[140, 150, 160, 170, 180, 190, 200]}
        />

        {/* Weight */}
        <InputSection
          label="PESO ATUAL"
          value={formData.currentWeight}
          onChange={(val) => setFormData({ ...formData, currentWeight: val })}
          min={40}
          max={180}
          unit="kg"
          presetValues={[50, 75, 100, 125, 150, 175]}
        />

        {/* Level Selection */}
        <div className="mb-6 w-full">
          <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide mb-2">NÍVEL</h3>
          <div className="flex rounded-xl overflow-hidden border border-pink-400 bg-pink-200">
            {(['Iniciante', 'Intermediário', 'Avançado'] as FitnessLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFormData({ ...formData, level: lvl })}
                className={`flex-1 py-3 text-xs md:text-sm font-black uppercase transition-all
                  ${formData.level === lvl 
                    ? 'bg-pink-500 text-white shadow-inner' 
                    : 'bg-pink-200 text-pink-900 hover:bg-pink-300'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <InputSection
          label="IDADE"
          value={formData.age}
          onChange={(val) => setFormData({ ...formData, age: val })}
          min={18}
          max={90}
          unit="anos"
          presetValues={[20, 30, 40, 50, 60, 70, 80]}
        />

        {/* Submit Button */}
        <button
          onClick={handleCalculate}
          className="w-full bg-pink-300 hover:bg-pink-400 text-black font-black text-xl py-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
        >
          Calcule de Graça
        </button>

      </div>
      
      {/* Footer Icon */}
      <div className="mt-8 flex justify-end w-full">
         <div className="bg-white p-2 rounded shadow">
            <Footprints className="text-orange-500 w-8 h-8" />
         </div>
      </div>
    </div>
  );

  // Render Loading
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-600 mb-4"></div>
      <h2 className="text-2xl font-black uppercase">Criando seu plano...</h2>
      <p className="text-gray-600">A inteligência artificial está analisando seu perfil.</p>
    </div>
  );

  // Render Result
  const renderResult = () => (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-black text-center mb-6 uppercase">SEU PLANO DE CAMINHADA</h1>
      
      <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-pink-200 flex-grow mb-6 overflow-y-auto">
        <div className="prose prose-pink prose-headings:font-black prose-p:font-medium text-gray-800">
           <ReactMarkdown>{plan}</ReactMarkdown>
        </div>
      </div>

      <div className="space-y-4 sticky bottom-4">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppShare}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
          ENVIAR RESULTADO NO WHATSAPP
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold text-lg py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          Calcular Novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-pink-50 pb-8">
      {step === 'form' && renderForm()}
      {step === 'loading' && renderLoading()}
      {step === 'result' && renderResult()}
    </div>
  );
};

export default App;
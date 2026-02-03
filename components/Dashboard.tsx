
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { InfiniteSlider, SliderItem } from './ui/argent-loop-infinite-slider';
import BounceCards from './ui/BounceCards';

interface DashboardProps {
  onLogout: () => void;
}

interface CostPhase {
  name: string;
  duration: string;
  cost: number;
  description: string;
}

interface BOMItem {
  id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface CostAnalysis {
  materialCost: number;
  furnitureCost: number;
  laborCost: number;
  totalCost: number;
  areaSqFt: number;
  costPerSqFt: number;
  confidenceScore: number;
  breakdown: { 
    category: string; 
    amount: number; 
    items: string[]; 
    granularity: 'high' | 'medium' | 'low';
    detailedItems: BOMItem[];
  }[];
  phases: CostPhase[];
}

const AI_CONFIG = {
  INCLUDE_NANO_BANANA: true,
  IMAGE_MODEL: 'gemini-2.5-flash-image' as const,
  TEXT_MODEL: 'gemini-3-flash-preview' as const,
  VARIANTS_COUNT: 3,
  RESOLUTION_KEYWORD: '8k visualization',
};

const STYLES = [
  { id: 'modern', name: 'Modern', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=300' },
  { id: 'japandi', name: 'Japandi', img: 'https://images.unsplash.com/photo-1616486341353-c5833ad88010?auto=format&fit=crop&q=80&w=300' },
  { id: 'minimal', name: 'Minimal', img: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=300' },
  { id: 'luxury', name: 'Luxury', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=300' },
  { id: 'industrial', name: 'Industrial', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=300' },
];

const ROOM_TYPES = [
  { id: 'living', label: 'Living', icon: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', icon: '🛏️' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
  { id: 'bathroom', label: 'Bathroom', icon: '🚿' },
  { id: 'office', label: 'Office', icon: '💼' },
  { id: 'dining', label: 'Dining', icon: '🍽️' },
];

const DEFAULT_SYSTEM_PROMPT = "You are a professional architectural AI assistant. Your goal is to provide buildable, cost-accurate interior designs and execution plans. Always prioritize structural logic, material realism, and market-accurate pricing for construction and labor.";

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [budget, setBudget] = useState(50);
  const [roomType, setRoomType] = useState('living');
  const [activeTab, setActiveTab] = useState<'design' | 'settings'>('design');
  
  const [systemInstructions, setSystemInstructions] = useState(DEFAULT_SYSTEM_PROMPT);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  const [cart, setCart] = useState<BOMItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef<Chat | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setBase64Image(base64.split(',')[1]);
        setImage(URL.createObjectURL(file));
        setGeneratedImages([]);
        setCostAnalysis(null);
        setChatMessages([]);
        setIsAccepted(false);
        setCart([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image || !base64Image) return;
    setIsGenerating(true);
    setGeneratedImages([]);
    setCostAnalysis(null);
    setIsAccepted(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const styleName = STYLES.find(s => s.id === selectedStyle)?.name;
      const budgetRange = getDynamicBudgetRange();
      
      const keywordSuffix = AI_CONFIG.INCLUDE_NANO_BANANA ? ' nano banana' : '';
      const prompt = `${systemInstructions}\n\nAct as a world-class interior designer. Transform the attached photo of a ${roomType} into a professional, buildable design in ${styleName} style within budget ${budgetRange}. Resolution: ${AI_CONFIG.RESOLUTION_KEYWORD}.${keywordSuffix}`;

      const generationPromises = Array.from({ length: AI_CONFIG.VARIANTS_COUNT }).map(async () => {
        const response = await ai.models.generateContent({
          model: AI_CONFIG.IMAGE_MODEL,
          contents: { parts: [{ inlineData: { data: base64Image, mimeType: mimeType || 'image/jpeg' } }, { text: prompt }] }
        });
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        return imagePart?.inlineData ? `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}` : null;
      });

      const results = await Promise.all(generationPromises);
      setGeneratedImages(results.filter((img): img is string => img !== null));

      const analysis = await generateCostAnalysis(ai, styleName!, budgetRange);
      setCostAnalysis(analysis);

      activeChatRef.current = ai.chats.create({
        model: AI_CONFIG.TEXT_MODEL,
        config: {
          systemInstruction: `${systemInstructions}\n\nYou are currently assisting with a ${roomType} project in ${styleName} style. Total budget is ${formatCurrency(analysis.totalCost)}. The area is ${analysis.areaSqFt} sq ft. You have access to a detailed Bill of Materials.`,
        },
      });

    } catch (error) {
      console.error("Error:", error);
      alert("Error in AI synthesis. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCostAnalysis = async (ai: any, styleName: string, budgetRange: string): Promise<CostAnalysis> => {
    const costPrompt = `${systemInstructions}\n\nPerform a granular cost analysis for a ${roomType} in ${styleName} style (Budget: ${budgetRange}). 
    Provide:
    1. Net area estimation in sq ft.
    2. Bill of Materials (BOM) with 'detailedItems' containing specific quantities, units, and market prices.
    3. Construction phase timeline.
    Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: AI_CONFIG.TEXT_MODEL,
      contents: costPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            materialCost: { type: Type.NUMBER },
            furnitureCost: { type: Type.NUMBER },
            laborCost: { type: Type.NUMBER },
            totalCost: { type: Type.NUMBER },
            areaSqFt: { type: Type.NUMBER },
            costPerSqFt: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                  granularity: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                  detailedItems: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        unit: { type: Type.STRING },
                        unitPrice: { type: Type.NUMBER },
                        total: { type: Type.NUMBER }
                      }
                    }
                  }
                }
              }
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  cost: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            }
          },
          required: ["materialCost", "furnitureCost", "laborCost", "totalCost", "areaSqFt", "costPerSqFt", "confidenceScore", "breakdown", "phases"]
        }
      }
    });

    return JSON.parse(response.text);
  };

  const handleSendMessage = async () => {
    if (!chatInput) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!activeChatRef.current) {
        activeChatRef.current = ai.chats.create({
          model: AI_CONFIG.TEXT_MODEL,
          config: { systemInstruction: systemInstructions },
        });
      }
      const response = await activeChatRef.current.sendMessage({ message: userMsg });
      setChatMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Connectivity issue. Please regenerate design to restore state." }]);
    }
  };

  const addToCart = (item: BOMItem) => {
    setCart(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
    setIsCartOpen(true);
  };

  const addAllToCart = () => {
    if (!costAnalysis) return;
    const allItems: BOMItem[] = [];
    costAnalysis.breakdown.forEach(group => {
      if (group.detailedItems) {
        group.detailedItems.forEach(item => {
          if (!cart.find(i => i.id === item.id)) {
            allItems.push(item);
          }
        });
      }
    });
    setCart(prev => [...prev, ...allItems]);
    setIsCartOpen(true);
  };

  const getDynamicBudgetRange = () => {
    if (budget < 33) return '₹1L – ₹4L';
    if (budget < 66) return '₹4L – ₹9L';
    return '₹9L – ₹15L+';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getBounceTransforms = () => {
    if (generatedImages.length === 1) return ['rotate(0deg)'];
    if (generatedImages.length === 2) return ['rotate(5deg) translate(-80px)', 'rotate(-5deg) translate(80px)'];
    return [
      'rotate(10deg) translate(-170px)',
      'rotate(0deg) translate(0px)',
      'rotate(-10deg) translate(170px)'
    ];
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F9F9F9] flex flex-col font-sans relative">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0D0D0D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#C5A059] flex items-center justify-center font-bold text-black text-[10px]">IS</div>
          <span className="font-bold tracking-tight font-geometric text-sm uppercase">INSTASPACE<span className="text-[#C5A059]">AI</span></span>
          <div className="ml-4 h-4 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex gap-4 ml-4">
            <button onClick={() => setActiveTab('design')} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 transition-all ${activeTab === 'design' ? 'text-white border-b-2 border-[#C5A059]' : 'text-gray-500 hover:text-white'}`}>Design Space</button>
            <button onClick={() => setActiveTab('settings')} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 transition-all ${activeTab === 'settings' ? 'text-white border-b-2 border-[#C5A059]' : 'text-gray-500 hover:text-white'}`}>System Prompt</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] text-black text-[10px] font-black rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
          <button onClick={onLogout} className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest">Logout</button>
        </div>
      </header>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-[420px] border-r border-white/5 bg-[#111111] overflow-y-auto p-6 space-y-10 custom-scrollbar z-10">
          {activeTab === 'design' ? (
            <>
              <section>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">01 — Room Visuals</h3>
                {!image ? (
                  <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-white/5 hover:border-[#C5A059]/50 bg-white/[0.02] hover:bg-[#C5A059]/[0.02] rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300">
                    <svg className="w-10 h-10 text-gray-600 group-hover:text-[#C5A059] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="text-sm font-bold">Snap or Upload</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>
                ) : (
                  <div className="relative group rounded-xl overflow-hidden border border-white/10">
                    <img src={image} alt="Source" className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                      <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Replace</button>
                      <button onClick={() => setImage(null)} className="px-4 py-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">02 — Aesthetic Presets</h3>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES.map((style) => (
                    <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group transition-all duration-500 ${selectedStyle === style.id ? 'ring-2 ring-[#C5A059] scale-[1.02]' : 'opacity-40 hover:opacity-100'}`}>
                      <img src={style.img} alt={style.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-3"><span className="text-[10px] font-black uppercase tracking-widest">{style.name}</span></div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-end mb-4"><h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">03 — Target Budget</h3><span className="text-sm font-black text-[#C5A059]">{getDynamicBudgetRange()}</span></div>
                <input type="range" min="0" max="100" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]" />
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">04 — Project Zone</h3>
                <div className="grid grid-cols-3 gap-2">
                  {ROOM_TYPES.map((type) => (
                    <button key={type.id} onClick={() => setRoomType(type.id)} className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${roomType === type.id ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}>
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">{type.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <button onClick={handleGenerate} disabled={!image || isGenerating} className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-500 ${isGenerating ? 'bg-[#C5A059]/30 text-white/50 cursor-not-allowed' : 'bg-[#F9F9F9] text-black hover:bg-[#C5A059] shadow-xl'}`}>
                {isGenerating ? 'Synthesizing...' : 'Generate Build Specs'}
              </button>
            </>
          ) : (
            <section className="animate-fade-in">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Architectural Logic Config</h3>
              <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">Customize the high-level system instructions passed to the AI engine. This dictates the design philosophy and procurement logic used for your projects.</p>
              <textarea 
                value={systemInstructions}
                onChange={(e) => setSystemInstructions(e.target.value)}
                className="w-full h-96 bg-black/40 border border-white/5 p-4 text-xs rounded-xl focus:outline-none focus:border-[#C5A059] custom-scrollbar text-white/80 leading-relaxed"
                placeholder="Enter system prompt instructions..."
              />
              <button onClick={() => { setSystemInstructions(DEFAULT_SYSTEM_PROMPT); setActiveTab('design'); }} className="w-full mt-10 py-4 border border-white/10 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all">Restore Defaults</button>
            </section>
          )}
        </aside>

        <main className="flex-grow bg-[#0D0D0D] p-6 lg:p-12 overflow-y-auto custom-scrollbar relative">
          <div className="w-full max-w-6xl mx-auto space-y-16">
            
            <section className="space-y-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">01 — Architectural Visualization</h2>
                  {generatedImages.length > 0 && (
                    <div className="flex gap-2">
                       <button onClick={() => setIsAccepted(true)} className="px-6 py-2 bg-green-500 text-black text-[10px] font-black uppercase rounded-full hover:bg-white transition-all">Accept Design</button>
                       <button onClick={handleGenerate} className="px-6 py-2 bg-red-600/20 text-red-500 border border-red-500/30 text-[10px] font-black uppercase rounded-full hover:bg-red-600 transition-all">Decline & Re-Gen</button>
                    </div>
                  )}
               </div>

               <div className="relative aspect-video w-full bg-[#111] rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center">
                 {isGenerating ? (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl flex flex-col items-center justify-center z-50">
                       <div className="w-32 h-32 border-t-2 border-[#C5A059] rounded-full animate-spin mb-8"></div>
                       <p className="text-xs font-black uppercase tracking-[1em] text-[#C5A059] animate-pulse">Consulting AI Architects...</p>
                    </div>
                 ) : generatedImages.length > 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <BounceCards
                        images={generatedImages}
                        containerHeight={500}
                        containerWidth="100%"
                        transformStyles={getBounceTransforms()}
                        animationDelay={0.2}
                      />
                    </div>
                 ) : !image ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 border border-dashed border-white/20 rounded-[40px]">
                       <svg className="w-64 h-64 mb-6" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.1"><circle cx="100" cy="100" r="80" /><path d="M50 50 L150 150 M150 50 L50 150" /></svg>
                       <p className="text-3xl font-black uppercase tracking-[1em]">SYSTEM IDLE</p>
                    </div>
                 ) : (
                    <img src={image} className="w-full h-full object-cover" />
                 )}
               </div>
            </section>

            {costAnalysis && !isGenerating && (
              <section className="space-y-12 animate-fade-in pb-32">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#C5A059]">02 — Procurement Ledger</h2>
                  <button onClick={addAllToCart} className="px-6 py-2 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#C5A059] hover:text-black transition-all">Add All Materials to Cart</button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                   <div className="bg-[#111] border border-white/5 rounded-[45px] overflow-hidden shadow-xl">
                      <div className="p-10 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Bill of Materials (BOM)</h3>
                        <span className="text-[10px] font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">Verified Specs</span>
                      </div>
                      <div className="p-10 space-y-10">
                         {costAnalysis.breakdown.map((group, idx) => (
                           <div key={idx} className="space-y-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#C5A059]">{group.category}</h4>
                              <div className="space-y-4">
                                {group.detailedItems?.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center group/item border-b border-white/[0.03] pb-4 last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg p-2 -mx-2">
                                    <div className="flex-grow">
                                      <p className="text-sm font-bold text-white group-hover/item:text-[#C5A059] transition-colors">{item.name}</p>
                                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-tighter">{item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                      <div className="text-right">
                                        <p className="text-sm font-black text-white tabular-nums">{formatCurrency(item.total)}</p>
                                        <p className="text-[9px] text-gray-600 uppercase font-black">Subtotal</p>
                                      </div>
                                      <button 
                                        onClick={() => addToCart(item)} 
                                        className="bg-[#C5A059] text-black px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-[#C5A059]/20"
                                      >
                                        Buy Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-[#111] border border-white/5 rounded-[45px] overflow-hidden shadow-xl h-fit">
                      <div className="p-10 border-b border-white/5 bg-white/[0.01]"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Construction Timeline</h3></div>
                      <div className="p-10 space-y-10">
                         {costAnalysis.phases.map((phase, idx) => (
                           <div key={idx} className="relative pl-12 group">
                              {idx < costAnalysis.phases.length - 1 && <div className="absolute left-[7px] top-8 bottom-0 w-[1px] bg-white/5 group-hover:bg-[#C5A059]/30 transition-colors"></div>}
                              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border border-[#C5A059]/40 flex items-center justify-center group-hover:bg-[#C5A059] transition-all duration-500 z-10"><div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full group-hover:bg-black transition-colors"></div></div>
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-[#C5A059] transition-colors">{phase.name}</h4>
                                    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{phase.description}</p>
                                 </div>
                                 <div className="text-right flex-shrink-0 ml-4">
                                    <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest">{phase.duration}</p>
                                    <p className="text-xs font-black mt-1 tabular-nums">{formatCurrency(phase.cost)}</p>
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {isCartOpen && (
         <div className="fixed inset-0 z-[110] flex justify-end">
            <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-md bg-[#111] h-full shadow-2xl border-l border-white/5 flex flex-col animate-slide-left">
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-widest">Procurement Cart</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
               </div>
               <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {cart.length === 0 ? <p className="text-xs text-gray-500 uppercase tracking-widest text-center mt-20 opacity-30">Your cart is empty</p> : cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div>
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase mt-1">{item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-black">{formatCurrency(item.total)}</p>
                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-gray-700 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    </div>
                  ))}
               </div>
               <div className="p-8 border-t border-white/5 bg-black/40 space-y-6">
                  <div className="flex justify-between items-end"><p className="text-xs font-black uppercase text-gray-500 tracking-widest">Grand Total</p><p className="text-2xl font-black">{formatCurrency(cart.reduce((acc, curr) => acc + curr.total, 0))}</p></div>
                  <button disabled={cart.length === 0} className="w-full py-5 bg-[#C5A059] text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all disabled:opacity-20">Secure Procurement Checkout</button>
               </div>
            </div>
         </div>
      )}

      <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-700 ${isChatOpen ? 'w-[420px] h-[650px] scale-100 opacity-100' : 'w-16 h-16 scale-100 opacity-100'}`}>
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} className="w-full h-full bg-[#C5A059] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group relative">
            <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A059] animate-pulse rounded-full border-4 border-black"></div>
          </button>
        ) : (
          <div className="w-full h-full bg-[#0D0D0D] border border-[#C5A059]/30 rounded-[40px] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
             <div className="p-8 bg-[#C5A059] flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center font-bold text-[#C5A059]">IS</div>
                   <div><p className="font-black text-black uppercase tracking-widest text-xs">Project Concierge</p><p className="text-[10px] text-black/60 font-black uppercase tracking-tighter">AI Active</p></div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-black/60 hover:text-black transition-colors p-2 hover:bg-black/5 rounded-full"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
             </div>
             <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/40">
                {chatMessages.length === 0 && <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6 opacity-30"><svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Initialized according to system prompt. How can I assist with your design constraints?</p></div>}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] px-5 py-4 rounded-[25px] text-xs font-semibold leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-[#C5A059] text-black rounded-tr-none' : 'bg-[#1a1a1a] border border-white/5 text-gray-300 rounded-tl-none'}`}>{msg.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>
             <div className="p-6 border-t border-white/5 bg-black/60">
                <div className="relative flex items-center">
                   <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Inquire about build specs..." className="w-full bg-[#1a1a1a] border border-white/10 pl-5 pr-14 py-4 rounded-[25px] text-xs text-white focus:outline-none focus:border-[#C5A059] transition-all" />
                   <button onClick={handleSendMessage} className="absolute right-3 p-3 bg-[#C5A059] rounded-full text-black hover:bg-white transition-all shadow-lg active:scale-95"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" /></svg></button>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197, 160, 89, 0.2); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        @keyframes slide-left { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%;
          background: #C5A059; cursor: pointer; border: 4px solid #111;
          box-shadow: 0 0 10px rgba(197, 160, 89, 0.5);
        }
      `}</style>
    </div>
  );
};

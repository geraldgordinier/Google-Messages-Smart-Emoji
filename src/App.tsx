import React from 'react';
import { 
  Puzzle, 
  Download, 
  Settings, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const steps = [
    {
      title: "Export the Extension",
      description: "Click the 3-dot settings menu in the top right of this AI Studio window and select 'Export to Share' -> 'Download ZIP', or use 'Export to Desktop'. Note that you really just need the 'public/extension' folder inside the codebase.",
      icon: <Download className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Load into Chrome",
      description: "Open Chrome and navigate to chrome://extensions. Turn on 'Developer mode' (top right), then click 'Load unpacked' and select the 'public/extension' folder from the unzipped download.",
      icon: <Puzzle className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Add your API Key",
      description: "Click the new Smart Emoji extension icon in your Chrome toolbar. Paste your Gemini API key so the extension can securely generate emojis directly from your browser.",
      icon: <Settings className="w-5 h-5 text-gray-700" />
    },
    {
      title: "Test it in Google Messages",
      description: "Go to messages.google.com/web. Start typing a message to someone. When you pause for a second, the AI will suggest the perfect emoji right above your cursor! Hit Tab to quickly insert it.",
      icon: <MessageSquare className="w-5 h-5 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <header className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Google Messages Smart Emoji <br/> Extension
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            I've built the complete, production-ready Chrome Extension for you. 
            Because this is natively installed into your browser, it cannot run inside this preview window directly.
          </p>
        </header>

        {/* Feature Teaser */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <MessageSquare className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">How it works under the hood</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600"><strong>Silent Background Worker:</strong> Uses Chrome's exact manifest v3 standards to call Gemini without CORS issues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600"><strong>Debounced inference:</strong> Analyzes your text natively to reduce API spam when typing quickly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600"><strong>Floating UI:</strong> Renders a non-obtrusive floating pill right above your message box suggesting the emoji.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="space-y-4 text-sm font-mono text-slate-800">
                <p>Hey, I'm heading out now to grab the pizza</p>
                <div className="flex justify-end pr-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                    <span className="text-lg">🍕</span>
                    <span className="text-xs text-slate-400 font-sans font-medium">Add (Tab)</span>
                  </div>
                </div>
                <div className="h-0.5 bg-blue-500 w-px animate-pulse ml-64"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <h2 className="text-3xl font-bold mb-8 text-center">Installation Steps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
             <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group hover:border-blue-300 transition-colors">
               <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                 {idx + 1}
               </div>
               <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                 {step.icon}
                 {step.title}
               </h3>
               <p className="text-slate-600 leading-relaxed">
                 {step.description}
               </p>
             </div>
          ))}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Zap, HelpCircle, Eye } from 'lucide-react';
import CubeOfSpace from './components/CubeOfSpace';
import EnergyFlow from './components/EnergyFlow';
import CameraController from './components/CameraController';
import Sidebar from './components/Sidebar';
import HelpModal from './components/HelpModal';
import { CubeLogo } from './components/CubeLogo';

function App() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [flowActive, setFlowActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [resetCamera, setResetCamera] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}res/data.json`)
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  // Welcome message auto-fade after 5 seconds


  const handleSelect = (item) => setSelectedItem(item);
  const handleClose = () => setSelectedItem(null);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0d0d0d] relative font-sans">
      <div className="absolute inset-0">
        {/* Camera starts from West [-10, 1.5, 0], looking East toward origin */}
        <Canvas camera={{ position: [-10, 1.5, 0], fov: 45 }} gl={{ antialias: true, toneMapping: 3 }}>
          <color attach="background" args={['#030305']} />
          <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#6666ff" />

          <React.Suspense fallback={null}>
            <CubeOfSpace data={data} selectedId={selectedItem?.id} onSelect={handleSelect} />
          </React.Suspense>
          <EnergyFlow active={flowActive} data={data} />
          <CameraController resetTrigger={resetCamera} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} radius={0.6} />
          </EffectComposer>

          <OrbitControls enablePan={false} enableZoom minDistance={4} maxDistance={20} makeDefault />
        </Canvas>
      </div>

      {/* Welcome Modal (click to dismiss) */}
      {showWelcome && (
        <div 
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowWelcome(false)}
        >
          <div className="max-w-md text-center p-10 bg-[#0d0d12]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
            <div className="text-yellow-500/60 text-5xl mb-6 hebrew-text">ת</div>
            <p className="text-white/70 text-base font-light leading-relaxed tracking-wide italic">
              "You stand symbolically in the West, in the present moment, gazing East — toward the origin of manifestation."
            </p>
            <p className="mt-6 text-white/25 text-[10px] uppercase tracking-[0.4em]">Click anywhere to continue</p>
          </div>
        </div>
      )}

      {/* Header: Logo + Title (Top Left) */}
      {!selectedItem && (
        <div className="absolute top-8 left-8 pointer-events-none z-10 flex items-center gap-4">
          <CubeLogo className="w-12 h-12 text-yellow-500/80 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
          <div>
            <h1 className="text-2xl font-light tracking-[0.2em] text-white/90 uppercase">Cube of Space</h1>
            <p className="text-white/40 text-xs font-light tracking-[0.1em] uppercase">3d Explorer</p>
          </div>
        </div>
      )}

      {/* Help Button (Top Right) */}
      {!selectedItem && (
        <button 
          onClick={() => setShowHelp(true)}
          className="absolute top-8 right-8 z-10 p-3 bg-white/10 hover:bg-white/20 border border-white/25 hover:border-yellow-500/40 rounded-full text-white/70 hover:text-yellow-400 transition-all duration-300 backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
          title="Information & Help"
        >
          <HelpCircle size={22} />
        </button>
      )}

      {/* Control Area (Bottom Left) */}
      {!selectedItem && data.length > 0 && (
        <div className="absolute bottom-8 left-8 z-10 flex flex-col items-stretch gap-3 pointer-events-auto w-[300px]">
          {/* Action Buttons Row */}
          <div className="flex items-center gap-3">
            {/* Activate Flow */}
            <button
              onClick={() => setFlowActive(!flowActive)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-black/50 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 backdrop-blur-xl group"
            >
              <Zap size={14} className={`transition-colors ${flowActive ? 'text-yellow-400 fill-yellow-400' : 'text-white/40 group-hover:text-white'}`} />
              <span className="text-[10px] uppercase tracking-[0.15em] font-semibold">
                {flowActive ? 'Disable Flow' : 'Activate Flow'}
              </span>
            </button>

            {/* Ritual View Reset */}
            <button
              onClick={() => setResetCamera(c => c + 1)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-black/50 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-all duration-300 backdrop-blur-xl group"
              title="Reset to Western View (Paul Foster Case)"
            >
              <Eye size={14} className="text-white/40 group-hover:text-violet-400 transition-colors" />
              <span className="text-[10px] uppercase tracking-[0.15em] font-semibold">Western View</span>
            </button>
          </div>

          {/* Internal Area Panel */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] flex-1 bg-white/10" />
              <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold whitespace-nowrap">Internal Area</p>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {data.filter(i => ["Center","Axis"].includes(i.position_type)).map(item => (
                <button key={`nav-${item.id}`} onClick={() => handleSelect(item)}
                  className="px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.12] border border-white/5 hover:border-white/20 rounded-lg text-[10px] text-white/40 hover:text-white transition-all duration-300 uppercase tracking-[0.15em] font-medium text-center">
                  {item.position_type === "Center" ? "Palace Center" : item.specific_position.replace(" to ", " → ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="absolute top-0 right-0 h-full w-full md:w-[450px] z-20">
          <Sidebar data={selectedItem} onClose={handleClose} />
        </div>
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;

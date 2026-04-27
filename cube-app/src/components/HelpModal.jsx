import React from 'react';
import { X, Code2, Heart, MousePointer2, Rotate3d, Zap } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0f0f12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-light tracking-widest text-white/90 uppercase">Project Information</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8 scrollbar-hide">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-500/80">The Project</h3>
            <p className="text-white/60 leading-relaxed font-light">
              This interactive application is a 3D visualization of the <strong>Cube of Space</strong>, an esoteric model based on the teachings of Builders of the Adytum (B.O.T.A.). 
              It maps the 22 letters of the Hebrew alphabet and their corresponding Tarot keys onto a geometric structure representing the dimensions of space and the flow of the Life Force.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-yellow-500/80">How to use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Rotate3d className="text-white/40 mt-1" size={18} />
                <p className="text-xs text-white/50 leading-relaxed"><span className="text-white/80 block mb-1">Explore</span> Use your mouse to rotate and zoom the cube to inspect every angle.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <MousePointer2 className="text-white/40 mt-1" size={18} />
                <p className="text-xs text-white/50 leading-relaxed"><span className="text-white/80 block mb-1">Interact</span> Click on faces, edges, axes, or sigils to see detailed esoteric data.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Zap className="text-white/40 mt-1" size={18} />
                <p className="text-xs text-white/50 leading-relaxed"><span className="text-white/80 block mb-1">Life Force</span> Toggle the Flow Mode to visualize the energetic directions of the 22 paths.</p>
              </div>
            </div>
          </section>

          {/* Social / Links */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <a 
              href="https://github.com/fraterr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/80 transition-all group"
            >
              <Code2 size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium tracking-wider">GitHub Projects</span>
            </a>
            <a 
              href="https://buymeacoffee.com/practicalhumanism" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#FFDD00] hover:bg-[#FFEA00] rounded-2xl text-black transition-all group"
            >
              <Heart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wider">Support the Project</span>
            </a>
          </div>
        </div>


      </div>
    </div>
  );
}

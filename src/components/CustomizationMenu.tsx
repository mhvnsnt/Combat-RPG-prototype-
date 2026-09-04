import React from 'react';
import { PlayerStats } from '../types';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  onUpdate: (stats: PlayerStats) => void;
  onClose: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function CustomizationMenu({ stats, onUpdate, onClose }: Props) {
  return (
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Loadout & Customization</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Armor Color</label>
            <div className="flex gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onUpdate({ ...stats, color })}
                  className={`w-10 h-10 rounded-full border-2 transition-transform ${stats.color === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Combat Style Tuning</label>
            <p className="text-xs text-slate-500 mb-4">
              Allocate your combat focus. Higher speed means lower base damage.
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Movement Speed</span>
                  <span className="text-slate-500">{stats.speed}</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="600" 
                  value={stats.speed}
                  onChange={(e) => onUpdate({ ...stats, speed: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Base Damage</span>
                  <span className="text-slate-500">{stats.damage}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  value={stats.damage}
                  onChange={(e) => onUpdate({ ...stats, damage: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Deploy
          </button>
        </div>
      </motion.div>
    </div>
  );
}

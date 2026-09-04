import React from 'react';
import { PlayerStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Shield, Zap } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  dialogue: string | null;
  onCloseDialogue: () => void;
  onOpenCustomization: () => void;
}

export function UIOverlay({ stats, dialogue, onCloseDialogue, onOpenCustomization }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Top Bar - HUD */}
      <div className="flex justify-between items-start">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-xl border border-slate-200 pointer-events-auto flex items-center gap-6">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Health
            </div>
            <div className="w-48 h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-500"
                initial={false}
                animate={{ width: `${Math.max(0, (stats.hp / stats.maxHp) * 100)}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            </div>
            <div className="text-sm font-medium text-slate-700 mt-1">
              {Math.max(0, stats.hp)} / {stats.maxHp}
            </div>
          </div>
          
          <div className="w-px h-10 bg-slate-200" />
          
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Lvl {stats.level}
            </div>
            <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={false}
                animate={{ width: `${(stats.xp / (stats.level * 100)) * 100}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
            </div>
            <div className="text-sm font-medium text-slate-700 mt-1">
              {stats.xp} / {stats.level * 100} XP
            </div>
          </div>
        </div>

        <button 
          onClick={onOpenCustomization}
          className="pointer-events-auto bg-white/90 backdrop-blur p-4 rounded-full shadow-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Narrative Dialogue System */}
      <AnimatePresence>
        {dialogue && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="self-center bg-slate-900 text-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto border border-slate-800"
          >
            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs mb-2">Transmission Received</h3>
            <p className="text-lg leading-relaxed mb-6">
              {dialogue}
            </p>
            <button 
              onClick={onCloseDialogue}
              className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/engine';
import { PlayerStats } from './types';
import { UIOverlay } from './components/UIOverlay';
import { CustomizationMenu } from './components/CustomizationMenu';

const NARRATIVE_LINES: Record<string, string> = {
  intro: "Welcome to the simulation grid. You are a standalone combat unit. Use W/A/S/D to move, and click to fire physics-based projectiles. Survive the incoming rogue processes.",
  first_blood: "Excellent work. You've cleared the first wave. More hostiles are converging on your position. Keep moving.",
  levelup: "Level up achieved. Maximum integrity and combat parameters increased. Prepare for escalating threat levels."
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [stats, setStats] = useState<PlayerStats>({
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    color: '#3b82f6', // blue
    speed: 300,
    damage: 20
  });
  
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial measurement
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.w === 0) return;
    
    // Set exact pixel dimensions to avoid blur
    canvasRef.current.width = dimensions.w;
    canvasRef.current.height = dimensions.h;
    
    if (!engineRef.current) {
      engineRef.current = new GameEngine(
        canvasRef.current,
        stats,
        (newStats) => setStats({ ...newStats }),
        (dialogueId) => setDialogue(NARRATIVE_LINES[dialogueId])
      );
      engineRef.current.start();
    } else {
      // Update engine dimensions if it exists
      engineRef.current.width = dimensions.w;
      engineRef.current.height = dimensions.h;
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
        engineRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]); // only re-bind when dimensions change
  
  useEffect(() => {
    // Sync React state down to engine when customizing
    if (engineRef.current) {
      engineRef.current.updateStats(stats);
    }
  }, [stats]);
  
  useEffect(() => {
    // Pause game when UI overlays are active
    if (engineRef.current) {
      engineRef.current.setPaused(!!dialogue || isCustomizing);
    }
  }, [dialogue, isCustomizing]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 select-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      <UIOverlay 
        stats={stats} 
        dialogue={dialogue}
        onCloseDialogue={() => setDialogue(null)}
        onOpenCustomization={() => setIsCustomizing(true)}
      />
      
      {isCustomizing && (
        <CustomizationMenu 
          stats={stats}
          onUpdate={setStats}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </div>
  );
}

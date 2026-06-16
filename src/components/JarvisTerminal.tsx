import React, { useRef, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import type { SystemLog } from '../types/game';

interface JarvisTerminalProps {
  logs: SystemLog[];
}

export const JarvisTerminal: React.FC<JarvisTerminalProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] max-h-[700px] w-full">
      {/* Terminal Display */}
      <div className="flex-1 glass-panel glow-cyan rounded-xl p-4 flex flex-col overflow-hidden relative border border-cyan-500/25">
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-3 text-xs font-share text-cyan-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="tracking-widest">JARVIS // TERMINAL DE DIAGNÓSTICO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-emerald-400">EN LÍNEA</span>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-3 font-share text-sm pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2 rounded border leading-relaxed ${
                log.type === 'jarvis'
                  ? 'bg-cyan-950/20 border-cyan-500/10 text-cyan-200'
                  : log.type === 'parzival'
                  ? 'bg-pink-950/20 border-pink-500/10 text-pink-200'
                  : 'bg-zinc-900/40 border-zinc-700/20 text-yellow-300'
              }`}
            >
              <div className="flex justify-between items-center text-xs opacity-60 mb-1">
                <span className="font-bold uppercase tracking-wider">
                  {log.type === 'jarvis' ? '🤖 JARVIS' : log.type === 'parzival' ? '🕹️ Parzival' : '⚡ SISTEMA'}
                </span>
                <span>[{log.timestamp}]</span>
              </div>
              <div className="whitespace-pre-wrap">{log.text}</div>
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

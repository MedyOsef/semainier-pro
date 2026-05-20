import { useEffect, useRef } from 'react';
import {
  DoorOpen,
  PhoneCall,
  UsersRound,
  UtensilsCrossed,
  FolderOpen,
  Lightbulb,
  ClipboardCheck,
  Moon,
  Clock,
} from 'lucide-react';
import { JOURNEE_TYPE } from '@/lib/data';
import gsap from 'gsap';

const ICON_MAP: Record<string, React.ElementType> = {
  DoorOpen,
  PhoneCall,
  UsersRound,
  UtensilsCrossed,
  FolderOpen,
  Lightbulb,
  ClipboardCheck,
  Moon,
};

export function JourneeType() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.jt-item');
    gsap.from(items, {
      y: 10,
      opacity: 0,
      duration: 0.3,
      stagger: 0.06,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div
      className="rounded-2xl p-5 mb-5 relative overflow-hidden"
      style={{
        background: 'rgba(185,194,168,0.2)',
        border: '1px solid rgba(185,194,168,0.4)',
      }}
    >
      {/* Connector line */}
      <div
        className="absolute left-5 right-5 top-[88px] h-0.5 hidden md:block"
        style={{ background: 'var(--bor)' }}
      />

      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold flex items-center gap-2">
          <Clock size={16} /> Journée type
        </h4>
        <span className="text-xs text-[var(--txt2)] italic">Déroulement de la journée</span>
      </div>

      <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
        {JOURNEE_TYPE.map((item, idx) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <div
              key={idx}
              className="jt-item flex flex-col items-center gap-1.5 p-3 rounded-xl text-center relative transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-default"
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bor)',
                zIndex: 2,
              }}
            >
              {/* Connector dot */}
              <div
                className="hidden md:block absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: 'var(--terracotta)' }}
              />
              <span className="text-[11px] font-bold text-[var(--txt2)]">{item.time}</span>
              {Icon && <Icon size={20} style={{ color: 'var(--terracotta)' }} />}
              <span className="text-[11px] font-semibold uppercase text-[var(--txt)]">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

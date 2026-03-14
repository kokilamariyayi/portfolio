import { useEffect, useRef, useState } from 'react';
import { Briefcase, FolderOpen, Award, BookOpen } from 'lucide-react';

const stats = [
  { icon: FolderOpen, value: 8, label: 'Projects' },
  { icon: Briefcase, value: 3, label: 'Internships' },
  { icon: Award, value: 8, label: 'Certifications' },
  { icon: BookOpen, value: 4, label: 'Workshops' },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const CountUp = ({ target, active }: { target: number; active: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1500;
    const start = performance.now();
    let raf: number;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return <>{count}</>;
};

export const StatsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 backdrop-blur-sm px-4 py-5"
          style={{ minHeight: 120, maxWidth: 160, margin: '0 auto', width: '100%' }}
        >
          <s.icon className="h-5 w-5 text-primary mb-2" />
          <span className="text-[32px] font-heading font-bold leading-none">
            <CountUp target={s.value} active={visible} />
          </span>
          <span className="text-[12px] text-muted-foreground mt-1.5 tracking-wide uppercase">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};

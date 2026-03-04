import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingElement {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  type: string;
  scale: number;
  data: any;
}

const SQL_SNIPPETS = [
  'SELECT * FROM users',
  'GROUP BY category',
  'ORDER BY revenue DESC',
  'JOIN analytics ON',
  'WHERE score > 0.85',
  'COUNT(DISTINCT id)',
  'AVG(conversion_rate)',
  'HAVING SUM(val) > 100',
  'PARTITION BY region',
  'INNER JOIN metrics',
];

const TOOL_LABELS = ['Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'Scikit-learn', 'TensorFlow'];

const ELEMENT_TYPES = ['bar-chart', 'line-chart', 'scatter-plot', 'pie-chart', 'sql-snippet', 'data-grid', 'tool-label', 'pipeline-node'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateElementData(type: string) {
  switch (type) {
    case 'bar-chart':
      return { bars: Array.from({ length: 5 }, () => Math.random()) };
    case 'line-chart':
      return { points: Array.from({ length: 7 }, () => Math.random()) };
    case 'scatter-plot':
      return { dots: Array.from({ length: 8 }, () => ({ x: Math.random(), y: Math.random() })) };
    case 'pie-chart':
      return { slices: [0.35, 0.25, 0.2, 0.2] };
    case 'sql-snippet':
      return { text: SQL_SNIPPETS[Math.floor(Math.random() * SQL_SNIPPETS.length)] };
    case 'data-grid':
      return { rows: 4, cols: 4 };
    case 'tool-label':
      return { text: TOOL_LABELS[Math.floor(Math.random() * TOOL_LABELS.length)] };
    case 'pipeline-node':
      return { connections: Math.floor(Math.random() * 3) + 1 };
    default:
      return {};
  }
}

function createFloatingElement(w: number, h: number): FloatingElement {
  const type = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: randomBetween(-0.15, 0.15),
    vy: randomBetween(-0.1, 0.1),
    opacity: randomBetween(0.06, 0.18),
    type,
    scale: randomBetween(0.7, 1.2),
    data: generateElementData(type),
  };
}

export const AnalyticsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef(0);
  const elementsRef = useRef<FloatingElement[]>([]);
  const reducedMotion = useReducedMotion();

  const drawBarChart = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    const w = 60 * el.scale;
    const h = 40 * el.scale;
    const bars = el.data.bars as number[];
    const barW = w / bars.length - 2;
    ctx.globalAlpha = el.opacity;
    bars.forEach((v, i) => {
      const bh = v * h;
      ctx.fillStyle = color;
      ctx.fillRect(el.x + i * (barW + 2), el.y + h - bh, barW, bh);
    });
    // axis
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(el.x - 2, el.y);
    ctx.lineTo(el.x - 2, el.y + h);
    ctx.lineTo(el.x + w, el.y + h);
    ctx.stroke();
  }, []);

  const drawLineChart = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    const w = 70 * el.scale;
    const h = 35 * el.scale;
    const pts = el.data.points as number[];
    ctx.globalAlpha = el.opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((v, i) => {
      const px = el.x + (i / (pts.length - 1)) * w;
      const py = el.y + h - v * h;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    // area fill
    ctx.lineTo(el.x + w, el.y + h);
    ctx.lineTo(el.x, el.y + h);
    ctx.closePath();
    ctx.globalAlpha = el.opacity * 0.3;
    ctx.fillStyle = color;
    ctx.fill();
  }, []);

  const drawScatterPlot = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    const w = 50 * el.scale;
    const h = 40 * el.scale;
    ctx.globalAlpha = el.opacity;
    ctx.fillStyle = color;
    (el.data.dots as { x: number; y: number }[]).forEach(d => {
      ctx.beginPath();
      ctx.arc(el.x + d.x * w, el.y + d.y * h, 1.5 * el.scale, 0, Math.PI * 2);
      ctx.fill();
    });
    // axes
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(el.x, el.y);
    ctx.lineTo(el.x, el.y + h);
    ctx.lineTo(el.x + w, el.y + h);
    ctx.stroke();
  }, []);

  const drawPieChart = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, primaryColor: string, accentColor: string) => {
    const r = 18 * el.scale;
    const cx = el.x + r;
    const cy = el.y + r;
    const slices = el.data.slices as number[];
    let angle = -Math.PI / 2;
    ctx.globalAlpha = el.opacity;
    const colors = [primaryColor, accentColor, primaryColor, accentColor];
    slices.forEach((s, i) => {
      const end = angle + s * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = el.opacity * (0.6 + i * 0.1);
      ctx.fill();
      angle = end;
    });
  }, []);

  const drawSqlSnippet = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    ctx.globalAlpha = el.opacity;
    ctx.fillStyle = color;
    ctx.font = `${11 * el.scale}px "Courier New", monospace`;
    ctx.fillText(el.data.text, el.x, el.y);
  }, []);

  const drawDataGrid = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    const cellW = 14 * el.scale;
    const cellH = 8 * el.scale;
    ctx.globalAlpha = el.opacity * 0.6;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= el.data.rows; r++) {
      ctx.beginPath();
      ctx.moveTo(el.x, el.y + r * cellH);
      ctx.lineTo(el.x + el.data.cols * cellW, el.y + r * cellH);
      ctx.stroke();
    }
    for (let c = 0; c <= el.data.cols; c++) {
      ctx.beginPath();
      ctx.moveTo(el.x + c * cellW, el.y);
      ctx.lineTo(el.x + c * cellW, el.y + el.data.rows * cellH);
      ctx.stroke();
    }
  }, []);

  const drawToolLabel = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string, borderColor: string) => {
    ctx.globalAlpha = el.opacity;
    const text = el.data.text as string;
    ctx.font = `${10 * el.scale}px "Space Grotesk", sans-serif`;
    const tw = ctx.measureText(text).width;
    const pad = 6 * el.scale;
    // pill bg
    ctx.fillStyle = borderColor;
    ctx.globalAlpha = el.opacity * 0.4;
    const rr = 4 * el.scale;
    ctx.beginPath();
    ctx.roundRect(el.x - pad, el.y - 10 * el.scale, tw + pad * 2, 16 * el.scale, rr);
    ctx.fill();
    // text
    ctx.globalAlpha = el.opacity;
    ctx.fillStyle = color;
    ctx.fillText(text, el.x, el.y);
  }, []);

  const drawPipelineNode = useCallback((ctx: CanvasRenderingContext2D, el: FloatingElement, color: string) => {
    const r = 6 * el.scale;
    ctx.globalAlpha = el.opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    // node circle
    ctx.beginPath();
    ctx.arc(el.x, el.y, r, 0, Math.PI * 2);
    ctx.stroke();
    // connection lines
    for (let c = 0; c < el.data.connections; c++) {
      const angle = (c / el.data.connections) * Math.PI - Math.PI / 2;
      const len = 30 * el.scale;
      const ex = el.x + Math.cos(angle) * len;
      const ey = el.y + Math.sin(angle) * len;
      ctx.beginPath();
      ctx.moveTo(el.x + Math.cos(angle) * r, el.y + Math.sin(angle) * r);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      // end node
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 14 : 28;
    elementsRef.current = Array.from({ length: count }, () => createFloatingElement(canvas.width, canvas.height));

    // Read CSS variables for theme colors
    const style = getComputedStyle(document.documentElement);
    const primaryHSL = style.getPropertyValue('--primary').trim();
    const accentHSL = style.getPropertyValue('--accent').trim();
    const primaryColor = `hsl(${primaryHSL})`;
    const accentColor = `hsl(${accentHSL})`;
    const borderHSL = style.getPropertyValue('--border').trim();
    const borderColor = `hsl(${borderHSL})`;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elements = elementsRef.current;

      for (const el of elements) {
        el.x += el.vx;
        el.y += el.vy;

        // wrap around
        if (el.x < -100) el.x = canvas.width + 50;
        if (el.x > canvas.width + 100) el.x = -50;
        if (el.y < -80) el.y = canvas.height + 50;
        if (el.y > canvas.height + 80) el.y = -50;

        ctx.save();
        switch (el.type) {
          case 'bar-chart': drawBarChart(ctx, el, primaryColor); break;
          case 'line-chart': drawLineChart(ctx, el, accentColor); break;
          case 'scatter-plot': drawScatterPlot(ctx, el, primaryColor); break;
          case 'pie-chart': drawPieChart(ctx, el, primaryColor, accentColor); break;
          case 'sql-snippet': drawSqlSnippet(ctx, el, primaryColor); break;
          case 'data-grid': drawDataGrid(ctx, el, borderColor); break;
          case 'tool-label': drawToolLabel(ctx, el, primaryColor, borderColor); break;
          case 'pipeline-node': drawPipelineNode(ctx, el, accentColor); break;
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [reducedMotion, drawBarChart, drawLineChart, drawScatterPlot, drawPieChart, drawSqlSnippet, drawDataGrid, drawToolLabel, drawPipelineNode]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
};

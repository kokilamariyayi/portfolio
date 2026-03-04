import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── Helpers ──────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// ─── Theme reader ─────────────────────────────────────────────────────
function readTheme() {
  const s = getComputedStyle(document.documentElement);
  const get = (v: string) => `hsl(${s.getPropertyValue(v).trim()})`;
  return {
    primary: get('--primary'),
    accent: get('--accent'),
    card: get('--card'),
    border: get('--border'),
    muted: get('--muted'),
    mutedFg: get('--muted-foreground'),
    fg: get('--foreground'),
    bg: get('--background'),
  };
}

// ─── Panel layout: positions computed as ratios of canvas size ────────
interface Panel { x: number; y: number; w: number; h: number; }

function layoutPanels(cw: number, ch: number, isMobile: boolean) {
  const p = (rx: number, ry: number, rw: number, rh: number): Panel => ({
    x: rx * cw, y: ry * ch, w: rw * cw, h: rh * ch,
  });

  if (isMobile) {
    return {
      dashboard: p(0.03, 0.02, 0.45, 0.35),
      sqlEditor: p(0.52, 0.02, 0.45, 0.35),
      dataTable: p(0.03, 0.40, 0.94, 0.25),
      pipeline: p(0.03, 0.68, 0.55, 0.28),
      kpiCards: p(0.62, 0.68, 0.35, 0.28),
    };
  }
  return {
    dashboard: p(0.02, 0.03, 0.38, 0.45),
    sqlEditor: p(0.42, 0.03, 0.35, 0.45),
    dataTable: p(0.79, 0.03, 0.19, 0.45),
    pipeline: p(0.02, 0.52, 0.48, 0.44),
    kpiCards: p(0.52, 0.52, 0.46, 0.44),
  };
}

// ─── Draw: Panel frame ───────────────────────────────────────────────
function drawPanelFrame(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, title: string, alpha: number) {
  ctx.globalAlpha = alpha * 0.12;
  ctx.fillStyle = theme.card;
  roundRect(ctx, panel.x, panel.y, panel.w, panel.h, 8);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.15;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1;
  roundRect(ctx, panel.x, panel.y, panel.w, panel.h, 8);
  ctx.stroke();

  // Title bar
  ctx.globalAlpha = alpha * 0.2;
  ctx.fillStyle = theme.muted;
  roundRect(ctx, panel.x, panel.y, panel.w, 24, [8, 8, 0, 0] as any);
  ctx.fill();

  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = theme.mutedFg;
  ctx.font = '10px "Space Grotesk", sans-serif';
  ctx.fillText(title, panel.x + 10, panel.y + 16);

  // Window dots
  const dotX = panel.x + panel.w - 30;
  [theme.accent, theme.primary, theme.muted].forEach((c, i) => {
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(dotX + i * 10, panel.y + 12, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ─── Draw: Dashboard with charts ─────────────────────────────────────
function drawDashboard(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, t: number, alpha: number) {
  drawPanelFrame(ctx, panel, theme, '📊 Analytics Dashboard', alpha);

  const cx = panel.x + 12;
  const cy = panel.y + 34;
  const cw = panel.w - 24;
  const ch = panel.h - 46;

  // Bar chart (top-left quadrant)
  const barArea = { x: cx, y: cy, w: cw * 0.48, h: ch * 0.48 };
  const bars = [0.6, 0.85, 0.45, 0.7, 0.9, 0.55, 0.75];
  const barW = barArea.w / (bars.length * 1.8);
  bars.forEach((v, i) => {
    const animated = v * (0.7 + 0.3 * Math.sin(t * 0.5 + i * 0.8));
    const bh = animated * barArea.h * 0.8;
    const bx = barArea.x + i * (barW + barW * 0.8);
    ctx.globalAlpha = alpha * 0.2;
    ctx.fillStyle = i % 2 === 0 ? theme.primary : theme.accent;
    ctx.fillRect(bx, barArea.y + barArea.h - bh, barW, bh);
  });

  // Line chart (top-right quadrant)
  const lineArea = { x: cx + cw * 0.54, y: cy, w: cw * 0.44, h: ch * 0.48 };
  ctx.globalAlpha = alpha * 0.2;
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const linePoints = 12;
  for (let i = 0; i < linePoints; i++) {
    const px = lineArea.x + (i / (linePoints - 1)) * lineArea.w;
    const py = lineArea.y + lineArea.h * 0.5 + Math.sin(t * 0.3 + i * 0.6) * lineArea.h * 0.3;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();
  // Fill under line
  ctx.lineTo(lineArea.x + lineArea.w, lineArea.y + lineArea.h);
  ctx.lineTo(lineArea.x, lineArea.y + lineArea.h);
  ctx.closePath();
  ctx.globalAlpha = alpha * 0.05;
  ctx.fillStyle = theme.primary;
  ctx.fill();

  // Pie chart (bottom-left)
  const pieArea = { x: cx + cw * 0.12, y: cy + ch * 0.62, r: Math.min(cw, ch) * 0.14 };
  const slices = [0.35, 0.25, 0.22, 0.18];
  const sliceColors = [theme.primary, theme.accent, theme.mutedFg, theme.muted];
  let angle = -Math.PI / 2 + t * 0.05;
  slices.forEach((s, i) => {
    const end = angle + s * Math.PI * 2;
    ctx.globalAlpha = alpha * (0.15 + i * 0.03);
    ctx.fillStyle = sliceColors[i];
    ctx.beginPath();
    ctx.moveTo(pieArea.x, pieArea.y);
    ctx.arc(pieArea.x, pieArea.y, pieArea.r, angle, end);
    ctx.closePath();
    ctx.fill();
    angle = end;
  });

  // Scatter plot (bottom-right)
  const scatterArea = { x: cx + cw * 0.54, y: cy + ch * 0.54, w: cw * 0.44, h: ch * 0.42 };
  ctx.globalAlpha = alpha * 0.12;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(scatterArea.x, scatterArea.y);
  ctx.lineTo(scatterArea.x, scatterArea.y + scatterArea.h);
  ctx.lineTo(scatterArea.x + scatterArea.w, scatterArea.y + scatterArea.h);
  ctx.stroke();

  const scatterPts = [
    [0.1, 0.8], [0.2, 0.6], [0.3, 0.65], [0.35, 0.4], [0.45, 0.5],
    [0.5, 0.3], [0.6, 0.35], [0.7, 0.2], [0.75, 0.25], [0.85, 0.15], [0.9, 0.1],
  ];
  scatterPts.forEach(([sx, sy]) => {
    ctx.globalAlpha = alpha * 0.25;
    ctx.fillStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(
      scatterArea.x + sx * scatterArea.w,
      scatterArea.y + sy * scatterArea.h + Math.sin(t * 0.4 + sx * 5) * 3,
      2.5, 0, Math.PI * 2
    );
    ctx.fill();
  });
}

// ─── Draw: SQL Editor ────────────────────────────────────────────────
const SQL_LINES = [
  'SELECT',
  '  u.user_id,',
  '  u.name,',
  '  COUNT(o.order_id) AS total_orders,',
  '  SUM(o.amount) AS revenue,',
  '  AVG(o.amount) AS avg_order_value,',
  '  RANK() OVER (',
  '    PARTITION BY u.region',
  '    ORDER BY SUM(o.amount) DESC',
  '  ) AS region_rank',
  'FROM users u',
  'INNER JOIN orders o',
  '  ON u.user_id = o.user_id',
  'WHERE o.status = \'completed\'',
  '  AND o.created_at >= \'2024-01-01\'',
  'GROUP BY u.user_id, u.name, u.region',
  'HAVING SUM(o.amount) > 1000',
  'ORDER BY revenue DESC',
  'LIMIT 50;',
  '',
  '-- Pipeline: ETL Transform',
  'WITH monthly AS (',
  '  SELECT DATE_TRUNC(\'month\', date) AS m,',
  '    SUM(value) AS total',
  '  FROM metrics',
  '  GROUP BY 1',
  ')',
  'SELECT m, total,',
  '  LAG(total) OVER (ORDER BY m) AS prev,',
  '  ROUND((total - LAG(total) OVER',
  '    (ORDER BY m)) / LAG(total)',
  '    OVER (ORDER BY m) * 100, 2',
  '  ) AS growth_pct',
  'FROM monthly;',
];

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'AS', 'AND', 'OR', 'WITH', 'OVER', 'PARTITION', 'DESC', 'ASC', 'COUNT', 'SUM', 'AVG', 'RANK', 'LAG', 'ROUND', 'DATE_TRUNC'];

function drawSqlEditor(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, t: number, alpha: number) {
  drawPanelFrame(ctx, panel, theme, '🗄️ SQL Query Editor', alpha);

  const cx = panel.x + 10;
  const cy = panel.y + 32;
  const lineH = 14;
  const maxLines = Math.floor((panel.h - 40) / lineH);
  const scrollOffset = Math.floor(t * 0.15) % SQL_LINES.length;

  for (let i = 0; i < maxLines; i++) {
    const lineIdx = (scrollOffset + i) % SQL_LINES.length;
    const line = SQL_LINES[lineIdx];
    const yPos = cy + i * lineH;

    // Line number
    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = theme.mutedFg;
    ctx.font = '9px "Courier New", monospace';
    ctx.fillText(String(lineIdx + 1).padStart(2, ' '), cx, yPos);

    // Code with keyword highlighting
    ctx.font = '10px "Courier New", monospace';
    const words = line.split(/(\s+)/);
    let xOff = cx + 22;
    words.forEach(word => {
      const upper = word.trim().toUpperCase();
      if (SQL_KEYWORDS.includes(upper)) {
        ctx.globalAlpha = alpha * 0.35;
        ctx.fillStyle = theme.primary;
      } else if (word.startsWith('\'') || word.startsWith('--')) {
        ctx.globalAlpha = alpha * 0.25;
        ctx.fillStyle = theme.accent;
      } else {
        ctx.globalAlpha = alpha * 0.22;
        ctx.fillStyle = theme.fg;
      }
      ctx.fillText(word, xOff, yPos);
      xOff += ctx.measureText(word).width;
    });
  }

  // Blinking cursor
  if (Math.sin(t * 3) > 0) {
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = theme.primary;
    ctx.fillRect(cx + 22, cy + (maxLines - 1) * lineH - 10, 6, 12);
  }
}

// ─── Draw: Data Table ────────────────────────────────────────────────
const TABLE_HEADERS = ['ID', 'Region', 'Revenue', 'Growth', 'Score'];
const TABLE_DATA = [
  ['001', 'APAC', '$24.5K', '+12.3%', '0.89'],
  ['002', 'EMEA', '$18.2K', '+8.7%', '0.76'],
  ['003', 'NA', '$31.8K', '+15.1%', '0.92'],
  ['004', 'LATAM', '$9.4K', '+22.4%', '0.68'],
  ['005', 'APAC', '$27.1K', '+6.9%', '0.84'],
  ['006', 'EMEA', '$21.6K', '-2.1%', '0.71'],
  ['007', 'NA', '$35.2K', '+18.5%', '0.95'],
  ['008', 'LATAM', '$12.8K', '+9.8%', '0.73'],
  ['009', 'APAC', '$19.7K', '+11.2%', '0.81'],
  ['010', 'NA', '$29.3K', '+7.4%', '0.88'],
];

function drawDataTable(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, t: number, alpha: number) {
  drawPanelFrame(ctx, panel, theme, '📋 Dataset Preview', alpha);

  const cx = panel.x + 8;
  const cy = panel.y + 34;
  const rowH = Math.min(18, (panel.h - 44) / (TABLE_DATA.length + 1));
  const colW = (panel.w - 16) / TABLE_HEADERS.length;

  // Headers
  ctx.globalAlpha = alpha * 0.3;
  ctx.fillStyle = theme.muted;
  ctx.fillRect(cx, cy, panel.w - 16, rowH);

  ctx.font = 'bold 9px "Space Grotesk", sans-serif';
  ctx.globalAlpha = alpha * 0.35;
  ctx.fillStyle = theme.primary;
  TABLE_HEADERS.forEach((h, i) => {
    ctx.fillText(h, cx + i * colW + 4, cy + rowH - 5);
  });

  // Rows with scroll
  const scrollRow = Math.floor(t * 0.2) % TABLE_DATA.length;
  const maxRows = Math.floor((panel.h - 44 - rowH) / rowH);
  for (let r = 0; r < Math.min(maxRows, TABLE_DATA.length); r++) {
    const dataIdx = (scrollRow + r) % TABLE_DATA.length;
    const row = TABLE_DATA[dataIdx];
    const ry = cy + (r + 1) * rowH;

    // Alternating row bg
    if (r % 2 === 0) {
      ctx.globalAlpha = alpha * 0.04;
      ctx.fillStyle = theme.muted;
      ctx.fillRect(cx, ry, panel.w - 16, rowH);
    }

    // Highlight row
    if (r === Math.floor(Math.sin(t * 0.5) * 2 + 3)) {
      ctx.globalAlpha = alpha * 0.08;
      ctx.fillStyle = theme.primary;
      ctx.fillRect(cx, ry, panel.w - 16, rowH);
    }

    ctx.font = '9px "Courier New", monospace';
    row.forEach((cell, ci) => {
      ctx.globalAlpha = alpha * 0.22;
      ctx.fillStyle = cell.startsWith('+') ? theme.primary : cell.startsWith('-') ? theme.accent : theme.fg;
      ctx.fillText(cell, cx + ci * colW + 4, ry + rowH - 5);
    });
  }
}

// ─── Draw: Pipeline / ETL flow ───────────────────────────────────────
function drawPipeline(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, t: number, alpha: number) {
  drawPanelFrame(ctx, panel, theme, '🔗 Data Pipeline & ETL Flow', alpha);

  const cx = panel.x + 20;
  const cy = panel.y + 40;
  const pw = panel.w - 40;
  const ph = panel.h - 55;

  const nodes = [
    { label: 'Raw Data', rx: 0, ry: 0.15 },
    { label: 'Ingestion', rx: 0.18, ry: 0.05 },
    { label: 'Cleaning', rx: 0.18, ry: 0.45 },
    { label: 'Transform', rx: 0.38, ry: 0.2 },
    { label: 'Feature Eng.', rx: 0.55, ry: 0.05 },
    { label: 'ML Model', rx: 0.55, ry: 0.45 },
    { label: 'Validation', rx: 0.72, ry: 0.2 },
    { label: 'Dashboard', rx: 0.88, ry: 0.05 },
    { label: 'Reports', rx: 0.88, ry: 0.45 },
  ];

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [6, 8],
  ];

  const nodePositions = nodes.map(n => ({
    x: cx + n.rx * pw,
    y: cy + n.ry * ph,
    label: n.label,
  }));

  // Draw edges with animated flow
  edges.forEach(([from, to], ei) => {
    const a = nodePositions[from];
    const b = nodePositions[to];
    ctx.globalAlpha = alpha * 0.12;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    // Curved connection
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2 - 10;
    ctx.quadraticCurveTo(midX, midY, b.x, b.y);
    ctx.stroke();

    // Animated dot along edge
    const progress = ((t * 0.3 + ei * 0.7) % 3) / 3;
    const dotX = lerp(lerp(a.x, midX, progress), lerp(midX, b.x, progress), progress);
    const dotY = lerp(lerp(a.y, midY, progress), lerp(midY, b.y, progress), progress);
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw nodes
  nodePositions.forEach((n, i) => {
    const pulse = 1 + Math.sin(t * 0.8 + i) * 0.08;
    const r = 20 * pulse;

    ctx.globalAlpha = alpha * 0.1;
    ctx.fillStyle = theme.card;
    roundRect(ctx, n.x - r, n.y - r * 0.6, r * 2, r * 1.2, 6);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.18;
    ctx.strokeStyle = i === 0 ? theme.accent : theme.primary;
    ctx.lineWidth = 1;
    roundRect(ctx, n.x - r, n.y - r * 0.6, r * 2, r * 1.2, 6);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = theme.fg;
    ctx.font = '8px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, n.x, n.y + 3);
    ctx.textAlign = 'left';
  });

  // Bottom labels
  const tools = ['Python', 'Apache Spark', 'Airflow', 'dbt', 'BigQuery'];
  const toolY = cy + ph - 5;
  tools.forEach((tool, i) => {
    const tx = cx + (i / (tools.length - 1)) * pw;
    ctx.globalAlpha = alpha * 0.15;
    ctx.fillStyle = theme.mutedFg;
    ctx.font = '8px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(tool, tx, toolY);
    ctx.textAlign = 'left';
  });
}

// ─── Draw: KPI Cards & Metrics ───────────────────────────────────────
function drawKPICards(ctx: CanvasRenderingContext2D, panel: Panel, theme: ReturnType<typeof readTheme>, t: number, alpha: number) {
  drawPanelFrame(ctx, panel, theme, '📈 KPI Metrics & Analytics', alpha);

  const cx = panel.x + 10;
  const cy = panel.y + 34;
  const pw = panel.w - 20;
  const ph = panel.h - 44;

  const kpis = [
    { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', positive: true },
    { label: 'Active Users', value: '84.2K', change: '+8.3%', positive: true },
    { label: 'Conversion', value: '3.42%', change: '-0.8%', positive: false },
    { label: 'Avg Session', value: '4m 32s', change: '+15.1%', positive: true },
    { label: 'Churn Rate', value: '2.1%', change: '-1.2%', positive: true },
    { label: 'NPS Score', value: '72', change: '+5pts', positive: true },
  ];

  const cols = 3;
  const rows = 2;
  const cardW = pw / cols - 6;
  const cardH = ph / rows - 6;

  kpis.forEach((kpi, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = cx + col * (cardW + 6);
    const y = cy + row * (cardH + 6);

    // Card bg
    ctx.globalAlpha = alpha * 0.08;
    ctx.fillStyle = theme.muted;
    roundRect(ctx, x, y, cardW, cardH, 6);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.12;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 0.5;
    roundRect(ctx, x, y, cardW, cardH, 6);
    ctx.stroke();

    // Label
    ctx.globalAlpha = alpha * 0.2;
    ctx.fillStyle = theme.mutedFg;
    ctx.font = '8px "Space Grotesk", sans-serif';
    ctx.fillText(kpi.label, x + 8, y + 14);

    // Value with animation
    ctx.globalAlpha = alpha * 0.35;
    ctx.fillStyle = theme.fg;
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.fillText(kpi.value, x + 8, y + 32);

    // Change indicator
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = kpi.positive ? theme.primary : theme.accent;
    ctx.font = '9px "Courier New", monospace';
    ctx.fillText(kpi.change, x + 8, y + 46);

    // Mini sparkline
    ctx.globalAlpha = alpha * 0.15;
    ctx.strokeStyle = kpi.positive ? theme.primary : theme.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let s = 0; s < 8; s++) {
      const sx = x + cardW - 50 + s * 5;
      const sy = y + cardH - 12 + Math.sin(t * 0.4 + s * 0.9 + i) * 6;
      s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  });

  // Bottom: tool badges
  const badges = ['Power BI', 'Tableau', 'Excel', 'Looker', 'Metabase'];
  const badgeY = cy + ph - 4;
  badges.forEach((badge, i) => {
    const bx = cx + (i / (badges.length - 1)) * (pw - 40);
    ctx.globalAlpha = alpha * 0.08;
    ctx.fillStyle = theme.muted;
    const tw = ctx.measureText(badge).width + 12;
    roundRect(ctx, bx, badgeY - 10, tw, 14, 4);
    ctx.fill();

    ctx.globalAlpha = alpha * 0.2;
    ctx.fillStyle = theme.mutedFg;
    ctx.font = '7px "Courier New", monospace';
    ctx.fillText(badge, bx + 6, badgeY);
  });
}

// ─── Main component ──────────────────────────────────────────────────
export const AnalyticsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const reducedMotion = useReducedMotion();

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

    const theme = readTheme();
    let startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = canvas.width < 768;
      const panels = layoutPanels(canvas.width, canvas.height, isMobile);
      const alpha = isMobile ? 0.8 : 1;

      drawDashboard(ctx, panels.dashboard, theme, elapsed, alpha);
      drawSqlEditor(ctx, panels.sqlEditor, theme, elapsed, alpha);
      drawDataTable(ctx, panels.dataTable, theme, elapsed, alpha);
      drawPipeline(ctx, panels.pipeline, theme, elapsed, alpha);
      drawKPICards(ctx, panels.kpiCards, theme, elapsed, alpha);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [reducedMotion]);

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

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowDown, User, Code, Award, Lightbulb,
  Github, Linkedin, ExternalLink,
  Mail, MapPin, Phone, Send,
  Download, Briefcase, GraduationCap, BookOpen, BadgeCheck,
} from 'lucide-react';
import { toast } from 'sonner';

import { AnimatedSection } from '@/components/AnimatedSection';
import { PageTransition } from '@/components/PageTransition';
import { StatsCounter, CountUp } from '@/components/StatsCounter';
import { SkillRingCard } from '@/components/SkillRingCard';
import { ProjectCard } from '@/components/ProjectCard';
import { FlipCertCard } from '@/components/FlipCertCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ─── Data ─── */

const storyItems = [
  { icon: User, title: 'Who I Am', description: 'An aspiring AI & ML engineer with a strong foundation in data analysis, statistics, and machine learning — driven by curiosity and a passion for impactful technology.' },
  { icon: Code, title: 'What I Do', description: 'Building intelligent systems with Python, NLP, LLMs, and cloud technologies. From sentiment analysis to fraud detection — I turn data into decisions.' },
  { icon: Award, title: "What I've Built", description: 'AI-powered expense forecasting tools, sentiment analysis platforms, fraud detection systems, and voice-controlled assistants for elderly care.' },
  { icon: Lightbulb, title: 'How I Think', description: 'Every dataset tells a story. I approach problems with analytical thinking and visualization skills to derive meaningful insights and support data-driven decisions.' },
];

const skills = [
  { name: 'NLP', level: 85, category: 'ML' },
  { name: 'LLM', level: 80, category: 'ML' },
  { name: 'RAG', level: 78, category: 'ML' },
  { name: 'Prompt Eng.', level: 88, category: 'ML' },
  { name: 'Agentic AI', level: 75, category: 'ML' },
  { name: 'Python', level: 90, category: 'Languages' },
  { name: 'SQL', level: 85, category: 'Languages' },
  { name: 'REST API', level: 80, category: 'Tools' },
  { name: 'AWS', level: 72, category: 'Cloud' },
  { name: 'Dashboards', level: 85, category: 'Tools' },
  { name: 'Git', level: 85, category: 'Tools' },
  { name: 'Power BI', level: 82, category: 'Tools' },
  { name: 'IBM AutoAI', level: 75, category: 'Cloud' },
  { name: 'TensorFlow', level: 70, category: 'ML' },
  { name: 'Web Dev', level: 75, category: 'Tools' },
];

const projects = [
  { id: 1, title: 'Social Media Sentiment Analysis', description: 'Developed a comparative sentiment analysis project using TF-IDF + Logistic Regression and RoBERTa.', category: 'NLP / AI', tags: ['Python', 'TF-IDF', 'RoBERTa', 'NLP'], link: 'https://github.com/kokilamariyayi/SENTIMENT_ANALYIS' },
  { id: 2, title: 'AI Powered Financial Fraud Detection', description: 'Designed a behavior-driven fraud detection approach using anomaly detection techniques.', category: 'Machine Learning', tags: ['Python', 'Anomaly Detection', 'ML', 'Data Analysis'], link: 'https://github.com/kokilamariyayi/FINANCIAL_FRAUD_DETECTION-SYSTEM' },
  { id: 3, title: 'Voice Controlled Assistant For Elderly Care', description: 'Developed an AI-based voice assistant using Python, NLP, and IoT to support elderly care.', category: 'AI / IoT', tags: ['Python', 'NLP', 'IoT', 'Speech Recognition'], link: '#' },
  { id: 4, title: 'AI Expense Forecasting Tool', description: 'Built an AI-based Expense Forecasting Tool using Python with a chatbot module.', category: 'AI / Finance', tags: ['Python', 'AI', 'Chatbot', 'Forecasting'], link: '#' },
  { id: 5, title: 'HR Analysis Dashboard', description: 'Built an HR Analysis Dashboard using Power BI to analyze workforce metrics.', category: 'Data Analytics', tags: ['Power BI', 'Data Visualization', 'HR Analytics'], link: 'https://app.powerbi.com/groups/me/reports/a9911c41-af63-4561-98a2-418653025636/5b43b69580b2c691a4c0?ctid=c0fafca5-3230-4b8a-920e-e7029dbc049c&experience=power-bi' },
  { id: 6, title: 'Cloud-Based ML Prediction System', description: 'Built a cloud-based ML Prediction system using IBM AutoAI.', category: 'Cloud / ML', tags: ['IBM AutoAI', 'Cloud', 'ML', 'AutoML'], link: '#' },
];

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg>
);
const HackerRankIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 11.885 0 13-.642 1.114-9.107 6-10.392 6-1.285 0-9.75-4.886-10.392-6C.963 17.885.963 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v4.363H9.963V6.799h.001a.26.26 0 0 0-.26-.258H8.963a.26.26 0 0 0-.26.258v10.403c0 .141.116.258.26.258h.741a.26.26 0 0 0 .26-.258v-4.507h4.073v4.507c0 .141.116.258.258.258h.742a.26.26 0 0 0 .258-.258V6.799a.26.26 0 0 0-.258-.258h-.742z" /></svg>
);
const GeeksForGeeksIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-1.106-.705 3.917 3.917 0 0 1-.566-.77h-.004a3.917 3.917 0 0 1-.566.77 3.79 3.79 0 0 1-1.106.705 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.39 3.39 0 0 1-.565-.745A3.54 3.54 0 0 1 8.434 13H2v-1.801h1.797c-.016-.295.04-.59.164-.858.124-.269.31-.505.543-.69a3.56 3.56 0 0 1 1.066-.64 4.316 4.316 0 0 1 3.006.007 3.716 3.716 0 0 1 1.067.667c.232.195.417.44.541.715h.008c.124-.275.31-.52.541-.715a3.716 3.716 0 0 1 1.067-.667 4.316 4.316 0 0 1 3.006-.007c.39.148.748.367 1.066.64.233.185.419.421.543.69.124.268.18.563.164.858H22V13a3.54 3.54 0 0 1-.55 1.315zM12 14.545a2.666 2.666 0 0 0 1.914.793 2.666 2.666 0 0 0 1.914-.793 2.795 2.795 0 0 0 .793-1.963 2.768 2.768 0 0 0-.793-1.949 2.678 2.678 0 0 0-1.914-.786 2.678 2.678 0 0 0-1.914.786 2.768 2.768 0 0 0-.793 1.95 2.795 2.795 0 0 0 .793 1.962zm-5.87 0a2.666 2.666 0 0 0 1.915.793 2.666 2.666 0 0 0 1.913-.793 2.795 2.795 0 0 0 .794-1.963 2.768 2.768 0 0 0-.794-1.949 2.678 2.678 0 0 0-1.913-.786 2.678 2.678 0 0 0-1.914.786 2.768 2.768 0 0 0-.793 1.95 2.795 2.795 0 0 0 .793 1.962z" /></svg>
);

const profiles = [
  { name: 'GitHub', username: '@kokilamariyayi', description: 'Open source contributions, AI/ML projects, and experiments.', url: 'https://github.com/kokilamariyayi', icon: Github, stats: '10 repos · 340+ contributions' },
  { name: 'LinkedIn', username: 'kokila-m-ai-ds', description: 'Professional network, career updates, and industry connections.', url: 'https://www.linkedin.com/in/kokila-m-ai-ds', icon: Linkedin },
  { name: 'LeetCode', username: '@KokilaMariyayi', description: 'Solving DSA problems and sharpening problem-solving skills.', url: 'https://leetcode.com/u/KokilaMariyayi/', icon: LeetCodeIcon, stats: '83 solved (Easy 55 · Med 23 · Hard 5)' },
  { name: 'HackerRank', username: '@kokilakoki3376', description: 'Competitive programming, skill certifications, and coding challenges.', url: 'https://www.hackerrank.com/profile/kokilakoki3376', icon: HackerRankIcon, stats: '32/64 Java challenges · Points 358' },
  { name: 'GeeksForGeeks', username: '@kokilamariyayi', description: 'DSA practice, articles, and computer science fundamentals.', url: 'https://www.geeksforgeeks.org/profile/kokilakokmnu', icon: GeeksForGeeksIcon, stats: 'Score 224 · Monthly Score 60' },
];

interface BadgeData { emoji: string; name: string; platform: string; special?: boolean; }
const badges: BadgeData[] = [
  { emoji: '🔥', name: '50 Days Badge', platform: 'LeetCode', special: true },
  { emoji: '⭐', name: 'Java 5-Star', platform: 'HackerRank', special: true },
  { emoji: '🏆', name: '83 Problems Solved', platform: 'LeetCode', special: false },
  { emoji: '📈', name: 'Max Streak 16', platform: 'LeetCode', special: true },
  { emoji: '💻', name: '130 Submissions/yr', platform: 'LeetCode', special: false },
  { emoji: '🎯', name: 'Score 224', platform: 'GeeksForGeeks', special: false },
  { emoji: '🗓️', name: '78 Active Days', platform: 'LeetCode', special: false },
  { emoji: '🚀', name: '340+ Contributions', platform: 'GitHub', special: true },
];

const certifications = [
  { name: 'Google Business Intelligence', issuer: 'Coursera & Google', year: '2025', emoji: '📊', image: '/certificates/google-bi.jpg' },
  { name: 'Deep Learning For Developers', issuer: 'Infosys', year: '2025', emoji: '🧠', image: '/certificates/deep-learning-infosys.jpg' },
  { name: 'Introduction to LLMs', issuer: 'NPTEL', year: '2025', emoji: '🤖', image: '/certificates/llm-nptel.jpg' },
  { name: 'Deep Learning', issuer: 'NPTEL', year: '2025', emoji: '🔬', image: '/certificates/dl-nptel.jpg' },
  { name: 'IBM Generative AI Engineering', issuer: 'IBM & Coursera', year: '2025', emoji: '⚙️', image: '/certificates/ibm-genai.jpg' },
  { name: 'Prompt Engineering', issuer: 'Infosys', year: '2025', emoji: '💡', image: '/certificates/prompt-eng.jpg' },
  { name: 'Microsoft AI & ML Engineering', issuer: 'Microsoft & Google', year: '2025', emoji: '🏅', image: '/certificates/ms-ai-ml.jpg' },
  { name: 'SQL & Relational Databases', issuer: 'Cognizant & IBM', year: '2024', emoji: '🗄️', image: '/certificates/sql-ibm.jpg' },
];

const internships = [
  { role: 'Artificial Intelligence Intern', company: 'Infosys Springboard 6.0', period: 'Sep — Dec 2025', description: 'Designed an AI-based Expense Forecasting Tool using Python and included a chatbot module for user interaction.' },
  { role: 'Emerging Technologies (AI & Cloud)', company: 'Edunet Foundation (AICTE)', period: 'Jul — Aug 2025', description: 'Built a cloud-based ML Prediction system using IBM AutoAI.' },
  { role: 'Data Analytics Intern', company: 'NoviTech R&D Pvt. Ltd, Coimbatore', period: 'Aug — Sep 2024', description: 'Built an HR Analysis Dashboard using Power BI.' },
];

const education = [
  { degree: 'B.Tech Artificial Intelligence And Data Science', school: 'Anna University, Nehru Institute Of Engineering And Technology, Coimbatore', period: '2023 — 2027', detail: '8.79 CGPA' },
  { degree: 'HSC & SSLC', school: 'Dhanalakshmi Srinivasan Higher Secondary School, Perambalur', period: '2022 — 2023', detail: '89.99%' },
];

const workshops = [
  { title: 'Full Stack Web Application Development', org: 'Entire Skill, Coimbatore', period: 'Nov 2025 (3 days)' },
  { title: 'Generative AI, LLMs, and Prompt Engineering', org: 'Gateway Software Solutions', period: 'Mar 2025 (7 days)' },
  { title: 'Python Programming Skills', org: 'Gateway Software Solutions', period: 'Sep — Oct 2024 (6 days)' },
  { title: 'Codeless Data Science', org: 'Industry Expert, Coimbatore', period: 'Oct 2024' },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email').max(255),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});
type ContactForm = z.infer<typeof contactSchema>;

/* ─── Variants ─── */

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Badge Card ─── */

const BadgeCard = ({ badge, index }: { badge: BadgeData; index: number }) => {
  const reducedMotion = useReducedMotion();
  return (
    <AnimatedSection delay={index * 0.06}>
      <motion.div
        whileHover={reducedMotion ? {} : { y: -6, scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className={`flex flex-col items-center justify-center rounded-xl border px-4 py-6 text-center bg-card/80 backdrop-blur-sm transition-shadow duration-300 ${
          badge.special
            ? 'border-accent/50 hover:shadow-[0_0_20px_hsl(var(--accent)/0.3)]'
            : 'border-border hover:border-primary/30 hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]'
        }`}
        style={{ minHeight: 140, maxWidth: 160, width: '100%', margin: '0 auto' }}
      >
        <span className="text-[32px] mb-3">{badge.emoji}</span>
        <span className={`text-[13px] font-heading font-semibold leading-tight mb-1.5 ${badge.special ? 'text-accent' : 'text-foreground'}`}>
          {badge.name}
        </span>
        <span className="text-[11px] text-muted-foreground">{badge.platform}</span>
      </motion.div>
    </AnimatedSection>
  );
};

/* ─── ProfilePhoto ─── */

const ProfilePhoto = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 cursor-pointer"
    >
      {/* Aurora blob */}
      <div
        className="aurora-blob absolute inset-0 scale-125"
        style={{ background: 'radial-gradient(ellipse, hsl(262 83% 65% / 0.30) 0%, transparent 70%)' }}
      />
      {/* Spinning ring */}
      <div className="photo-ring absolute inset-0" />
      {/* Inner dark circle + photo */}
      <div className="absolute inset-[3px] rounded-full overflow-hidden bg-card flex items-center justify-center">
        <img
          src="/here-photo.jpeg"
          alt="Kokila M"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback: replace with avatar placeholder
            const t = e.currentTarget;
            t.style.display = 'none';
            const p = t.parentElement;
            if (p && !p.querySelector('.avatar-fallback')) {
              const el = document.createElement('div');
              el.className = 'avatar-fallback w-full h-full flex items-center justify-center';
              el.style.cssText = 'background: linear-gradient(135deg, hsl(262 83% 20%), hsl(240 18% 15%)); font-size: 6rem; color: hsl(262 83% 65%);';
              el.textContent = '🧑‍💻';
              p.appendChild(el);
            }
          }}
        />
      </div>
      {/* Orbiting emerald dot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'orbit 8s linear infinite' }}>
        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(158 64% 52%)', boxShadow: '0 0 10px hsl(158 64% 52%)' }} />
      </div>
      {/* Second orbit — violet dot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'orbit-reverse 12s linear infinite' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: 'hsl(262 83% 75%)', boxShadow: '0 0 8px hsl(262 83% 65%)' }} />
      </div>
      {/* Floating skill chip */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 -right-2 md:-right-6 px-3 py-1.5 rounded-full text-xs font-mono font-semibold backdrop-blur-md border"
        style={{
          background: 'hsl(262 83% 65% / 0.15)',
          borderColor: 'hsl(262 83% 65% / 0.4)',
          color: 'hsl(262 83% 75%)',
          boxShadow: '0 0 16px hsl(262 83% 65% / 0.2)',
        }}
      >
        ✦ AI &amp; ML Engineer
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-4 -left-2 md:-left-6 px-3 py-1.5 rounded-full text-xs font-mono font-semibold backdrop-blur-md border"
        style={{
          background: 'hsl(158 64% 52% / 0.15)',
          borderColor: 'hsl(158 64% 52% / 0.4)',
          color: 'hsl(158 64% 60%)',
          boxShadow: '0 0 16px hsl(158 64% 52% / 0.2)',
        }}
      >
        ⬡ Data Analyst
      </motion.div>
    </motion.div>
  );
};

/* ─── Page ─── */

const Index = () => {
  const reducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/mvzbknzl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Message sent! I'll get back to you soon.");
        form.reset();
      } else {
        toast.error(result?.errors?.[0]?.message || 'Something went wrong.');
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/KOKILA_CV.pdf';
    link.download = 'Kokila_M_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <PageTransition>
      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh" aria-hidden="true" />
        {/* Extra subtle aurora in top-right */}
        <div
          className="aurora-blob absolute -top-20 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, hsl(262 83% 65% / 0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="container relative z-10 px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 max-w-6xl mx-auto">
            {/* ── Text side ── */}
            <motion.div
              variants={reducedMotion ? {} : containerVariants}
              initial="hidden"
              animate="visible"
              className="flex-1 text-center lg:text-left"
            >
              <motion.p variants={itemVariants} className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
                Hello, I'm
              </motion.p>
              <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold tracking-tight mb-4">
                <span className="text-shine">Kokila M</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-2 max-w-lg mx-auto lg:mx-0">
                Aspiring <span className="text-primary font-semibold">AI &amp; ML Engineer</span> &amp; Data Analyst
              </motion.p>
              <motion.p variants={itemVariants} className="text-sm text-muted-foreground/70 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Building intelligent systems with Python, NLP &amp; LLMs — turning data into decisions.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="glow" size="lg" asChild>
                  <a href="#contact">Hire Me</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="#projects">View Projects</a>
                </Button>
              </motion.div>
              {/* Mini stats row */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:flex gap-6 md:gap-8 mt-8 justify-center lg:justify-start">
                {[
                  { target: 8, label: 'Projects' },
                  { target: 3, label: 'Internships' },
                  { target: 8, label: 'Certifications' },
                  { target: 4, label: 'Workshops' }
                ].map((s) => (
                  <div key={s.label} className="text-center lg:text-left min-w-[80px]">
                    <div className="text-2xl md:text-3xl font-heading font-bold text-gradient-primary">
                      <CountUp target={s.target} start={true} />+
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            {/* ── Photo side ── */}
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, x: 40 }}
              animate={reducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex-none flex items-center justify-center"
            >
              <ProfilePhoto />
            </motion.div>
          </div>
        </div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </section>


      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">The Story</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-16">Data science meets creative problem-solving.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {storyItems.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-[0_0_15px_hsl(var(--primary)/0.15)] hover:-translate-y-1.5 transition-all duration-300">
                  <item.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-heading font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SKILLS ═══ */}
      <section id="skills" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Skills</h2>
            <p className="text-muted-foreground max-w-lg mb-12">Technologies and tools I use to bring ideas to life.</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {skills.map((skill, i) => (
              <SkillRingCard key={skill.name} name={skill.name} level={skill.level} category={skill.category} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS ═══ */}
      <section id="projects" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Projects</h2>
            <p className="text-muted-foreground max-w-lg mb-12">A selection of work that reflects my approach: problem → solution → impact.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CODING PROFILES ═══ */}
      <section id="profiles" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Profiles</h2>
            <p className="text-muted-foreground mb-12">Where I build, connect, and grow as an engineer.</p>
          </AnimatedSection>
          <div className="space-y-6">
            {profiles.map((profile, i) => (
              <AnimatedSection key={profile.name} delay={i * 0.12}>
                <motion.a href={profile.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-5 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors duration-300 block"
                  whileHover={reducedMotion ? {} : { scale: 1.01 }} transition={{ duration: 0.2 }}
                >
                  <div className="p-3 rounded-lg bg-secondary text-primary"><profile.icon className="h-6 w-6" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">{profile.name}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-primary text-sm mb-1">{profile.username}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{profile.description}</p>
                    {profile.stats && <p className="text-[11px] text-muted-foreground/70 mt-2 font-mono">{profile.stats}</p>}
                  </div>
                </motion.a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BADGES ═══ */}
      <section id="badges" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-6">🏅 Badges & Achievements</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, i) => <BadgeCard key={badge.name} badge={badge} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ RESUME / CERTIFICATES ═══ */}
      <section id="resume" className="py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">Resume</h2>
                <p className="text-muted-foreground">My professional journey at a glance.</p>
              </div>
              <motion.div whileHover={reducedMotion ? {} : { scale: 1.05 }} whileTap={reducedMotion ? {} : { scale: 0.97 }}>
                <Button variant="glow" size="lg" onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />Download PDF
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Internships */}
          <AnimatedSection delay={0.1}>
            <div className="flex items-center gap-3 mb-6"><Briefcase className="h-5 w-5 text-primary" /><h3 className="text-2xl font-heading font-semibold">Internships</h3></div>
          </AnimatedSection>
          <div className="space-y-6 mb-12">
            {internships.map((item, i) => (
              <AnimatedSection key={item.role} delay={0.15 + i * 0.1}>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h4 className="font-heading font-semibold">{item.role}</h4>
                    <span className="text-xs text-muted-foreground font-mono">{item.period}</span>
                  </div>
                  <p className="text-primary text-sm mb-2">{item.company}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Education */}
          <AnimatedSection delay={0.3}>
            <div className="flex items-center gap-3 mb-6"><GraduationCap className="h-5 w-5 text-primary" /><h3 className="text-2xl font-heading font-semibold">Education</h3></div>
          </AnimatedSection>
          <div className="space-y-6 mb-12">
            {education.map((item, i) => (
              <AnimatedSection key={item.degree} delay={0.35 + i * 0.1}>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="font-heading font-semibold">{item.degree}</h4>
                    <span className="text-xs text-muted-foreground font-mono">{item.period}</span>
                  </div>
                  <p className="text-primary text-sm mt-1">{item.school}</p>
                  <p className="text-muted-foreground text-sm mt-1 font-mono">{item.detail}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Certifications */}
          <AnimatedSection delay={0.45}>
            <div className="flex items-center gap-3 mb-6"><Award className="h-5 w-5 text-primary" /><h3 className="text-2xl font-heading font-semibold">Certifications</h3></div>
          </AnimatedSection>
          <AnimatedSection delay={0.5}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center mb-12">
              {certifications.map((cert) => <FlipCertCard key={cert.name} cert={cert} />)}
            </div>
          </AnimatedSection>

          {/* Workshops */}
          <AnimatedSection delay={0.55}>
            <div className="flex items-center gap-3 mb-6"><BookOpen className="h-5 w-5 text-primary" /><h3 className="text-2xl font-heading font-semibold">Workshops</h3></div>
          </AnimatedSection>
          <div className="space-y-6">
            {workshops.map((item, i) => (
              <AnimatedSection key={item.title} delay={0.6 + i * 0.1}>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="font-heading font-semibold">{item.title}</h4>
                    <span className="text-xs text-muted-foreground font-mono">{item.period}</span>
                  </div>
                  <p className="text-primary text-sm mt-1">{item.org}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-24 md:py-32 scroll-mt-20">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-lg mb-12">Have a project idea or want to collaborate? Let's talk.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl">
            <AnimatedSection delay={0.1}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" type="email" className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Tell me about your project..." className="bg-card border-border min-h-[120px] resize-none" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" variant="glow" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="h-4 w-4" />Send Message</span>
                    )}
                  </Button>
                </form>
              </Form>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="space-y-6 lg:pt-8">
                <div className="flex items-start gap-4"><Mail className="h-5 w-5 text-primary mt-0.5" /><div><h3 className="font-heading font-semibold mb-1">Email</h3><p className="text-muted-foreground text-sm">kokilakoki3376@gmail.com</p></div></div>
                <div className="flex items-start gap-4"><Phone className="h-5 w-5 text-primary mt-0.5" /><div><h3 className="font-heading font-semibold mb-1">Phone</h3><p className="text-muted-foreground text-sm">+91 7812810523</p></div></div>
                <div className="flex items-start gap-4"><MapPin className="h-5 w-5 text-primary mt-0.5" /><div><h3 className="font-heading font-semibold mb-1">Location</h3><p className="text-muted-foreground text-sm">Coimbatore, Tamil Nadu, India</p></div></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Index;

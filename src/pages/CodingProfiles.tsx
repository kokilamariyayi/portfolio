import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedSection } from '@/components/AnimatedSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const HackerRankIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 11.885 0 13-.642 1.114-9.107 6-10.392 6-1.285 0-9.75-4.886-10.392-6C.963 17.885.963 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v4.363H9.963V6.799h.001a.26.26 0 0 0-.26-.258H8.963a.26.26 0 0 0-.26.258v10.403c0 .141.116.258.26.258h.741a.26.26 0 0 0 .26-.258v-4.507h4.073v4.507c0 .141.116.258.258.258h.742a.26.26 0 0 0 .258-.258V6.799a.26.26 0 0 0-.258-.258h-.742z" />
  </svg>
);

const GeeksForGeeksIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-1.106-.705 3.917 3.917 0 0 1-.566-.77h-.004a3.917 3.917 0 0 1-.566.77 3.79 3.79 0 0 1-1.106.705 4.51 4.51 0 0 1-3.116.016 3.691 3.691 0 0 1-1.104-.695 3.39 3.39 0 0 1-.565-.745A3.54 3.54 0 0 1 8.434 13H2v-1.801h1.797c-.016-.295.04-.59.164-.858.124-.269.31-.505.543-.69a3.56 3.56 0 0 1 1.066-.64 4.316 4.316 0 0 1 3.006.007 3.716 3.716 0 0 1 1.067.667c.232.195.417.44.541.715h.008c.124-.275.31-.52.541-.715a3.716 3.716 0 0 1 1.067-.667 4.316 4.316 0 0 1 3.006-.007c.39.148.748.367 1.066.64.233.185.419.421.543.69.124.268.18.563.164.858H22V13a3.54 3.54 0 0 1-.55 1.315zM12 14.545a2.666 2.666 0 0 0 1.914.793 2.666 2.666 0 0 0 1.914-.793 2.795 2.795 0 0 0 .793-1.963 2.768 2.768 0 0 0-.793-1.949 2.678 2.678 0 0 0-1.914-.786 2.678 2.678 0 0 0-1.914.786 2.768 2.768 0 0 0-.793 1.95 2.795 2.795 0 0 0 .793 1.962zm-5.87 0a2.666 2.666 0 0 0 1.915.793 2.666 2.666 0 0 0 1.913-.793 2.795 2.795 0 0 0 .794-1.963 2.768 2.768 0 0 0-.794-1.949 2.678 2.678 0 0 0-1.913-.786 2.678 2.678 0 0 0-1.914.786 2.768 2.768 0 0 0-.793 1.95 2.795 2.795 0 0 0 .793 1.962z" />
  </svg>
);

const profiles = [
  {
    name: 'GitHub',
    username: '@kokilamariyayi',
    description:
      'Open source contributions, AI/ML projects, and experiments.',
    url: 'https://github.com/kokilamariyayi',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    username: 'kokila-m-ai-ds',
    description:
      'Professional network, career updates, and industry connections.',
    url: 'https://www.linkedin.com/in/kokila-m-ai-ds',
    icon: Linkedin,
  },
  {
    name: 'LeetCode',
    username: 'KokilaMariyayi',
    description:
      'Solving DSA problems and sharpening problem-solving skills.',
    url: 'https://leetcode.com/u/KokilaMariyayi/',
    icon: LeetCodeIcon,
  },
  {
    name: 'HackerRank',
    username: 'kokilakoki3376',   // ✅ Replace with your username
    description:
      'Competitive programming, skill certifications, and coding challenges.',
    url: 'https://www.hackerrank.com/profile/kokilakoki3376',   // ✅ Replace with your profile URL
    icon: HackerRankIcon,
  },
  {
    name: 'GeeksForGeeks',
    username: 'KOKILA M',   // ✅ Replace with your username
    description:
      'DSA practice, articles, and computer science fundamentals.',
    url: 'https://www.geeksforgeeks.org/profile/kokilakokmnu',   // ✅ Replace with your profile URL
    icon: GeeksForGeeksIcon,
  },
];

const CodingProfiles = () => {
  const reducedMotion = useReducedMotion();

  return (
    <PageTransition>
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Profiles
            </h1>
            <p className="text-muted-foreground mb-12">
              Where I build, connect, and grow as an engineer.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {profiles.map((profile, i) => (
              <AnimatedSection key={profile.name} delay={i * 0.12}>
                <motion.a
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-5 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors duration-300 block"
                  whileHover={reducedMotion ? {} : { scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3 rounded-lg bg-secondary text-primary">
                    <profile.icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">
                        {profile.name}
                      </h2>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-primary text-sm mb-1">
                      {profile.username}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {profile.description}
                    </p>
                  </div>
                </motion.a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default CodingProfiles;
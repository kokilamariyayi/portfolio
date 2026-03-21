import './FlipCertCard.css';

interface CertData {
  name: string;
  issuer: string;
  year: string;
  emoji: string;
  image?: string;
}

export const FlipCertCard = ({ cert }: { cert: CertData }) => (
  <div className={`flip-card ${cert.image ? 'has-flip' : ''}`} style={{ width: 220, height: 160 }}>
    <div className="flip-card-inner rounded-xl">
      {/* Front */}
      <div className="flip-card-face flip-card-front rounded-xl border border-border bg-card flex flex-col items-center justify-center p-4 text-center">
        <span className="text-2xl mb-2">{cert.emoji}</span>
        <h3 className="text-sm font-heading font-semibold leading-tight mb-1">{cert.name}</h3>
        <p className="text-[11px] text-primary">{cert.issuer}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{cert.year}</p>
      </div>
      {/* Back */}
      {cert.image && (
        <div className="flip-card-face flip-card-back rounded-xl border border-border bg-card overflow-hidden flex items-center justify-center">
          <img
            src={cert.image}
            alt={cert.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  </div>
);

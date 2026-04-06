import { cn } from '@/lib/utils';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  return (
    <section
      className={cn(
        'bg-gradient-to-br px-6 py-8 flex flex-col justify-between w-full xl:max-w-[340px] min-h-[280px] rounded-[20px] cursor-pointer group relative overflow-hidden',
        className
      )}
      onClick={handleClick}
      style={{
        border: '1px solid rgba(0,180,255,0.1)',
        boxShadow: '0 0 40px rgba(0,60,140,0.15), inset 0 1px 0 rgba(0,200,255,0.06)',
      }}
    >
      {/* Top edge glow */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.35), transparent)' }}
      />

      {/* Hover ocean shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(0,120,220,0.12) 0%, transparent 60%, rgba(0,80,180,0.08) 100%)' }}
      />

      {/* Ambient glow orb — top right */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'rgba(0,160,255,0.15)' }}
      />

      {/* Icon */}
      <div className="relative z-10">
        <div
          className="size-14 rounded-[16px] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300"
          style={{
            background: 'rgba(0,30,70,0.8)',
            border: '1px solid rgba(0,180,255,0.2)',
            boxShadow: '0 0 16px rgba(0,100,200,0.2), inset 0 1px 0 rgba(0,200,255,0.1)',
          }}
        >
          <img src={img} alt="meeting" width={28} height={28} className="brightness-0 invert opacity-90" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 relative z-10">
        <h1
          className="text-2xl font-bold transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #bae6fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>
        <p style={{ color: 'rgba(120,190,255,0.7)' }}
          className="text-lg font-medium group-hover:text-[rgba(160,210,255,0.9)] transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Bottom edge glow on hover */}
      <div
        className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,140,255,0.3), transparent)' }}
      />
    </section>
  );
};

export default HomeCard;
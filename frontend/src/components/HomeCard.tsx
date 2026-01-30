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
        'glassmorphism-card px-6 py-8 flex flex-col justify-between w-full xl:max-w-[280px] min-h-[280px] rounded-[20px] cursor-pointer group relative overflow-hidden',
        className
      )}
      onClick={handleClick}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon Container */}
      <div className="relative z-10">
        <div className="glassmorphism-button size-14 rounded-[16px] flex-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <img src={img} alt="meeting" width={28} height={28} className="brightness-0 invert" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-3 relative z-10">
        <h1 className="text-2xl font-bold text-white group-hover:text-white/95 transition-colors duration-200">
          {title}
        </h1>
        <p className="text-lg font-medium text-white/70 group-hover:text-white/80 transition-colors duration-200">
          {description}
        </p>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-white/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </section>
  );
};

export default HomeCard;


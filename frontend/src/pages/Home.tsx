import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  return (
    <section className="flex size-full flex-col gap-8 text-white">
      {/* Hero Card */}
      <div className="h-[320px] w-full rounded-[24px] glassmorphism-card relative overflow-hidden group">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/40 to-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 animate-pulse"></div>
        </div>

        <div className="flex h-full flex-col justify-between max-md:px-6 max-md:py-10 lg:p-12 relative z-10">
          {/* Upcoming Meeting Badge */}
          <div className="glassmorphism-button max-w-[280px] rounded-xl py-3 px-6 text-center text-sm font-medium text-white/90 backdrop-blur-xl border-white/10">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Upcoming Meeting at: 12:30 PM
            </div>
          </div>
          
          {/* Time Display */}
          <div className="flex flex-col gap-3">
            <h1 className="text-5xl font-extrabold lg:text-8xl text-white tracking-tight drop-shadow-2xl transition-transform duration-300 group-hover:scale-105">
              {time}
            </h1>
            <p className="text-lg font-medium text-white/80 lg:text-xl tracking-wide">
              {date}
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 left-8 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <MeetingTypeList />
    </section>
  );
};

export default Home;


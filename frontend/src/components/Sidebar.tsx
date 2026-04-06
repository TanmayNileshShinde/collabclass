import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ChevronLeft } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
const { signOut } = useClerk();

const handleLogout = async () => {
  await signOut();
};
  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-24 z-50 lg:hidden p-3 rounded-full text-[rgba(180,225,255,0.9)] transition-all duration-200"
        style={{
          background: 'rgba(0,20,50,0.85)',
          border: '1px solid rgba(0,180,255,0.2)',
          boxShadow: '0 0 16px rgba(0,100,200,0.2)',
        }}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      <section
        className={cn(
          "sticky left-0 top-0 flex h-screen flex-shrink-0 flex-col justify-between p-6 pt-28 transition-all duration-300 ease-in-out max-sm:hidden lg:flex",
          isCollapsed ? "w-20" : "w-64",
          isCollapsed && "max-sm:w-20"
        )}
        style={{
          background: 'linear-gradient(180deg, #020f1f 0%, #041a30 60%, #020d1a 100%)',
          borderRight: '1px solid rgba(0,180,255,0.08)',
          boxShadow: '4px 0 24px rgba(0,40,100,0.2), inset -1px 0 0 rgba(0,180,255,0.05)',
        }}
      >
        {/* Top edge glow */}
        <div
          className="absolute inset-y-0 right-0 w-px pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(0,150,255,0.15), transparent)' }}
        />

        <div className="flex flex-1 flex-col gap-2">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);

            return (
              <Link
                to={item.route}
                key={item.label}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex gap-3 items-center p-3 rounded-xl justify-start transition-all duration-200 relative overflow-hidden group',
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(0,80,160,0.7) 0%, rgba(0,120,200,0.5) 100%)',
                  border: '1px solid rgba(0,180,255,0.25)',
                  boxShadow: '0 0 20px rgba(0,100,200,0.2), inset 0 1px 0 rgba(0,200,255,0.1)',
                } : {
                  background: 'transparent',
                  border: '1px solid transparent',
                }}
              >
                {/* Hover fill */}
                {!isActive && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none"
                    style={{
                      background: 'rgba(0,40,90,0.6)',
                      border: '1px solid rgba(0,150,255,0.12)',
                    }}
                  />
                )}

                {/* Active left accent line */}
                {isActive && (
                  <div
                    className="absolute left-0 inset-y-2 w-0.5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, rgba(0,200,255,0.8), rgba(0,120,220,0.4))' }}
                  />
                )}

                <img
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={cn(
                    "transition-all duration-200 relative z-10 flex-shrink-0",
                    isActive ? 'brightness-0 invert' : 'opacity-50 group-hover:opacity-75'
                  )}
                />
                {!isCollapsed && (
                  <p
                    className="text-base font-semibold transition-all duration-200 relative z-10"
                    style={{ color: isActive ? 'rgba(220,245,255,0.95)' : 'rgba(120,180,220,0.75)' }}
                  >
                    {item.label}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

<div className="flex flex-col gap-3">
  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
    style={{
      background: 'rgba(220,38,38,0.15)',
      border: '1px solid rgba(220,38,38,0.35)',
      color: 'rgba(255,120,120,0.95)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.25)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.15)';
    }}
  >
    {!isCollapsed && "Logout"}
  </button>

  {/* Collapse Button */}
  <button
    onClick={() => setIsCollapsed(!isCollapsed)}
    className="hidden lg:flex p-2 rounded-lg transition-all duration-200 items-center justify-center"
    style={{
      background: 'rgba(0,20,50,0.6)',
      border: '1px solid rgba(0,150,255,0.12)',
      color: 'rgba(100,170,220,0.6)',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(180,225,255,0.9)';
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,180,255,0.25)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(100,170,220,0.6)';
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,150,255,0.12)';
    }}
  >
    <ChevronLeft
      size={16}
      className={cn('transition-transform duration-300', isCollapsed ? 'rotate-180' : '')}
    />
  </button>
</div>
      </section>
    </>
  );
};

export default Sidebar;
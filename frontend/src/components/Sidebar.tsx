import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-4 top-24 z-50 lg:hidden glassmorphism-button p-3 rounded-full text-white"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Sidebar */}
      <section className={cn(
        "sticky left-0 top-0 flex h-screen flex-col justify-between glassmorphism-dark border-r border-white/10 p-6 pt-28 text-white transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64",
        "max-sm:hidden lg:flex",
        isCollapsed && "max-sm:w-20"
      )}>
        <div className="flex flex-1 flex-col gap-4">
          {sidebarLinks.map((item) => {
            const isActive = location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);
            
            return (
              <Link
                to={item.route}
                key={item.label}
                className={cn(
                  'flex gap-3 items-center p-3 rounded-xl justify-start transition-all duration-200 glassmorphism-button hover:glassmorphism-button-hover',
                  {
                    'glassmorphism-button-active border-white/20': isActive,
                    'text-white/80 hover:text-white': !isActive,
                  }
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <img
                  src={item.imgURL}
                  alt={item.label}
                  width={20}
                  height={20}
                  className={cn(
                    "transition-all duration-200",
                    isActive ? 'brightness-0 invert' : 'opacity-70'
                  )}
                />
                {!isCollapsed && (
                  <p className="text-base font-semibold transition-all duration-200">
                    {item.label}
                  </p>
                )}
              </Link>
            );
          })}
        </div>

        {/* Collapse Toggle for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex glassmorphism-button p-2 rounded-lg text-white/60 hover:text-white transition-all duration-200"
        >
          <div className="flex items-center justify-center w-full">
            <div className={cn(
              "transition-transform duration-200",
              isCollapsed ? "rotate-180" : ""
            )}>
              <X size={16} />
            </div>
          </div>
        </button>
      </section>
    </>
  );
};

export default Sidebar;


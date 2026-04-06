import { Link, useLocation } from 'react-router-dom';

import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const MobileNav = () => {
  const location = useLocation();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <img
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="hamburger icon"
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-r border-light-4 dark:border-dark-4 bg-light-1 dark:bg-dark-1 transition-colors">
          <Link to="/" className="flex items-center gap-1">
            <img
              src="/icons/logo.svg"
              width={32}
              height={32}
              alt="collabclass logo"
            />
            <p className="text-[26px] font-extrabold text-dark-2 dark:text-white transition-colors">CollabClass</p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className=" flex h-full flex-col gap-6 pt-16 text-dark-2 dark:text-white transition-colors">
                {sidebarLinks.map((item) => {
                  const isActive = location.pathname === item.route;

                  return (
                    <SheetClose asChild key={item.route}>
                      <Link
                        to={item.route}
                        key={item.label}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-lg w-full max-w-60 transition-all hover:bg-light-3 dark:hover:bg-dark-3',
                          {
                            'bg-royal-1 text-white hover:bg-royal-2': isActive,
                          }
                        )}
                      >
                        <img
                          src={item.imgURL}
                          alt={item.label}
                          width={20}
                          height={20}
                          className={isActive ? 'brightness-0 invert' : 'opacity-70 dark:opacity-80'}
                        />
                        <p className="font-semibold">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;


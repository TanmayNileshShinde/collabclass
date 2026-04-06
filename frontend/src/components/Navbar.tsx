import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Speech } from "lucide-react";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        .nav-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 2;
          background: linear-gradient(135deg, #ffffff 0%, #a8d8ff 40%, #3aabff 75%, #0077dd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: letter-spacing 0.35s ease;
        }

        .nav-logo-group:hover .nav-logo-text {
          letter-spacing: -0.01em;
        }

        .nav-logo-sub {
          font-family: 'Syne', sans-serif;
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(80, 175, 255, 0.5);
          line-height: 1;
          margin-top: 2px;
          transition: color 0.3s ease;
        }

        .nav-logo-group:hover .nav-logo-sub {
          color: rgba(80, 200, 255, 0.75);
        }

        .nav-underline {
          height: 1.5px;
          width: 0;
          border-radius: 2px;
          margin-top: 3px;
          background: linear-gradient(90deg, rgba(0,180,255,0.9), rgba(0,100,220,0.4));
          transition: width 0.45s cubic-bezier(0.4,0,0.2,1);
        }

        .nav-logo-group:hover .nav-underline {
          width: 100%;
        }

        /* Split color on "Collab" vs "Class" */
        .logo-part-1 {
          background: linear-gradient(135deg, #ffffff 0%, #b8deff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-part-2 {
          background: linear-gradient(135deg, #60baff 0%, #0088ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <nav
        className="flex-between fixed z-50 w-full px-6 py-4 lg:px-10 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(90deg, rgba(2,11,24,0.95) 0%, rgba(4,22,44,0.95) 50%, rgba(2,13,26,0.95) 100%)',
          borderBottom: '1px solid rgba(0,180,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,40,100,0.2), inset 0 -1px 0 rgba(0,180,255,0.05)',
        }}
      >
        {/* Bottom edge glow */}
        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,160,255,0.2), transparent)' }}
        />

        <Link to="/" className="flex items-center gap-3 nav-logo-group">
          {/* Icon */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-0 transition-all duration-500 scale-150 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,150,255,0.25), transparent)' }}
            />
            <div className="relative" style={{ filter: 'drop-shadow(0 0 6px rgba(0,180,255,0.4))' }}>
              <Speech color="rgba(180,225,255,0.9)" />
            </div>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col justify-center max-sm:hidden">
            <div className="nav-logo-text">
              <span className="logo-part-1">Collab</span><span className="logo-part-2">Class</span>
            </div>
            <p className="nav-logo-sub">Live · Learn · Connect</p>
            <div className="nav-underline" />
          </div>
        </Link>

        <div className="flex-between gap-5">
          <SignedIn>
            <div
              className="p-1.5 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(0,20,50,0.7)',
                border: '1px solid rgba(0,180,255,0.15)',
                boxShadow: '0 0 12px rgba(0,80,180,0.15)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,200,255,0.35)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(0,120,220,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,180,255,0.15)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 12px rgba(0,80,180,0.15)';
              }}
            >
              <UserButton
                afterSignOutUrl="/landing"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-[rgba(0,180,255,0.25)] ring-offset-2 ring-offset-transparent transition-all duration-300"
                  }
                }}
              />
            </div>
          </SignedIn>

          <MobileNav />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
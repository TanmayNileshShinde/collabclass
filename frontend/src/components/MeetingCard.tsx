
import { avatarImages } from "@/constants";
import { useToast } from "./ui/use-toast";
import { Users, Copy, Play, Trash2 } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  isPreviousMeeting?: boolean;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
  link: string;
  onDelete?: () => void;
  showDeleteButton?: boolean;
  showAttendees?: boolean;
  meetingId?: string;
  onViewAttendance?: (meetingId: string, meetingTitle: string) => void;
}

const MeetingCard = ({
  icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1,
  handleClick,
  link,
  buttonText,
  onDelete,
  showDeleteButton,
  showAttendees = true,
  meetingId,
  onViewAttendance,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .meeting-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          display: flex;
          min-height: 280px;
          width: 100%;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 20px;
          padding: 28px;
          background: linear-gradient(145deg, #050d1a 0%, #071525 60%, #040e1c 100%);
          border: 1px solid rgba(0, 160, 255, 0.12);
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,180,255,0.04), 0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,140,255,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .meeting-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.6), rgba(0,220,255,0.8), rgba(0, 180, 255, 0.6), transparent);
        }

        .meeting-card::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 140, 255, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .meeting-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 0 1px rgba(0,200,255,0.15), 0 16px 56px rgba(0,0,0,0.7), 0 0 32px rgba(0,160,255,0.1);
          border-color: rgba(0, 180, 255, 0.25);
        }

        .card-glow-orb {
          position: absolute;
          bottom: -60px; left: -40px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 100, 200, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .card-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(0, 140, 255, 0.15), rgba(0, 80, 180, 0.08));
          border: 1px solid rgba(0, 160, 255, 0.2);
          box-shadow: 0 0 16px rgba(0, 140, 255, 0.1);
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #e8f4ff;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0;
          text-shadow: 0 0 20px rgba(0, 160, 255, 0.15);
        }

        .card-date {
          font-size: 0.82rem;
          font-weight: 400;
          color: rgba(100, 180, 255, 0.65);
          letter-spacing: 0.03em;
          margin: 0;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 140, 255, 0.12), transparent);
          margin: 4px 0;
        }

        .attendees-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .avatar-stack {
          display: flex;
          position: relative;
        }

        .avatar-img {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(0, 140, 255, 0.4);
          box-shadow: 0 0 8px rgba(0, 120, 255, 0.2);
          transition: transform 0.2s ease;
        }

        .avatar-img:hover { transform: translateY(-2px) scale(1.1); }

        .avatar-overflow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0a3060, #051a3a);
          border: 2px solid rgba(0, 140, 255, 0.4);
          font-size: 0.65rem;
          font-weight: 600;
          color: rgba(120, 200, 255, 0.9);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          background: linear-gradient(135deg, #0070e0, #0050b0);
          color: #e8f4ff;
          box-shadow: 0 4px 14px rgba(0, 100, 220, 0.35), inset 0 1px 0 rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 120, 255, 0.5), inset 0 1px 0 rgba(255,255,255,0.15);
          background: linear-gradient(135deg, #0080f0, #0060c0);
        }

        .btn-primary:hover::before { opacity: 1; }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(0, 140, 255, 0.18);
          transition: all 0.25s ease;
          background: rgba(0, 60, 120, 0.12);
          color: rgba(120, 190, 255, 0.85);
          backdrop-filter: blur(4px);
        }

        .btn-ghost:hover {
          background: rgba(0, 100, 200, 0.2);
          border-color: rgba(0, 160, 255, 0.4);
          color: #a8d8ff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 100, 200, 0.2);
        }

        .btn-attendance {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(0, 200, 150, 0.25);
          transition: all 0.25s ease;
          background: linear-gradient(135deg, rgba(0, 160, 120, 0.2), rgba(0, 100, 80, 0.1));
          color: rgba(80, 220, 180, 0.9);
        }

        .btn-attendance:hover {
          background: linear-gradient(135deg, rgba(0, 180, 130, 0.3), rgba(0, 120, 90, 0.2));
          border-color: rgba(0, 220, 160, 0.4);
          color: #60ffcc;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0, 180, 130, 0.25);
        }

        .btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255, 60, 60, 0.2);
          transition: all 0.25s ease;
          background: linear-gradient(135deg, rgba(180, 30, 30, 0.2), rgba(120, 20, 20, 0.1));
          color: rgba(255, 120, 120, 0.9);
        }

        .btn-danger:hover {
          background: linear-gradient(135deg, rgba(200, 40, 40, 0.3), rgba(150, 20, 20, 0.2));
          border-color: rgba(255, 80, 80, 0.4);
          color: #ff9090;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(200, 40, 40, 0.25);
        }

        .actions-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .badge-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: rgba(0, 200, 120, 0.1);
          border: 1px solid rgba(0, 200, 120, 0.25);
          color: rgba(0, 220, 140, 0.9);
        }

        .badge-live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #00dc8c;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>

      <section className="meeting-card">
        <div className="card-glow-orb" />

        {/* Top: Icon + Title */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="card-icon-wrapper">
              <img src={icon} alt="meeting type" width={22} height={22} />
            </div>
            {!isPreviousMeeting && (
              <span className="badge-live">
                <span className="badge-live-dot" />
                Upcoming
              </span>
            )}
          </div>

          <div>
            <h1 className="card-title">{title}</h1>
            <p className="card-date" style={{ marginTop: '5px' }}>{date}</p>
          </div>
        </article>

        <div className="divider" />

        {/* Bottom: Avatars + Actions */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {showAttendees && (
            <div className="attendees-row max-sm:hidden">
              <div className="avatar-stack">
                {avatarImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="attendee"
                    className="avatar-img"
                    style={{
                      position: index === 0 ? 'relative' : 'absolute',
                      left: index === 0 ? 0 : `${index * 22}px`,
                      top: 0,
                      zIndex: avatarImages.length - index,
                    }}
                  />
                ))}
                <div
                  className="avatar-overflow"
                  style={{ position: 'absolute', left: `${avatarImages.length * 22}px`, top: 0 }}
                >
                  +5
                </div>
              </div>
            </div>
          )}

          <div className="actions-row">
            {/* Primary CTA — always shown */}
            <button className="btn-primary" onClick={handleClick}>
              {buttonIcon1
                ? <img src={buttonIcon1} alt="" width={15} height={15} />
                : <Play size={13} />
              }
              {buttonText || 'Start'}
            </button>

            {/* Copy Link — always shown */}
            <button
              className="btn-ghost"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({ title: "Link Copied" });
              }}
            >
              <Copy size={13} />
              Copy Link
            </button>

            {/* View Attendance — previous meetings only */}
            {isPreviousMeeting && meetingId && onViewAttendance && (
              <button
                className="btn-attendance"
                onClick={() => onViewAttendance(meetingId, title)}
              >
                <Users size={13} />
                Attendance
              </button>
            )}

            {/* Delete — recordings only */}
            {showDeleteButton && onDelete && (
              <button className="btn-danger" onClick={onDelete}>
                <Trash2 size={13} />
                Delete
              </button>
            )}
          </div>
        </article>
      </section>
    </>
  );
};

export default MeetingCard;
import { ReactNode } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  // instantMeeting,
  image,
  // buttonClassName,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[540px] flex-col gap-8 px-8 py-10 text-white border-white/10">
        <div className="flex flex-col gap-8">
          {image && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={image}
                  alt="checked"
                  width={80}
                  height={80}
                  className="drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
            </div>
          )}
          <h1
            className={cn(
              "text-4xl font-bold leading-[48px] tracking-tight",
              className 
            )}
          >
            {title}
          </h1>
          {children}
          <Button
            className="glassmorphism-button-active hover:glassmorphism-button-hover text-white font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-200"
            onClick={handleClick}
          >
            {buttonIcon && (
              <img
                src={buttonIcon}
                alt="button icon"
                width={16}
                height={16}
                className="mr-2"
              />
            )}{" "}
            {buttonText || "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;

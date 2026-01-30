import { useUser } from '@clerk/clerk-react';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';

import { useGetCallById } from '@/hooks/useGetCallById';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-royal-1 dark:text-royal-3 lg:text-xl xl:min-w-32 transition-colors">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold text-dark-2 dark:text-white max-sm:max-w-[320px] lg:text-xl transition-colors">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const meetingId = user?.id;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) return;

    const newCall = client.call("default", meetingId!);

    if (!call) {
      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    navigate(`/meeting/${meetingId}?personal=true`);
  };

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
  const meetingLink = `${baseUrl}/meeting/${meetingId}?personal=true`;

  return (
    <section className="flex size-full flex-col gap-10 text-dark-2 dark:text-white transition-colors">
      <h1 className="text-xl font-bold lg:text-3xl">Personal Meeting Room</h1>
      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table title="Topic" description={`${user?.username}'s Meeting Room`} />
        <Table title="Meeting ID" description={meetingId!} />
        <Table title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-royal-1 hover:bg-royal-2 text-white" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-light-3 dark:bg-dark-3 text-dark-2 dark:text-white hover:bg-light-4 dark:hover:bg-dark-4"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;


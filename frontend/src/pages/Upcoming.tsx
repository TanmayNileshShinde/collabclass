import CallList from '@/components/CallList';

const Upcoming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-dark-2 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold">Upcoming Meeting</h1>

      <CallList type="upcoming" />
    </section>
  );
};

export default Upcoming;


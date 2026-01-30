import CallList from '@/components/CallList';

const Recordings = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-dark-2 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold">Recordings</h1>

      <CallList type="recordings" />
    </section>
  );
};

export default Recordings;


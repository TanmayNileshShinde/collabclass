import CallList from '@/components/CallList';

const Previous = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-dark-2 dark:text-white transition-colors">
      <h1 className="text-3xl font-bold">Previous Calls</h1>

      <CallList type="ended" />
    </section>
  );
};

export default Previous;


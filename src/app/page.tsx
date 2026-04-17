import PalmReader from '@/components/palm-reader';

export default function Home() {
  return (
    <div className="flex-1 w-full bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
      <PalmReader />
    </div>
  );
}

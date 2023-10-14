import Models from '../components/models/models';

export const dynamic = 'force-dynamic';

export default function Home () {
  return (
    <main className='flex flex-col justify-between min-h-screen p-24'>
      <div className='container flex flex-col justify-start pt-10 mx-auto'>
        <h2 className='text-2xl font-bold tracking-tight'>Models 🔥</h2>
        <p className='text-muted-foreground'>
          Top 5 trending models on replicate in the last 24h :
        </p>
      </div>
      <Models />
      <div>
        <h3 className='text-2xl font-bold tracking-tight'>All Models!</h3>
        <p className='text-muted-foreground'>
          Here&apos;s a list of all models available on replicate
        </p>
      </div>
      <Models />
    </main>
  );
}

import Models from '../components/models/models';

export const dynamic = 'force-dynamic';

export default function Home () {
  return (
    <main className='flex flex-col justify-between min-h-screen p-24'>
      <div className='container flex flex-col justify-start pt-10 mx-auto'>
        <h2 className='text-2xl font-bold tracking-tight'>Models 🔥</h2>
        <p className='text-muted-foreground'>
          Models on replicate sorted by most trending in the last 24h :
        </p>
      </div>
      <Models trending={true} />
    </main>
  );
}

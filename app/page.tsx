import Image from 'next/image';
import Models from '../components/models/models';

export default function Home () {
  return (
    <main className='flex flex-col items-center justify-between min-h-screen p-24'>
      <Models />
    </main>
  );
}

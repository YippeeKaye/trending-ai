import Image from 'next/image'
import ModelsPage from './models/page'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModelsPage />
    </main>
  )
}

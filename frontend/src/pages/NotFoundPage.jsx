import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundPage({
  title = 'Halaman tidak ditemukan',
  message = 'Alamat yang Anda buka tidak ada. Periksa kembali alamatnya atau kembali ke beranda.',
}) {
  return (
    <section className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="max-w-md text-muted-foreground">{message}</p>
      <Button asChild className="mt-2">
        <Link to="/">Kembali ke beranda</Link>
      </Button>
    </section>
  )
}

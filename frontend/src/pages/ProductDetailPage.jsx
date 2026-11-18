import { Link, useParams } from 'react-router'
import LoadError from '@/components/LoadError'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useApi } from '@/hooks/useApi'
import { formatRupiah } from '@/lib/format'
import NotFoundPage from '@/pages/NotFoundPage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, error, loading, retry } = useApi(`/products/${encodeURIComponent(id)}`)

  if (loading) {
    return (
      <div role="status" aria-label="Memuat produk" className="grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }
  if (error?.status === 404) {
    return (
      <NotFoundPage
        title="Produk tidak ditemukan"
        message="Produk ini tidak ada atau sudah tidak dijual. Cari produk lain di beranda."
      />
    )
  }
  if (error) {
    return <LoadError message="Produk gagal dimuat. Periksa koneksi Anda lalu coba lagi." onRetry={retry} />
  }

  const soldOut = product.stock === 0
  return (
    <article className="grid gap-6 md:grid-cols-2 md:gap-10">
      <img src={product.imageUrl} alt={product.name} className="aspect-square w-full rounded-md border bg-muted object-cover" />
      <div className="flex flex-col gap-3">
        <Link
          to={`/?category=${product.category.slug}`}
          className="w-fit text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {product.category.name}
        </Link>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">{formatRupiah(product.price)}</p>
        <p className="flex items-center gap-2">
          Stok: {product.stock}
          {soldOut && <Badge className="bg-foreground text-background">Habis</Badge>}
        </p>
        <p className="text-sm text-muted-foreground">Dijual oleh {product.store.name}</p>
        {/* Quantity picker and the active button for stock > 0 arrive in slice 3 (cart). */}
        {soldOut && (
          <Button disabled size="lg" className="w-full sm:w-fit">
            Tambah ke keranjang
          </Button>
        )}
        <section className="mt-4 border-t pt-4">
          <h2 className="font-semibold">Deskripsi</h2>
          <p className="mt-2 text-muted-foreground">{product.description}</p>
        </section>
      </div>
    </article>
  )
}

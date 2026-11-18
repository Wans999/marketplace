import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { formatRupiah } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function ProductCard({ product }) {
  const soldOut = product.stock === 0
  return (
    <article className="relative flex h-full flex-col rounded-md border bg-card p-3 transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={cn('aspect-square w-full rounded-sm bg-muted object-cover', soldOut && 'opacity-60')}
        />
        {soldOut && <Badge className="absolute top-2 left-2 bg-foreground text-background">Habis</Badge>}
      </div>
      <h2 className="mt-3 line-clamp-2 text-sm leading-snug font-medium">
        {/* The ::after overlay stretches the link over the whole card. */}
        <Link to={`/products/${product.id}`} className="after:absolute after:inset-0">
          {product.name}
        </Link>
      </h2>
      <p className="mt-1 font-semibold">{formatRupiah(product.price)}</p>
      <p className="mt-auto pt-1 text-xs text-muted-foreground">{product.store.name}</p>
    </article>
  )
}

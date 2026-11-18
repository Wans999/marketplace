import { CarrotIcon, CookingPotIcon, CupSodaIcon, ShoppingBasketIcon, SnowflakeIcon, WheatIcon } from 'lucide-react'
import { Link, useOutletContext, useSearchParams } from 'react-router'
import LoadError from '@/components/LoadError'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useApi } from '@/hooks/useApi'

const SORT_OPTIONS = [
  ['newest', 'Terbaru'],
  ['price_asc', 'Harga terendah'],
  ['price_desc', 'Harga tertinggi'],
]

// shortcut: icons keyed by seed slugs, unknown slugs get the basket; move to the DB if admins manage categories (phase 3).
const CATEGORY_ICONS = {
  'sayur-buah': CarrotIcon,
  sembako: WheatIcon,
  minuman: CupSodaIcon,
  'frozen-food': SnowflakeIcon,
  'bumbu-dapur': CookingPotIcon,
}

// The URL is the only source of filter state (AC-02.6); its query string goes to the API unchanged.
export default function HomePage() {
  const [params, setParams] = useSearchParams()
  const { categories } = useOutletContext()
  const products = useApi(`/products?${params}`)

  // Empty values are removed so the URL holds only active filters; any filter change returns to page 1.
  // Reads the live URL, not `params`: the router renders navigations in a transition, so a second
  // change right after the first (e.g. sort right after price) would otherwise drop the first one.
  function updateParams(changes) {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    next.delete('page')
    setParams(next)
  }

  const q = params.get('q')
  const categoryName = categories.data?.items.find((c) => c.slug === params.get('category'))?.name
  const title = q ? `Hasil pencarian "${q}"` : (categoryName ?? 'Semua produk')

  // A 400 on price is shown next to the price fields, not as a load error (AC-02.4).
  const invalidQuery = products.error?.status === 400
  const priceErrors = invalidQuery
    ? products.error.details.filter((d) => d.field === 'minPrice' || d.field === 'maxPrice')
    : []
  const priceMessage = [...new Set(priceErrors.map((d) => `${d.message}.`))].join(' ')

  return (
    <div className="space-y-8">
      {!params.toString() && <Hero categories={categories} />}

      <section aria-labelledby="catalog-title" className="space-y-4">
        <h1 id="catalog-title" className="text-xl font-bold">
          {title}
        </h1>

        <div className="flex flex-wrap items-start gap-4 border-b pb-4">
          <PriceFilter
            minPrice={params.get('minPrice') ?? ''}
            maxPrice={params.get('maxPrice') ?? ''}
            errorFields={priceErrors.map((d) => d.field)}
            message={priceMessage}
            onApply={updateParams}
          />
          <div className="space-y-1.5 sm:ml-auto">
            <Label htmlFor="sort">Urutkan</Label>
            <NativeSelect
              id="sort"
              value={params.get('sort') ?? 'newest'}
              onChange={(e) => updateParams({ sort: e.target.value === 'newest' ? '' : e.target.value })}
            >
              {SORT_OPTIONS.map(([value, label]) => (
                <NativeSelectOption key={value} value={value}>
                  {label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>

        <CatalogResults products={products} invalidQuery={invalidQuery} priceErrors={priceErrors} params={params} />
      </section>
    </div>
  )
}

function Hero({ categories }) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          to="/?category=sayur-buah"
          className="flex min-h-40 flex-col justify-end gap-2 rounded-md bg-secondary p-6 md:col-span-2 md:min-h-56"
        >
          <span className="text-2xl font-bold md:text-3xl">Sayur dan buah segar setiap hari</span>
          <span className="text-muted-foreground">Dipetik pagi, langsung dari kebun mitra.</span>
          <span className="mt-2 w-fit rounded-sm bg-primary px-3 py-1.5 text-sm font-semibold">Belanja sayur & buah</span>
        </Link>
        <Link to="/?category=frozen-food" className="flex min-h-40 flex-col justify-end gap-2 rounded-md bg-muted p-6">
          <span className="text-xl font-bold">Stok frozen food untuk seminggu</span>
          <span className="text-sm text-muted-foreground">Nugget, sosis, dimsum, dan lainnya.</span>
          <span className="mt-2 w-fit rounded-sm bg-primary px-3 py-1.5 text-sm font-semibold">Belanja frozen food</span>
        </Link>
      </div>

      <nav aria-label="Kategori produk">
        {categories.loading && <Skeleton role="status" aria-label="Memuat kategori" className="h-24 w-full" />}
        {categories.error && (
          <LoadError message="Kategori gagal dimuat. Periksa koneksi Anda lalu coba lagi." onRetry={categories.retry} />
        )}
        {categories.data && (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {categories.data.items.map((c) => {
              const Icon = CATEGORY_ICONS[c.slug] ?? ShoppingBasketIcon
              return (
                <li key={c.id}>
                  <Link
                    to={`/?category=${c.slug}`}
                    className="flex h-full flex-col items-center gap-2 rounded-md p-3 text-center text-sm font-medium hover:bg-muted"
                  >
                    <Icon aria-hidden="true" className="size-8 text-primary" strokeWidth={1.5} />
                    {c.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </>
  )
}

function PriceFilter({ minPrice, maxPrice, errorFields, message, onApply }) {
  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onApply({ minPrice: form.get('minPrice').trim(), maxPrice: form.get('maxPrice').trim() })
  }

  // Text inputs, not type="number": the browser must not block or silently drop a value, the API validates it.
  const field = (name, label) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        inputMode="numeric"
        placeholder="Rp"
        defaultValue={name === 'minPrice' ? minPrice : maxPrice}
        aria-invalid={errorFields.includes(name) || undefined}
        aria-describedby={message ? 'price-error' : undefined}
        className="w-32"
      />
    </div>
  )

  return (
    <form key={`${minPrice}|${maxPrice}`} onSubmit={handleSubmit} aria-label="Filter harga" className="space-y-1.5">
      <div className="flex flex-wrap items-end gap-2">
        {field('minPrice', 'Harga minimum')}
        {field('maxPrice', 'Harga maksimum')}
        <Button type="submit" variant="outline">
          Terapkan
        </Button>
      </div>
      {message && (
        <p id="price-error" role="alert" className="max-w-md text-sm text-destructive">
          {message}
        </p>
      )}
    </form>
  )
}

function CatalogResults({ products, invalidQuery, priceErrors, params }) {
  const { data, error, loading, retry } = products

  if (loading) {
    return (
      <ul role="status" aria-label="Memuat produk" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i}>
            <Skeleton className="aspect-[3/4] w-full" />
          </li>
        ))}
      </ul>
    )
  }
  // The message is already next to the price fields.
  if (priceErrors.length) return null
  if (invalidQuery) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
        <p>Alamat halaman ini berisi filter yang tidak valid.</p>
        <Button asChild variant="outline">
          <Link to="/">Hapus semua filter</Link>
        </Button>
      </div>
    )
  }
  if (error) return <LoadError message="Produk gagal dimuat. Periksa koneksi Anda lalu coba lagi." onRetry={retry} />

  if (data.items.length === 0) {
    const pastLastPage = data.total > 0 // results exist, just not on this page (AC-01.3)
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <h2 className="text-lg font-semibold">Produk tidak ditemukan</h2>
        <p className="text-muted-foreground">
          {pastLastPage
            ? `Halaman ${data.page} tidak ada. Hasil pencarian ini hanya ${data.totalPages} halaman.`
            : 'Coba kata kunci lain atau ubah filter kategori dan harga.'}
        </p>
        {pastLastPage && (
          <Button asChild variant="outline">
            <Link to={{ search: pageSearch(params, 1) }}>Ke halaman 1</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <ul aria-label="Daftar produk" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {data.items.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <CatalogPagination page={data.page} totalPages={data.totalPages} params={params} />
    </>
  )
}

function CatalogPagination({ page, totalPages, params }) {
  return (
    <div className="flex flex-col items-center gap-2 pt-4">
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious to={{ search: pageSearch(params, page - 1) }} />
              </PaginationItem>
            )}
            {pageList(page, totalPages).map((n, i) => (
              <PaginationItem key={n ?? `gap-${i}`}>
                {n === null ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink to={{ search: pageSearch(params, n) }} isActive={n === page} aria-label={`Halaman ${n}`}>
                    {n}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext to={{ search: pageSearch(params, page + 1) }} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      <p className="text-sm text-muted-foreground">
        Halaman {page} dari {totalPages}
      </p>
    </div>
  )
}

// Same filters, different page; page 1 stays out of the URL.
function pageSearch(params, page) {
  const next = new URLSearchParams(params)
  if (page === 1) next.delete('page')
  else next.set('page', page)
  return next.toString()
}

// First, last, and current ±1; null marks a gap shown as an ellipsis.
function pageList(page, totalPages) {
  const pages = []
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) pages.push(n)
    else if (pages.at(-1) !== null) pages.push(null)
  }
  return pages
}

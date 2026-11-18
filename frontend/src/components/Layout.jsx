import { SearchIcon } from 'lucide-react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useApi } from '@/hooks/useApi'

export default function Layout() {
  const categories = useApi('/categories')
  return (
    <>
      <Header categories={categories.data?.items ?? []} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet context={{ categories }} />
      </main>
    </>
  )
}

// Account icon, cart icon and login button arrive in slices 2–3.
function Header({ categories }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''

  // Keeps the price and sort filters already in the URL; a new search always starts at page 1.
  // Reads the live URL for the same reason as updateParams in HomePage.
  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const next = new URLSearchParams(window.location.search)
    for (const key of ['q', 'category']) {
      const value = form.get(key).trim()
      if (value) next.set(key, value)
      else next.delete(key)
    }
    next.delete('page')
    navigate({ pathname: '/', search: next.toString() })
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span aria-hidden="true" className="size-6 rounded-sm bg-primary" />
          Marketplace
        </Link>
        {/* key resets the uncontrolled fields when the URL changes, e.g. after a category tile click. */}
        <form
          key={`${q}|${category}`}
          role="search"
          onSubmit={handleSubmit}
          className="flex flex-1 items-center gap-2"
        >
          <NativeSelect
            name="category"
            aria-label="Kategori"
            defaultValue={category}
            onChange={(e) => e.currentTarget.form.requestSubmit()}
            className="shrink-0"
          >
            <NativeSelectOption value="">Semua kategori</NativeSelectOption>
            {categories.map((c) => (
              <NativeSelectOption key={c.id} value={c.slug}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Input name="q" type="search" aria-label="Cari produk" placeholder="Cari produk" defaultValue={q} />
          <Button type="submit" size="icon" aria-label="Cari" className="shrink-0">
            <SearchIcon />
          </Button>
        </form>
      </div>
    </header>
  )
}

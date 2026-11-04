import { Route, Routes } from 'react-router'

// Placeholder until slice 1 builds the catalog page.
function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <p className="mt-2 text-slate-600">Katalog produk akan tersedia di sini.</p>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App

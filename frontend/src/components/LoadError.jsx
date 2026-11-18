import { Button } from '@/components/ui/button'

export default function LoadError({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p>{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Coba lagi
      </Button>
    </div>
  )
}

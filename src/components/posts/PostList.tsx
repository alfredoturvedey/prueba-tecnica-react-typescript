import { AlertCircle, FileText, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Post } from '@/types/api'
import { PostCard } from './PostCard'

type Props = {
  posts: Post[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

export function PostList({ posts, isLoading, error, onRetry }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Cargando publicaciones">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive"
      >
        <AlertCircle className="size-8 opacity-70" />
        <div className="space-y-1">
          <p className="text-sm font-medium">No se pudieron cargar las publicaciones</p>
          <p className="text-xs opacity-80">{error}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
        >
          <RefreshCw className="size-3.5" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-2 py-16 text-muted-foreground"
      >
        <FileText className="size-10 opacity-30" />
        <p className="text-sm">Este usuario no tiene publicaciones</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

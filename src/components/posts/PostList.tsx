import { AlertCircle, FileText } from 'lucide-react'
import type { Post } from '@/types/api'
import { PostCard } from './PostCard'

type Props = {
  posts: Post[]
  isLoading: boolean
  error: string | null
}

export function PostList({ posts, isLoading, error }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Cargando publicaciones">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
      >
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>{error}</span>
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

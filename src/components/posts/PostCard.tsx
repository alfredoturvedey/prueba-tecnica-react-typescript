import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Post } from '@/types/api'

type Props = {
  post: Post
}

// Posts from the API have ids 1-100; local optimistic posts use Date.now()
const isLocal = (id: number) => id > 100_000

export function PostCard({ post }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-2 text-sm leading-snug">
          <span>{post.title}</span>
          {isLocal(post.id) && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <Sparkles className="size-3" />
              Nuevo
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{post.body}</p>
      </CardContent>
    </Card>
  )
}

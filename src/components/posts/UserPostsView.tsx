import { ArrowLeft, Building2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePosts } from '@/hooks/usePosts'
import type { User } from '@/types/api'
import { CreatePostForm } from './CreatePostForm'
import { PostList } from './PostList'

type Props = {
  user: User
  onBack: () => void
}

export function UserPostsView({ user, onBack }: Props) {
  const { posts, isLoading, error, isCreating, createError, createPost, retry } =
    usePosts(user.id)

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label="Volver a la lista de usuarios"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <div className="min-w-0">
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            {user.name}
          </h2>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="size-3" /> {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="size-3" /> {user.company.name}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Publicaciones
            {!isLoading && !error && (
              <span className="ml-2 text-muted-foreground">({posts.length})</span>
            )}
          </h3>
          <PostList posts={posts} isLoading={isLoading} error={error} onRetry={retry} />
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Nueva publicación</CardTitle>
            </CardHeader>
            <CardContent>
              <CreatePostForm
                onSubmit={createPost}
                isSubmitting={isCreating}
                submitError={createError}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

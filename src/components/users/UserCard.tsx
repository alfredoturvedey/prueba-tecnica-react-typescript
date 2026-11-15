import { Building2, ChevronRight, Mail, User as UserIcon } from 'lucide-react'
import type { User } from '@/types/api'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  user: User
  onClick: () => void
}

export function UserCard({ user, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      aria-label={`Ver publicaciones de ${user.name}`}
    >
      <Card className="cursor-pointer transition-all hover:ring-primary/40 hover:shadow-sm">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">{user.company.name}</span>
              </span>
            </div>
          </div>

          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </button>
  )
}

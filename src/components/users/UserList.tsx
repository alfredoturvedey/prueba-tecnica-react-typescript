import { AlertCircle, Users } from 'lucide-react'
import type { User } from '@/types/api'
import { UserCard } from './UserCard'
import { UserSearch } from './UserSearch'

type Props = {
  users: User[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  onSearchChange: (value: string) => void
  onSelectUser: (id: number) => void
}

export function UserList({
  users,
  isLoading,
  error,
  searchQuery,
  onSearchChange,
  onSelectUser,
}: Props) {
  return (
    <div className="space-y-4">
      <UserSearch value={searchQuery} onChange={onSearchChange} />

      {isLoading && (
        <div className="space-y-3" aria-label="Cargando usuarios" role="status">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && users.length > 0 && (
        <>
          {users.length === 0 || (
            <p className="text-xs text-muted-foreground">
              {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado
              {users.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="space-y-2">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onClick={() => onSelectUser(user.id)}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div
          role="status"
          className="flex flex-col items-center gap-2 py-16 text-muted-foreground"
        >
          <Users className="size-10 opacity-30" />
          <p className="text-sm">No se encontraron usuarios</p>
        </div>
      )}
    </div>
  )
}

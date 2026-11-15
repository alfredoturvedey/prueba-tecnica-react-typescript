import { UserDataTable } from '@/components/users/UserDataTable'
import { UserPostsView } from '@/components/posts/UserPostsView'
import { useUsers } from '@/hooks/useUsers'
import { useAppStore } from '@/store/useAppStore'

export default function App() {
  const { users, isLoading, error, retry } = useUsers()
  const { selectedUserId, selectUser, clearSelectedUser } = useAppStore()

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {selectedUser ? (
          <main>
            <UserPostsView user={selectedUser} onBack={clearSelectedUser} />
          </main>
        ) : (
          <>
            <header className="mb-8 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Usuarios
              </h1>
              <p className="text-sm text-muted-foreground">
                Selecciona un usuario para ver sus publicaciones
              </p>
            </header>
            <main>
              <UserDataTable
                data={users}
                isLoading={isLoading}
                error={error}
                onSelectUser={selectUser}
                onRetry={retry}
              />
            </main>
          </>
        )}
      </div>
    </div>
  )
}

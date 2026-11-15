import { useDeferredValue, useState } from 'react'
import { UserList } from '@/components/users/UserList'
import { useUsers } from '@/hooks/useUsers'
import { useAppStore } from '@/store/useAppStore'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const deferredQuery = useDeferredValue(searchQuery)

  const { users, isLoading, error } = useUsers()
  const selectUser = useAppStore((s) => s.selectUser)

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(deferredQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecciona un usuario para ver sus publicaciones
          </p>
        </header>

        <main>
          <UserList
            users={filteredUsers}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectUser={selectUser}
          />
        </main>
      </div>
    </div>
  )
}

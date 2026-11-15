import { UserDataTable } from '@/components/users/UserDataTable'
import { useUsers } from '@/hooks/useUsers'
import { useAppStore } from '@/store/useAppStore'

export default function App() {
  const { users, isLoading, error } = useUsers()
  const selectUser = useAppStore((s) => s.selectUser)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
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
          />
        </main>
      </div>
    </div>
  )
}

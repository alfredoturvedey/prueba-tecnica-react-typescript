import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/api'

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    enableGlobalFilter: true,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown className="ml-1.5 size-3.5" />
      </Button>
    ),
  },
  {
    accessorKey: 'username',
    enableGlobalFilter: false,
    header: 'Usuario',
    cell: ({ row }) => (
      <span className="text-muted-foreground">@{row.original.username}</span>
    ),
  },
  {
    accessorKey: 'email',
    enableGlobalFilter: false,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <ArrowUpDown className="ml-1.5 size-3.5" />
      </Button>
    ),
  },
  {
    accessorKey: 'company.name',
    enableGlobalFilter: false,
    header: 'Empresa',
    cell: ({ row }) => row.original.company.name,
  },
]

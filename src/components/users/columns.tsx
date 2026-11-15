import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, BookOpen } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { User } from '@/types/api'

export function createUserColumns(
  onSelectUser: (id: number) => void,
): ColumnDef<User>[] {
  return [
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
    {
      id: 'actions',
      header: 'Acciones',
      enableSorting: false,
      enableGlobalFilter: false,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger
            className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
            aria-label="Gestionar publicaciones"
            onClick={(e) => {
              e.stopPropagation()
              onSelectUser(row.original.id)
            }}
          >
            <BookOpen className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent>Gestionar publicaciones</TooltipContent>
        </Tooltip>
      ),
    },
  ]
}

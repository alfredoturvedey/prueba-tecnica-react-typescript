import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Buscar por nombre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
        aria-label="Buscar usuarios por nombre"
      />
    </div>
  )
}

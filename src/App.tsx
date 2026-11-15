import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Mail, MessageSquare, Send, Trash2, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/useAppStore'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede superar los 500 caracteres'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function App() {
  const { submissions, addSubmission, clearSubmissions } = useAppStore()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  })

  function onSubmit(values: ContactFormValues) {
    addSubmission(values)
    form.reset()
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            React + Vite + shadcn/ui
          </h1>
          <p className="text-muted-foreground">
            TypeScript · Tailwind CSS · React Hook Form · Zod · Zustand · Lucide React
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="size-5" />
              Formulario de contacto
            </CardTitle>
            <CardDescription>
              Demo con validación en tiempo real usando React Hook Form + Zod
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Mail className="size-3.5" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Solo se usa para esta demo, no se almacena.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe tu mensaje (mín. 10 caracteres)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value.length}/500 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gap-2">
                  <Send className="size-4" />
                  Enviar mensaje
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {submissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5 text-green-500" />
                Envíos registrados ({submissions.length})
              </CardTitle>
              <CardDescription>
                Estado global gestionado con Zustand
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1"
                >
                  <div className="font-medium text-foreground">{sub.name}</div>
                  <div className="text-muted-foreground">{sub.email}</div>
                  <div className="text-foreground/80">{sub.message}</div>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={clearSubmissions}
              >
                <Trash2 className="size-4" />
                Limpiar historial
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

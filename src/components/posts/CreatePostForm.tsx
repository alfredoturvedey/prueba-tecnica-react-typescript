import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const postSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  body: z
    .string()
    .min(1, 'El contenido es obligatorio')
    .max(500, 'Máximo 500 caracteres'),
})

type PostFormValues = z.infer<typeof postSchema>

type Props = {
  onSubmit: (data: PostFormValues) => Promise<boolean>
  isSubmitting: boolean
  submitError: string | null
}

export function CreatePostForm({ onSubmit, isSubmitting, submitError }: Props) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: '', body: '' },
  })

  async function handleSubmit(values: PostFormValues) {
    const ok = await onSubmit(values)
    if (ok) form.reset()
  }

  const bodyLength = form.watch('body').length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Escribe el título..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe el contenido..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormMessage />
                <span className="ml-auto text-xs text-muted-foreground">
                  {bodyLength}/500
                </span>
              </div>
            </FormItem>
          )}
        />

        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          {isSubmitting ? 'Publicando...' : 'Publicar'}
        </Button>
      </form>
    </Form>
  )
}

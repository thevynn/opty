'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SubmitButton } from '@/components/submit-button'

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z
  .object({
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  newPassword: '',
  confirmNewPassword: '',
}

export function ResetPasswordForm() {
  const router = useRouter()
  const auth = useAuth()
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const updated = await supabase.auth.updateUser({
        password: values.newPassword,
      })

      if (updated?.error) throw new Error(updated?.error?.message)
      if (!updated?.data?.user) throw new Error('User data is invalid.')

      const signout = await supabase.auth.signOut()

      if (signout?.error) throw new Error(signout?.error?.message)

      toast.success(
        t('FormMessage.your_password_has_been_successfully_changed')
      )

      auth.setSession(null)
      auth.setUser(null)

      router.replace('/auth/signin')
      router.refresh()
    } catch (e: unknown) {
      const error = e as Error
      switch (error?.message) {
        case 'New password should be different from the old password.':
          form.setError('newPassword', {
            message: t(
              'FormMessage.new_password_should_be_different_from_the_old_password'
            ),
          })
          break
        default:
          toast.error(error?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.new_password')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.confirm_new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.confirm_new_password')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          className="w-full"
          text="ResetPasswordForm.submit"
          translate="yes"
        />
      </form>
    </Form>
  )
}

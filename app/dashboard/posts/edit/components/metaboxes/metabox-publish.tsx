'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useFormContext } from 'react-hook-form'
import dayjs from 'dayjs'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { usePostForm } from '@/app/dashboard/posts/edit/context/post-form-provider'

import { useSWRConfig } from 'swr'
import { fetcher, getPostPath, getMeta } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Meta } from '@/types/database'

const MetaboxPublish = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()

  const statusText = React.useMemo(() => {
    if (post?.status === 'future') return t('PostMetabox.draft')
    if (post?.date) return t('PostMetabox.publish')
    if (post?.status) return t(`PostStatus.${post?.status}`)

    return null
  }, [t, post?.status, post?.date])

  const dateText = React.useMemo(() => {
    const date = dayjs(post?.date).format('YYYY-MM-DD HH:mm:ss')

    if (post?.status === 'future') {
      return `${t('PostMetabox.future_date')}: ${date}`
    }

    if (post?.date) {
      return `${t('PostMetabox.posted_on')}: ${date}`
    }

    return `${t('PostMetabox.publish')}: ${t('PostMetabox.immediately')}`
  }, [t, post?.status, post?.date])

  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className="pt-0">
          {t('PostMetabox.publish')}
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div className="flex justify-between">
            <DraftButton />
            {post?.status === 'draft' ? <PreviewButton /> : <ViewButton />}
          </div>
          <ul className="space-y-1">
            <li className="flex items-center">
              <LucideIcon name="Signpost" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.status')}: `}
              {statusText}
            </li>
            <li className="flex items-center">
              <LucideIcon name="Eye" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.visibility')}: `}
              {post?.status === 'publish'
                ? t('PostMetabox.public')
                : t('PostMetabox.private')}
            </li>
            <li className="flex items-center">
              <LucideIcon name="CalendarDays" className="mr-2 size-4 min-w-4" />
              {dateText}
            </li>
            <li className="flex items-center">
              <LucideIcon name="BarChart" className="mr-2 size-4 min-w-4" />
              {`${t('PostMetabox.post_views')}: `}
              {getMeta(post?.meta, 'view_count', '0')?.toLocaleString()}
            </li>
          </ul>
          <div className="flex justify-between">
            <TrashButton />
            <PublishButton />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const DraftButton = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const formValues = getValues()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { ...formValues, status: 'draft' },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.save_draft')}
    </Button>
  )
}

const ViewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { handleSubmit } = useFormContext()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const postPath = getPostPath(post)

      if (postPath) router.push(postPath)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.view')}
    </Button>
  )
}

const PreviewButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const postPath = getPostPath(post)
      const formValues = getValues()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { ...formValues, status: 'draft' },
          options: { revalidatePaths: postPath },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      if (postPath) router.push(postPath + '?preview=true')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.preview')}
    </Button>
  )
}

const TrashButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, setError, handleSubmit, unregister } = useFormContext()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    unregister('slug')
    router.refresh()
  }, [unregister, router])

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const formValues = getValues()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            ...formValues,
            status: 'trash',
            deleted_at: new Date().toISOString(),
          },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))

      router.push('/dashboard/posts')
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="link"
      className="h-auto p-0 text-destructive underline"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('PostMetabox.move_to_trash')}
    </Button>
  )
}

const PublishButton = () => {
  const { t } = useTranslation()
  const { post } = usePostForm()
  const { getValues, setError, handleSubmit } = useFormContext()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!post) throw new Error('Require is not defined.')

      const formValues = getValues()
      const future_date = getMeta(formValues?.meta, 'future_date', null)
      const status = future_date ? 'future' : 'publish'
      const now = new Date().toISOString()

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: post?.date
            ? { ...formValues, status }
            : { ...formValues, status, date: now },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('slug', { message: t('FormMessage.duplicate_slug') })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      variant="default"
      size="sm"
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {post?.status === 'draft'
        ? t('PostMetabox.publish')
        : t('PostMetabox.update')}
    </Button>
  )
}

export { MetaboxPublish }

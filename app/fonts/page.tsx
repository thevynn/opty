'use client'

import Image from 'next/image'

import { LucideIcon } from '@/lib/lucide-icon'

import LogoFull from '@/public/assets/logos/logo-full.svg'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import LangSelect from '@/components/fonts/LangSelect'
import CategorySelect from '@/components/fonts/CategorySelect'
import FontSizeSlider from '@/components/fonts/FontSizeSlider'
import RegisterAdvCard from '@/components/cta/RegisterAdvCard'
import FontPreviewCard from '@/components/fonts/FontPreviewCard'

export default function Fonts() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="grid w-full grid-cols-[280px_1fr] overflow-hidden">
        <section id="sidebar" className="relative flex flex-col border-r">
          <div className="fixed grid h-full w-[280px] grid-rows-[1fr_0.65fr] overflow-hidden">
            <div
              id="filter-section"
              className="scrollbar-hide flex flex-col gap-6 overflow-y-auto px-4 pt-4"
            >
              <div id="preview-text" className="flex flex-col gap-2">
                <Label
                  htmlFor="preview-text"
                  className="text-sm text-neutral-600"
                >
                  미리보기
                </Label>
                <Textarea
                  placeholder="아무 말이나 적어보세요."
                  className="resize-none border-none bg-neutral-100"
                />
              </div>
              <div id="preview-size" className="flex flex-col gap-2">
                <Label
                  htmlFor="preview-size"
                  className="text-sm text-neutral-600"
                >
                  글꼴 크기
                </Label>
                <FontSizeSlider />
              </div>
              <div id="language" className="flex flex-col gap-2">
                <Label
                  htmlFor="language"
                  className="flex flex-row items-center gap-1 text-sm text-neutral-600"
                >
                  <LucideIcon name="Languages" className="size-4" />
                  언어
                </Label>
                <LangSelect />
              </div>

              <div id="category" className="flex flex-col gap-2">
                <Label
                  htmlFor="category"
                  className="flex flex-row items-center gap-1 text-sm text-neutral-600"
                >
                  <LucideIcon name="Tag" className="size-4" />
                  카테고리
                </Label>
                <CategorySelect />
              </div>
              <div id="personality" className="flex flex-col gap-2">
                <Label
                  htmlFor="personality"
                  className="flex flex-row items-center gap-1 text-sm text-neutral-600"
                >
                  <LucideIcon name="Blend" className="size-4" />
                  느낌
                </Label>
                <CategorySelect />
              </div>
            </div>
            <div id="footer-section" className="overflow-hidden p-3">
              <RegisterAdvCard />
              <footer className="mb-2 mt-4">
                <p className="text-xs text-neutral-400">
                  © 2024 <span className="font-bold">OpenTypo</span>. All
                  rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </section>
        <section id="explore" className="flex h-[3000px] flex-col px-4 pt-4">
          <FontPreviewCard />
        </section>
      </div>
    </div>
  )
}

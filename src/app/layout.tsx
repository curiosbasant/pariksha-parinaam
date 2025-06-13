import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ComponentProps } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { getThemePreference } from './@themeSwitchButton/dal'
import { Providers } from './client'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Pariksha Parinaam',
  description: 'See the result of whole class in a minute',
}

export default function RootLayout(props: LayoutProps<{ slots: 'themeSwitchButton' }>) {
  return (
    <Html className='size-full bg-background text-foreground' lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} size-full antialiased`}>
        <div className='absolute h-2/3 w-full mask-b-from-50%'>
          <div
            className='h-full opacity-[0.05] dark:invert'
            style={{ background: 'url(/bg-pattern.jpg) top / 600px' }}
          />
        </div>
        <ScrollArea className='size-full'>
          <div className='isolate flex min-h-full w-full flex-col divide-y [--page-padding:--spacing(2)] [--page-size:var(--container-7xl)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]'>
            <header className='sticky top-0 z-10 bg-background/80 px-(--page-padding) backdrop-blur-sm'>
              <div className='m-auto flex max-w-(--page-size) items-center justify-between py-3'>
                <span className='text-2xl font-bold'>Pariksha Parinaam</span>
                {props.themeSwitchButton}
              </div>
            </header>
            <div className='flex-1 px-(--page-padding)'>
              <main className='m-auto size-full max-w-(--page-size) pt-8 pb-16'>
                <Providers>{props.children}</Providers>
              </main>
            </div>
            <footer className='px-(--page-padding)'>
              <div className='m-auto max-w-(--page-size) py-6'>
                <div className='flex flex-col justify-between gap-2 text-sm md:flex-row'>
                  <p>
                    Made with ❤️ by{' '}
                    <a
                      className='text-blue-400 hover:text-blue-500'
                      href='https://www.github.com/curiosbasant/pariksha-parinaam'
                      target='_blank'>
                      Basant (Computer Instructor)
                    </a>
                  </p>
                  <span>©{new Date().getFullYear()}</span>
                  <p>
                    Thanks to{' '}
                    <a
                      className='text-blue-400 hover:text-blue-500'
                      href='https://www.amarujala.com/'
                      target='_blank'>
                      amarujala.com
                    </a>{' '}
                    for the api 😉
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </ScrollArea>
      </body>
    </Html>
  )
}

async function Html(props: ComponentProps<'html'>) {
  const themePreference = await getThemePreference()

  return <html {...props} data-theme={themePreference} />
}

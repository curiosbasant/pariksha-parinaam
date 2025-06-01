import './globals.css'

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ComponentProps } from 'react'
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased size-full`}>
        <div className='flex flex-col w-full min-h-full [--page-size:var(--container-7xl)] [--page-padding:--spacing(2)] sm:[--page-padding:--spacing(4)] isolate md:[--page-padding:--spacing(8)] divide-y'>
          <header className='px-(--page-padding) sticky top-0 bg-background/80 backdrop-blur-sm z-10'>
            <div className='m-auto max-w-(--page-size) py-4 flex items-center justify-between'>
              <span className='font-bold text-3xl'>Pariksha Parinaam</span>
              {props.themeSwitchButton}
            </div>
          </header>
          <div className='px-(--page-padding) flex-1'>
            <main className='m-auto max-w-(--page-size) py-8 size-full'>
              <Providers>{props.children}</Providers>
            </main>
          </div>
          <footer className='px-(--page-padding)'>
            <div className='m-auto max-w-(--page-size) py-6'>
              <div className='flex flex-col gap-2 md:flex-row justify-between text-sm'>
                <p>
                  Made with ❤️ by{' '}
                  <a
                    className='text-blue-400 hover:text-blue-500'
                    href='https://www.github.com/curiosbasant'
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
      </body>
    </Html>
  )
}

async function Html(props: ComponentProps<'html'>) {
  const themePreference = await getThemePreference()

  return <html {...props} data-theme={themePreference} />
}

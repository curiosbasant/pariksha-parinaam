import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { getThemePreference } from './@themeSwitchButton/dal'
import { Providers, ShareResultButton } from './client'
import icon from './icon0.svg'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
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
            <Providers>
              <header className='sticky top-0 z-10 bg-background/80 px-(--page-padding) backdrop-blur-sm'>
                <div className='m-auto flex max-w-(--page-size) items-center gap-4 py-3'>
                  <Link href='/' className='contents text-2xl font-extrabold'>
                    <Image
                      src={icon}
                      className='not-dark:invert'
                      width={32}
                      height={32}
                      alt='Logo'
                    />
                    Pariksha Parinaam
                  </Link>
                  <div className='ms-auto'>
                    <ShareResultButton />
                  </div>
                  {props.themeSwitchButton}
                </div>
              </header>
              <div className='flex-1 px-(--page-padding)'>
                <main className='m-auto size-full max-w-(--page-size) pt-8 pb-16'>
                  {props.children}
                </main>
              </div>
            </Providers>
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

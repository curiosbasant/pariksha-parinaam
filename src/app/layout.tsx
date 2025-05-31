import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from './client'
import { PropsWithChildren } from 'react'

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

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html className='size-full dark' lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col size-full [--page-padding:--spacing(2)] sm:[--page-padding:--spacing(4)] md:[--page-padding:--spacing(8)]`}>
        <div className='px-(--page-padding) flex-1'>
          <main className='m-auto max-w-7xl py-8 size-full'>
            <Providers>{props.children}</Providers>
          </main>
        </div>
        <footer className='px-(--page-padding) border-t'>
          <div className='m-auto max-w-7xl py-6'>
            <div className='flex flex-col gap-2 md:flex-row justify-between text-sm'>
              <p>
                Made with ❤️ by{' '}
                <a
                  className='text-blue-400 hover:text-blue-500'
                  href='https://www.github.com/curiosbasant'>
                  Basant (Computer Instructor)
                </a>
              </p>
              <span>©{new Date().getFullYear()}</span>
              <p>
                Thanks to{' '}
                <a className='text-blue-400 hover:text-blue-500' href='https://www.amarujala.com/'>
                  amarujala.com
                </a>{' '}
                for the api 😉
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

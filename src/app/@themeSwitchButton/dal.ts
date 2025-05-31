import { cookies } from 'next/headers'
import { cache } from 'react'
import { COOKIE_THEME_KEY } from './shared'

export type ThemePreference = 'light' | 'dark'

export const getThemePreference = cache(async () => {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_THEME_KEY)?.value as ThemePreference | undefined
})

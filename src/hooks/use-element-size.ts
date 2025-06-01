import { startTransition, useCallback, useState } from 'react'

export function useElementSize<T extends HTMLElement>() {
  const [elementSize, setElementSize] = useState<number>(0)

  const ref = useCallback((elem: T | null) => {
    if (!elem) return
    const observer = new ResizeObserver(([{ borderBoxSize }]) => {
      startTransition(() => setElementSize(borderBoxSize[0].inlineSize))
    })
    observer.observe(elem)
    return () => {
      observer.disconnect()
    }
  }, [])

  return [ref, elementSize] as const
}

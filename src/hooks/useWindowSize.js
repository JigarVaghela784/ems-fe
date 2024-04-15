import { useState, useEffect } from 'react'

export default function useWindowSize(id, isUpdate) {
  const windowType = typeof window !== 'undefined'

  const getWindowSize = () => {
    if (!windowType) return { width: undefined, height: undefined }

    if (id) {
      const div = document.getElementById(id)

      return {
        width: div ? div.offsetWidth : undefined,
        height: window.innerHeight
      }
    } else {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  const [windowSize, setWindowSize] = useState(getWindowSize)

  useEffect(() => {
    if (!windowType) return

    function handleResize() {
      setWindowSize(getWindowSize())
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [isUpdate, id, windowType])

  return windowSize
}

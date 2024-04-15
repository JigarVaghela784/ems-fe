import React, { useEffect, useRef, useState } from 'react'
import ReactDOM, { createPortal } from 'react-dom'

export const Portal = props => {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ref.current = document.querySelector('#portal')
    setMounted(true)
  }, [])

  return mounted && ref.current ? createPortal(<div>{props.children}</div>, ref.current) : null
}

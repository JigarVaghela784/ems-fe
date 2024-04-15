import React, { useRef, useState, useEffect } from 'react'
import { Tooltip } from '@mui/material'

const CustomToolTip = ({ className, children }) => {
  const textElementRef = useRef()

  const checkOverflow = () => {
    setTimeout(() => {
      if (!textElementRef.current) return
      const clientWidth = textElementRef.current?.clientWidth
      textElementRef.current.style.overflow = 'visible'
      const contentWidth = textElementRef?.current?.scrollWidth
      textElementRef.current.style.overflow = 'hidden'

      setIsOverflow(contentWidth > clientWidth)
    }, 1000)
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [children])

  const [isOverflowed, setIsOverflow] = useState(false)

  return (
    <Tooltip title={children} disableHoverListener={!isOverflowed}>
      <div
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
        className={className ? className : ''}
      >
        {children}
      </div>
    </Tooltip>
  )
}

export default CustomToolTip

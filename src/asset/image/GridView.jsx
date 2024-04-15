import * as React from 'react'

const GridView = ({ fill, ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill='none' viewBox='0 0 24 24' {...props}>
    <rect width={10} height={10} fill={fill} rx={1} />
    <rect width={10} height={10} x={14} fill={fill} rx={1} />
    <rect width={10} height={10} y={14} fill={fill} rx={1} />
    <rect width={10} height={10} x={14} y={14} fill={fill} rx={1} />
  </svg>
)

export default GridView

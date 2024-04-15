import * as React from 'react'

const ListView = ({ fill, ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} fill='none' viewBox='0 0 24 24' {...props}>
    <rect width={5} height={5} y={0.5} fill={fill} rx={2.5} />
    <rect width={17} height={5} x={7} y={0.5} fill={fill} rx={2} />
    <rect width={5} height={5} y={9.5} fill={fill} rx={2.5} />
    <rect width={17} height={5} x={7} y={9.5} fill={fill} rx={2} />
    <rect width={5} height={5} y={18.5} fill={fill} rx={2.5} />
    <rect width={17} height={5} x={7} y={18.5} fill={fill} rx={2} />
  </svg>
)

export default ListView

import React from 'react'
import noData from '../../asset/image/noData.svg'
import Image from 'next/image'

const NoData = ({ description }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Image src={noData} alt='No data' />
      <p style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.25)' }}>{description ? description : 'No data'}</p>
    </div>
  )
}

export default NoData

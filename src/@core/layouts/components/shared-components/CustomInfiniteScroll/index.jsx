import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

const CustomInfiniteScroll = ({ dataLength, next, children, hasMore, ...res }) => {
  return (
    <div>
      <InfiniteScroll dataLength={dataLength} next={next} hasMore={hasMore} {...res}>
        {children}
      </InfiniteScroll>
    </div>
  )
}

export default CustomInfiniteScroll

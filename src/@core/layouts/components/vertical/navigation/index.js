// ** React Import
import React, { useRef, useState } from 'react'

// ** MUI Import
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Component Imports
import Drawer from './Drawer'
import VerticalNavItems from './VerticalNavItems'
import VerticalNavHeader from './VerticalNavHeader'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import UserDropdown from '../../shared-components/UserDropdown'

const StyledBoxForShadow = styled(Box)({
  top: 50,
  left: -8,
  zIndex: 2,
  height: 75,
  display: 'none',
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  '&.d-block': {
    display: 'block'
  }
})

const Navigation = props => {
  // ** Props
  const {
    hidden,
    afterVerticalNavMenuContent,
    beforeVerticalNavMenuContent,
    verticalNavMenuContent: userVerticalNavMenuContent
  } = props

  // ** States
  const [groupActive, setGroupActive] = useState([])
  const [currentActiveGroup, setCurrentActiveGroup] = useState([])

  // ** Ref
  const shadowRef = useRef(null)

  // ** Hooks
  const theme = useTheme()

  // ** Fixes Navigation InfiniteScroll
  const handleInfiniteScroll = ref => {
    if (ref) {
      // @ts-ignore
      ref._getBoundingClientRect = ref.getBoundingClientRect
      ref.getBoundingClientRect = () => {
        // @ts-ignore
        const original = ref._getBoundingClientRect()

        return { ...original, height: Math.floor(original.height) }
      }
    }
  }

  // ** Scroll Menu

  const ScrollWrapper = hidden ? Box : PerfectScrollbar

  return (
    <Drawer {...props}>
      {/*<VerticalNavHeader {...props} />*/}
      <Box className='menu-list' sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        <ScrollWrapper
          containerRef={ref => handleInfiniteScroll(ref)}
          {...(hidden
            ? {
                sx: { height: '100%', overflowY: 'auto', overflowX: 'hidden' }
              }
            : {
                options: { wheelPropagation: false }
              })}
        >
          {beforeVerticalNavMenuContent ? beforeVerticalNavMenuContent(props) : null}
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {userVerticalNavMenuContent ? (
              userVerticalNavMenuContent(props)
            ) : (
              <>
                {hidden && (
                  <>
                    <div className='pl-20'>
                      <UserDropdown isHidden />
                    </div>
                    <div className='user-dropdown-line'></div>
                  </>
                )}
                <List className='nav-items' sx={{ transition: 'padding .25s ease', px: 4.5 }}>
                  <VerticalNavItems
                    groupActive={groupActive}
                    setGroupActive={setGroupActive}
                    currentActiveGroup={currentActiveGroup}
                    setCurrentActiveGroup={setCurrentActiveGroup}
                    {...props}
                  />
                </List>
              </>
            )}
          </Box>
        </ScrollWrapper>
      </Box>
      {afterVerticalNavMenuContent ? afterVerticalNavMenuContent(props) : null}
    </Drawer>
  )
}

export default Navigation

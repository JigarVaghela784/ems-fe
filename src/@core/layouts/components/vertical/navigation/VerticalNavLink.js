// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { baseUrl } from 'utils/consts'
import React, { useEffect, useState } from 'react'

// ** Styled Components
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: 6,
  color: theme.palette.common.white,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    background: '#1883C2'
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }) => {
  // ** Hooks
  const router = useRouter()
  const IconTag = item.icon

  const [showSubMenu, setShowSubMenu] = useState(false)

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (item?.subMenu) {
      let isShowMenu = false
      item?.subMenu?.forEach(menu => {
        if (router.pathname === menu.path || handleURLQueries(router, menu.path)) {
          isShowMenu = true
        }
      })
      setShowSubMenu(isShowMenu)
    }
  }, [router, item?.subMenu])

  return (
    <>
      <ListItem className='nav-link' disabled={item.disabled || false} sx={{ mt: 1.5, px: '0 !important' }}>
        <Link passHref href={item.path === undefined ? baseUrl : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={isNavLinkActive() ? 'active' : ''}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.subMenu) {
                setShowSubMenu(!showSubMenu)
                e.preventDefault()
                e.stopPropagation()

                return
              }
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              pl: 5.5,
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
          >
            <ListItemIcon
              sx={{
                mr: 2.5,
                color: '#fff',
                transition: '.25s ease-in-out',
                transform: item?.subMenu && showSubMenu && 'rotate(90deg)'
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon>
            <MenuItemTextMetaWrapper>
              <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })} sx={{ color: '#fff' }}>
                {item.title}
              </Typography>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>

      {item?.subMenu && showSubMenu && (
        <div className='px-20'>
          {item.subMenu.map((subMenu, index) => {
            return (
              <VerticalNavLink
                key={index}
                item={subMenu}
                navVisible={navVisible}
                toggleNavVisibility={toggleNavVisibility}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default VerticalNavLink

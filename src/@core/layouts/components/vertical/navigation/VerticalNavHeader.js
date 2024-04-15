import React from 'react'

// ** Next Import
import Link from 'next/link'
import cs from 'classnames'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CiphernutzLogo from 'src/asset/image/CiphernutzLogo.svg'
import { baseUrl } from 'utils/consts'
import Image from 'next/image'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: 'normal',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const StyledLink = styled('a')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const { verticalNavMenuBranding: userVerticalNavMenuBranding } = props

  return (
    <MenuHeaderWrapper
      className={cs('nav-header', { ['top-bar-logo']: !props.navWidth })}
      sx={{ pl: 6, display: { lg: props.navWidth ? 'block' : 'none' } }}
    >
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <Link href={baseUrl} passHref>
          <StyledLink>
            <Image src={CiphernutzLogo.src} width={200} height={60} alt='CiphernutzLogo' />
          </StyledLink>
        </Link>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader

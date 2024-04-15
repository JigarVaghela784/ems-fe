// ** React Imports
import { Fragment } from 'react'
import Leaf1 from '../../../asset/image/Leaf1.svg'
import Leaf2 from '../../../asset/image/Leaf2.svg'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// Styled Components
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))

const Tree1Img = styled('img')(() => ({
  left: 50,
  bottom: 50,
  position: 'absolute'
}))

const Tree2Img = styled('img')(() => ({
  right: 50,
  bottom: 100,
  position: 'absolute'
}))

const FooterIllustrationsV1 = props => {
  // ** Props
  const { image1, image2 } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  if (!hidden) {
    return (
      <Fragment>
        {image1 || <Tree1Img alt='tree' src={Leaf2.src} />}
        <MaskImg alt='mask' src={`/images/pages/auth-v1-mask-${theme.palette.mode}.png`} />
        {image2 || <Tree2Img alt='tree-2' src={Leaf1.src} />}
      </Fragment>
    )
  } else {
    return null
  }
}

export default FooterIllustrationsV1

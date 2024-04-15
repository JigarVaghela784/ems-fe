// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', ml: 'auto' }}>
      <Typography sx={{ mr: 'auto', ml: 'auto' }} className='footer-section'>
        {`Copyright ${new Date().getFullYear()}. All Rights Reserved by`}{' '}
          EMS
      </Typography>
    </Box>
  )
}

export default FooterContent

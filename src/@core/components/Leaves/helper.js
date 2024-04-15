export const getLeaveType = value => {
  switch (value) {
    case 'casual':
      return 'Casual Leave'
    case 'medical':
      return 'Medical Leave'
    case 'lossOfDay':
      return 'Loss of Pay'
    default:
      return ''
  }
}

export const customHandleChange = (userData, name, value) => {
  return { ...userData, [name]: value }
}

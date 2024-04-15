export default function middleware(handler) {
  return async (req, res) => {
    return handler(req, res).catch(error => {
      if (error) {
        return res.status(error.statusCode).send({
          message: error.message
        })
      }

      // catch default errors
      return res.status(500).send({
        message: 'Internal Server Error',
        description: error?.message
      })
    })
  }
}

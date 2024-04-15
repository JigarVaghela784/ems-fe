import { Storage } from '@google-cloud/storage'
import { v4 } from 'uuid'
import middleware from './middleware'

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || ''

export default middleware(async (req, res) => {
  const { method } = req
  const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY

  const storage = new Storage({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    credentials: {
      client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
      private_key: new Buffer(privateKey, 'base64').toString()
    }
  })

  const bucket = storage.bucket(bucketName)
  const file = bucket.file(`hrms-${v4()}`)

  const options = {
    expires: Date.now() + 5 * 60 * 1000, //  1 minute,
    fields: { 'x-goog-meta-test': 'data' }
  }

  const [response] = await file.generateSignedPostPolicyV4(options)
  let result
  switch (method) {
    case 'POST':
    default:
      result = { data: response, status: 1 }
      break
  }

  return res.json({ ...result })
})

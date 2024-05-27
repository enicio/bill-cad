import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { RegisterBillingService } from '../services/register-billing'
import { downloadFilesFromS3 } from '../lib/downloadFiles'
import { s3Connect } from '../lib/s3Connect'
import { CreateBillingRepository } from '../repository/prisma/prisma -billing'
import { parsePDF } from '../utils/pdfParser'
import { uploadToS3 } from '../lib/uploadFile'
import { GetAllBillingService } from '../services/get-all-billing'

const MAX_FILE_SIZE_IN_BYTES = 1024 * 40

export async function routes(app: FastifyInstance) {
  const s3Client = s3Connect(
    '123456',
    'abcdef',
    'us-east-1',
    process.env.S3_BUCKET_URL as string,
    true,
  )
  app.post('/register-bill', async function (req, reply) {
    const data = await req.file({
      limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
    })
    try {
      if (!data) {
        throw new Error('No file uploaded')
      }
      const buffer = await data.toBuffer()
      const billingRepository = new CreateBillingRepository()
      const registerBillingService = new RegisterBillingService(
        parsePDF,
        billingRepository,
        s3Client,
        uploadToS3,
      )
      const clientData = await registerBillingService.execute(buffer, data)
      reply.status(201).send(clientData)
    } catch (error: any) {
      if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
        return reply.status(413).send({ message: 'File too large' })
      }
      if (error.message === 'Billing already registered') {
        return reply.status(409).send({ message: 'Billing already registered' })
      }
      return reply.status(500).send({ message: error.message })
    }
  })

  app.get(
    '/assets/:fileId',
    async function (req: FastifyRequest, reply: FastifyReply) {
      const { fileId }: any = req.params

      try {
        const arrayBuffer = await downloadFilesFromS3(
          fileId,
          'client-billing',
          s3Client,
        )
        reply.headers({ 'Content-Type': 'application/pdf' }).send(arrayBuffer)
      } catch (error: any) {
        if (error.name === 'NoSuchKey') {
          return reply.status(404).send({ message: 'File not found' })
        }
        return reply.status(500).send({ message: error.message })
      }
    },
  )

  app.get('/billing/:clientNumber', async function (req, reply) {
    const { clientNumber }: any = req.params
    const billingRepository = new CreateBillingRepository()

    const getAllBillingService = new GetAllBillingService(billingRepository)

    try {
      const billings = await getAllBillingService.execute(clientNumber)
      if (!billings) {
        return reply.status(404).send({ message: 'No billings found' })
      }
      return reply.status(200).send(billings)
    } catch (error: any) {
      return reply.status(500).send({ message: error.message })
    }
  })
}

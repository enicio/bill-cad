import { CreateBillingRepository } from '../../repository/prisma/prisma -billing'
import { RegisterBillingService } from '../../services/register-billing'
import { MAX_FILE_SIZE_IN_BYTES } from '../../utils/constants'
import { parsePDF } from '../../utils/pdfParser'
// import { s3ClientConnect } from '../../app'
import { uploadToS3 } from '../../lib/uploadFile'
import { FastifyReply, FastifyRequest } from 'fastify'
import { downloadFilesFromS3 } from '../../lib/downloadFiles'
import { GetAllBillingService } from '../../services/get-all-billing'
import { S3ClientSingleton } from '../../lib/s3Client'

export async function handleRegisterBill(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await req.file({
    limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
  })

  const s3Config = {
    credentials: { accessKeyId: '123456', secretAccessKey: 'abcdef' },
    region: 'us-east-1',
    endpoint: 'http://0.0.0.0:4566',
    forcePathStyle: true,
  }

  const s3ClientSingleton = S3ClientSingleton.getInstance(s3Config)
  const s3ClientConnect = s3ClientSingleton.getClient()
  try {
    if (!data) {
      throw new Error('No file uploaded')
    }
    const buffer = await data.toBuffer()
    const billingRepository = new CreateBillingRepository()
    const registerBillingService = new RegisterBillingService(
      parsePDF,
      billingRepository,
      s3ClientConnect,
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
}

export async function handleGetAssets(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const { fileId }: any = req.params

  const s3Config = {
    credentials: { accessKeyId: '123456', secretAccessKey: 'abcdef' },
    region: 'us-east-1',
    endpoint: 'http://0.0.0.0:4566',
    forcePathStyle: true,
  }

  const s3ClientSingleton = S3ClientSingleton.getInstance(s3Config)
  const s3ClientConnect = s3ClientSingleton.getClient()

  try {
    const arrayBuffer = await downloadFilesFromS3(
      fileId,
      'client-billing',
      s3ClientConnect,
    )
    reply.headers({ 'Content-Type': 'application/pdf' }).send(arrayBuffer)
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return reply.status(404).send({ message: 'File not found' })
    }
    return reply.status(500).send({ message: error.message })
  }
}

export async function handleGetBilling(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('req.params', req.server)
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
}

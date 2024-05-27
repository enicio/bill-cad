import { S3Client } from '@aws-sdk/client-s3'

export function s3Connect(
  accessKeyId: string,
  secretAccessKey: string,
  region: string = 'us-east-1',
  endpoint: string,
  forcePathStyle: boolean = true,
) {
  const s3Client = new S3Client({
    credentials: { accessKeyId, secretAccessKey },
    region,
    endpoint,
    forcePathStyle,
  })

  return s3Client
}

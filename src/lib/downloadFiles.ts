import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function downloadFilesFromS3(
  fileId: string,
  bucketName: string,
  s3Client: any,
) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileId,
  })

  const response = await s3Client.send(command)
  const arrayBuffer = await response.Body?.transformToByteArray()

  return arrayBuffer
}

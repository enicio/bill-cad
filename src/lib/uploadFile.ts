import { Upload } from '@aws-sdk/lib-storage'

export async function uploadToS3(data: any, bucketName: string, s3Client: any) {
  // Recomendado pela documentação da aws por usar stream
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-storage/
  try {
    const buffer = await data.toBuffer()
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: data.filename,
        Body: buffer,
      },

      // optional tags
      tags: [
        /* ... */
      ],

      // additional optional fields show default values below:

      // (optional) concurrency configuration
      queueSize: 4,

      // (optional) size of each part, in bytes, at least 5MB
      partSize: 1024 * 1024 * 5,

      // (optional) when true, do not automatically call AbortMultipartUpload when
      // a multipart upload fails to complete. You should then manually handle
      // the leftover parts.
      leavePartsOnError: false,
    })

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log('In progress', progress)
    })

    await parallelUploads3.done()
  } catch (error) {
    console.error('Error uploading to S3:', error)
  }
}

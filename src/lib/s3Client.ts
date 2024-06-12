import { S3Client } from '@aws-sdk/client-s3'

interface S3Config {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
  accessKeyId: string
  secretAccessKey: string
  endpoint: string
  forcePathStyle: boolean
}

export class S3ClientSingleton {
  private static instance: any
  private s3: S3Client
  private constructor(config: S3Config) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
    })
  }

  public static getInstance(config: any) {
    if (!S3ClientSingleton.instance) {
      console.log('Creating S3 client')
      S3ClientSingleton.instance = new S3ClientSingleton(config)
    }

    return S3ClientSingleton.instance
  }

  getClient() {
    console.log('Returning S3 client')
    return this.s3
  }
}

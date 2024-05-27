import { createBillingInput } from '../repository/billing-repository'

export class RegisterBillingService {
  constructor(
    private parsePdf: any,
    private billingRepository: createBillingInput,
    private s3client: any,
    private uploadToS3: any,
  ) {}

  async execute(buffer: any, data: any) {
    const clientData = await this.parsePdf(buffer)
    if (!clientData) {
      throw new Error('Failed to parse PDF')
    }

    const billing =
      await this.billingRepository.findBillingByClientId(clientData)

    if (billing) {
      throw new Error('Billing already registered')
    }
    const billingCreated = await this.billingRepository.createBilling(
      clientData,
      data,
    )
    this.uploadToS3(data, 'client-billing', this.s3client)
    return billingCreated
  }
}

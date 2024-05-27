import { createBillingInput } from '../repository/billing-repository'

export class GetAllBillingService {
  constructor(private billingRepository: createBillingInput) {}

  async execute(clientNumber: string) {
    const billings =
      await this.billingRepository.getBillingByClientNumber(clientNumber)

    if (!billings) {
      throw new Error('No billings found')
    }

    return billings
  }
}

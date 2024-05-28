import { ClientData } from '../../utils/pdfParser'
import { createBillingInput } from '../billing-repository'

let billingData: ClientData[] = []

export class InMemoryBillingRepository implements createBillingInput {
  async getBillingByClientNumber(clientNumber: string): Promise<any | null> {
    const billing = billingData.filter(
      (billing) => billing.clientNumber === clientNumber,
    )

    if (!billing) {
      return null
    }

    return billing
  }

  async createBilling(clientData: ClientData, data: any): Promise<any> {
    const billing = {
      id: billingData.length + 1,
      clientNumber: clientData.clientNumber,
      monthYear: clientData.monthYear,
      date: new Date(clientData.date),
      totalAmount: clientData.amount,
      electricEnergyKwh: clientData.eletricEnergy.kwh,
      electricEnergyTarif: clientData.eletricEnergy.tarif,
      sceeEnergyKwh: clientData.energySCEEE.kwh,
      sceeEnergyTarif: clientData.energySCEEE.tarif,
      compensationKwh: clientData.energyCompensation.kwh,
      compensationTarif: clientData.energyCompensation.tarif,
      illuminationTax: clientData.iluminationTax.value,
      fileName: data.filename,
    }

    billingData.push(clientData)

    return billing
  }

  async findBillingByClientId(clientData: ClientData): Promise<any> {
    const billing = billingData.find(
      (billing) =>
        billing.clientNumber === clientData.clientNumber &&
        billing.monthYear === clientData.monthYear,
    )

    if (!billing) {
      return null
    }

    return billing
  }

  async clearBillingData(): Promise<void> {
    console.log('Clearing billing data', billingData)
    billingData = []
    console.log('Billing data cleared', billingData)
  }
}

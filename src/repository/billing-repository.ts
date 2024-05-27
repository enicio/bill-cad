import prisma from '@prisma/client'
import { ClientData } from '../utils/pdfParser'

export interface createBillingInput {
  createBilling(
    clientData: ClientData,
    data: any,
  ): Promise<prisma.ClientBilling>

  findBillingByClientId(
    clientData: ClientData,
  ): Promise<prisma.ClientBilling | null>

  getBillingByClientNumber(
    clientNumber: string,
  ): Promise<prisma.ClientBilling[] | null>
}

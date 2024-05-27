import Prisma from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { createBillingInput } from '../billing-repository'
import { ClientData } from '../../utils/pdfParser'
import { Decimal } from '@prisma/client/runtime/library'
import moment from 'moment'

export class CreateBillingRepository implements createBillingInput {
  async getBillingByClientNumber(clientNumber: string): Promise<
    | {
        id: number
        clientNumber: string
        monthYear: string
        date: Date
        totalAmount: Decimal
        electricEnergyKwh: Decimal
        electricEnergyTarif: Decimal
        sceeEnergyKwh: Decimal
        sceeEnergyTarif: Decimal
        compensationKwh: Decimal
        compensationTarif: Decimal
        illuminationTax: Decimal
        fileName: string
      }[]
    | null
  > {
    const allBillings = prisma.clientBilling.findMany({
      where: {
        clientNumber,
      },
    })
    return allBillings
  }

  async findBillingByClientId(clientData: ClientData): Promise<{
    id: number
    clientNumber: string
    monthYear: string
    date: Date
    totalAmount: Decimal
    electricEnergyKwh: Decimal
    electricEnergyTarif: Decimal
    sceeEnergyKwh: Decimal
    sceeEnergyTarif: Decimal
    compensationKwh: Decimal
    compensationTarif: Decimal
    illuminationTax: Decimal
    fileName: string
  } | null> {
    const isbillingAlreadyRegistred = prisma.clientBilling.findFirst({
      where: {
        clientNumber: clientData.clientNumber,
        AND: {
          monthYear: clientData.monthYear,
        },
      },
    })

    return isbillingAlreadyRegistred
  }

  async createBilling(
    clientData: ClientData,
    data: any,
  ): Promise<Prisma.ClientBilling> {
    // TODO: Refactor this to a helper function
    const date = moment(clientData.date, 'DD/MM/YYYY', true)
    const clientBilling = await prisma.clientBilling.create({
      data: {
        clientNumber: clientData.clientNumber,
        monthYear: clientData.monthYear,
        date: date.toDate(),
        totalAmount: clientData.amount,
        electricEnergyKwh: clientData.eletricEnergy.kwh,
        electricEnergyTarif: clientData.eletricEnergy.tarif,
        sceeEnergyKwh: clientData.energySCEEE.kwh,
        sceeEnergyTarif: clientData.energySCEEE.tarif,
        compensationKwh: clientData.energyCompensation.kwh,
        compensationTarif: clientData.energyCompensation.tarif,
        illuminationTax: clientData.iluminationTax.value,
        fileName: data.filename,
      },
    })

    return clientBilling
  }
}

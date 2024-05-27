import { jest, describe, it, expect, beforeEach } from '@jest/globals'
import { RegisterBillingService } from './register-billing'
import { InMemoryBillingRepository } from '../repository/in-memory/in-memory-billing'

describe('registerBilling', () => {
  beforeEach(() => {
    const billingRepository = new InMemoryBillingRepository()
    billingRepository.clearBillingData()
  })

  it('should create a new billing', async () => {
    const s3Client = {
      upload: jest.fn(),
    }

    const uploadToS3 = jest.fn()

    const parsePDF = jest.fn().mockReturnValue({
      clientNumber: '7202788969',
      monthYear: 'FEV/2023',
      date: '08/03/2023',
      amount: 161.3,
      eletricEnergy: { kwh: '100', tarif: '0.83394409', value: '83.38' },
      energySCEEE: { kwh: '0', tarif: '0', value: '0' },
      energyCompensation: { kwh: '0', tarif: '0', value: '0' },
      iluminationTax: { value: '35.92' },
    })

    const data = {
      filename: 'test.pdf',
      toBuffer: jest.fn().mockReturnValue(Promise.resolve('')),
    }

    const buffer = await data.toBuffer()
    const billingRepository = new InMemoryBillingRepository()
    const registerBillingService = new RegisterBillingService(
      parsePDF,
      billingRepository,
      s3Client,
      uploadToS3,
    )
    const clientData = await registerBillingService.execute(buffer, data)

    expect(clientData).toEqual({
      id: 1,
      clientNumber: '7202788969',
      monthYear: 'FEV/2023',
      date: new Date('2023-08-03T03:00:00.000Z'),
      totalAmount: 161.3,
      electricEnergyKwh: '100',
      electricEnergyTarif: '0.83394409',
      sceeEnergyKwh: '0',
      sceeEnergyTarif: '0',
      compensationKwh: '0',
      compensationTarif: '0',
      illuminationTax: '35.92',
      fileName: 'test.pdf',
    })
  })

  it('should throw an error when the billing is already registered', async () => {
    const s3Client = {
      upload: jest.fn(),
    }

    const uploadToS3 = jest.fn()

    const parsePDF = jest.fn().mockReturnValue({
      clientNumber: '7202788969',
      monthYear: 'FEV/2023',
      date: '08/03/2023',
      amount: 161.3,
      eletricEnergy: { kwh: '100', tarif: '0.83394409', value: '83.38' },
      energySCEEE: { kwh: '0', tarif: '0', value: '0' },
      energyCompensation: { kwh: '0', tarif: '0', value: '0' },
      iluminationTax: { value: '35.92' },
    })

    const data = {
      filename: 'test.pdf',
      toBuffer: jest.fn().mockReturnValue(Promise.resolve('')),
    }

    const buffer = await data.toBuffer()
    const billingRepository = new InMemoryBillingRepository()
    const registerBillingService = new RegisterBillingService(
      parsePDF,
      billingRepository,
      s3Client,
      uploadToS3,
    )
    await registerBillingService.execute(buffer, data)

    try {
      await registerBillingService.execute(buffer, data)
    } catch (error: any) {
      expect(error.message).toBe('Billing already registered')
    }
  })

  it('should throw an error when the file is not uploaded', async () => {
    const s3Client = {
      upload: jest.fn(),
    }

    const uploadToS3 = jest.fn()

    const parsePDF = jest.fn().mockReturnValue(undefined)

    const data = {
      filename: 'test.pdf',
      toBuffer: jest.fn().mockReturnValue(Promise.resolve('')),
    }

    const buffer = await data.toBuffer()
    const billingRepository = new InMemoryBillingRepository()
    const registerBillingService = new RegisterBillingService(
      parsePDF,
      billingRepository,
      s3Client,
      uploadToS3,
    )

    expect(async () => {
      await registerBillingService.execute(buffer, data)
    }).rejects.toThrow('Failed to parse PDF')
  })
})

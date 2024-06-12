import { FastifyInstance } from 'fastify'
import {
  handleGetAssets,
  handleGetBilling,
  handleRegisterBill,
} from './controllers/register-bills'

export async function routes(app: FastifyInstance) {
  app.post('/register-bill', handleRegisterBill)
  app.get('/assets/:fileId', handleGetAssets)
  app.get('/billing/:clientNumber', handleGetBilling)
}

/* eslint-disable prettier/prettier */
import { expect, it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })


    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new transaction', async () => {
        /* Fazer a chamada HTTP p/ criar uma nova transação */

        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Governo de Minas Gerais',
                amount: 5000,
                type: 'credit',
            })

        /* Validação */
        expect(response.statusCode).toEqual(201)

    })
})



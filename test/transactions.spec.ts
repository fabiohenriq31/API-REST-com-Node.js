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

        await request(app.server)
            .post('/transactions')
            .send({
                title: 'Governo de Minas Gerais',
                amount: 5000,
                type: 'credit',
            })/* Validação */
            .expect(201)

    })

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Governo de Minas Gerais',
                amount: 5000,
                type: 'credit',
            })

        const cookies: string[] = createTransactionResponse.get('Set-Cookie') as string[];

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)
        expect(listTransactionsResponse.body.transactions).toEqual([

            expect.objectContaining({
                title: 'Governo de Minas Gerais',
                amount: 5000,
            })
        ])
    })
})
/* eslint-disable prettier/prettier */
import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })


    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --a')
        execSync('npm run knex migrate:latest')

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
    it('should be able to get a specific transaction', async () => {
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

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const geTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(geTransactionResponse.body.transaction).toEqual(

            expect.objectContaining({
                title: 'Governo de Minas Gerais',
                amount: 5000,
            })
        )
    })
    it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Governo de Minas Gerais',
                amount: 5000,
                type: 'credit',
            })

        const cookies: string[] = createTransactionResponse.get('Set-Cookie') as string[];

        await request(app.server)
            .post('/transactions')
            .set('Cookie', cookies)
            .send({
                title: 'Mecanica Sol e chuva',
                amount: 500,
                type: 'debit',
            })

        const sumarryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)

        expect(sumarryResponse.body.summary).toEqual({
            amount: 4500
        })
    })
})
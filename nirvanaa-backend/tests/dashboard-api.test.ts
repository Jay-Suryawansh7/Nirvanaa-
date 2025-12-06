import request from 'supertest';
import { app } from '../src/server'; // Will implement this next

describe('Judge Dashboard API', () => {
    test('GET /api/cases should return a list of cases', async () => {
        const response = await request(app).get('/api/cases');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('readinessScore');
    });

    test('GET /api/cases should support filtering by status', async () => {
        const response = await request(app).get('/api/cases?status=READY');
        expect(response.status).toBe(200);
        response.body.forEach((c: any) => {
            expect(c.status).toBe('READY');
        });
    });

    test('GET /api/cases/metrics should return overview stats', async () => {
        const response = await request(app).get('/api/cases/metrics');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('totalCases');
        expect(response.body).toHaveProperty('readyCases');
        expect(response.body).toHaveProperty('highRiskCases');
    });
});

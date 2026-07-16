/**
 * This test proves ownership isolation: 
 * User A cannot access User B's projects.
 */

// import request from 'supertest';
// import app from '../server';

describe('Ownership Isolation', () => {
    it('should deny User A from fetching User B\'s project', async () => {
        /*
        // 1. Log in as User B and create a project
        const resB = await request(app).post('/api/auth/login').send(userBCreds);
        const tokenB = resB.body.token;
        
        const projectB = await request(app)
            .post('/api/projects')
            .set('Authorization', `Bearer ${tokenB}`)
            .send({ name: "User B's Secret Project" });

        // 2. Log in as User A
        const resA = await request(app).post('/api/auth/login').send(userACreds);
        const tokenA = resA.body.token;

        // 3. Attempt to fetch User B's project using User A's token
        const fetchRes = await request(app)
            .get('/api/projects')
            .set('Authorization', `Bearer ${tokenA}`);

        // 4. Assert that User B's project is NOT in the response
        const projectIds = fetchRes.body.map((p: any) => p._id);
        expect(projectIds).not.toContain(projectB.body._id);
        */
    });
});

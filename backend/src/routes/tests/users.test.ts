import {server, app} from "../../server.ts";
import request from "supertest";
import { users } from "../../../data.ts";
import { userErrors } from "../users.ts";

afterAll((done) => {
    server.close(done)
});

// GET all users
describe('GET /api/users', () => {
    it('responds with json', async () => {
        const res = await request(app).get('/api/users')
        expect(res.body).toEqual(users)
        expect(res.statusCode).toBe(200)
    });
});

// GET specific user
describe('GET /api/users/:id', () => {
    describe('responds with json for user if it exists', () => {
        it('1', async () => {
            const res = await request(app).get('/api/users/1')
            expect(res.body).toEqual(users[0])
            expect(res.statusCode).toBe(200)
        });
        it('2', async () => {
            const res = await request(app).get('/api/users/2')
            expect(res.body).toEqual(users[1])
            expect(res.statusCode).toBe(200)
        });
    })

    describe('responds with error message if specified user id does not exist', () => {
        it('1', async () => {
            const res = await request(app).get('/api/users/100')
            expect(res.body).toEqual(userErrors.invalidId('100'))
            expect(res.statusCode).toBe(404)
        })
    })
});

// PATCH update single user's information (not lists)
describe('PATCH /api/users/:id', () => {
    describe('responds with json for updated user for valid existing user id', () => {
        it('1', async () => {
            const updatedUserBody = {
                email: 'zichington@gmail.com'
            }
            const res = await request(app)
                .patch('/api/users/1')
                .send(updatedUserBody)
                .set('Accept', 'application/json')
    
            expect(res.status).toEqual(200);
    
            const updatedUser = {
                ...users[0],
                ...updatedUserBody
            }
    
            expect(res.body).toEqual(updatedUser)
        })
        it('2', async () => {
            const updatedUserBody = {
                name: "Christina O'Sullivan"
            }
            const res = await request(app)
                .patch('/api/users/2')
                .send(updatedUserBody)
                .set('Accept', 'application/json')
    
            expect(res.status).toEqual(200);
    
            const updatedUser = {
                ...users[1],
                ...updatedUserBody
            }
    
            expect(res.body).toEqual(updatedUser)
        })
    });

    describe('responds with error message if specified user id does not exist', () => {
        it('1', async () => {
            const res = await request(app).patch('/api/users/100')
                .send({name: 'Eeby Deeby'})
                .set('Accept', 'application/json')

            expect(res.body).toEqual(userErrors.invalidId('100'))
            expect(res.statusCode).toBe(400)
        })
    })
});

// POST create new user
describe('POST /api/users/', () => {
    describe('responds with json for newly created user if all fields are validly filled', () => {
        it('1', async () => {
            const newUserBody = {
                name: 'kirby',
                email: 'kirby@gmail.com'
            }
            const res = await request(app)
                .post('/api/users')
                .send(newUserBody)
                .set('Accept', 'application/json')
    
            expect(res.status).toEqual(200);

            expect(res.body.id).toBeDefined()
            expect(res.body.name).toEqual(newUserBody.name)
            expect(res.body.email).toEqual(newUserBody.email)
            expect(res.body.lists).toEqual([])
        })
    });

    describe('responds with error message if not all values are filled', () => {
        it('1', async () => {
            const res = await request(app).post('/api/users')
                .send({name: 'Eeby Deeby'})
                .set('Accept', 'application/json')

            expect(res.statusCode).toBe(400)
            expect(res.body).toEqual(userErrors.emptyField)
        })
    })
});

// DELETE single user
describe('DELETE /api/users/:id', () => {
    it('responds with json for user if it exists', async () => {
        const res = await request(app).delete('/api/users/2')
        expect(res.body.length).toEqual(2)
        expect(res.statusCode).toBe(200)
    })

    it('responds with error message if specified user id does not exist', async () => {
        const res = await request(app).delete('/api/users/100')
        expect(res.body).toEqual(userErrors.invalidId('100'))
        expect(res.statusCode).toBe(400)
    })
});

/** /users/:id/wishlist  tests */

// POST add user wishlist
describe('POST /api/users/:id/wishlist', () => {
    it('creates new wishlist for valid existing user id', async () => {
        const newWishlist = {
            title: 'other books',
            bookIds: ['7']
        }
        const res = await request(app).post('/api/users/1/wishlist/')
            .send(newWishlist)
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toEqual(newWishlist.title)
        expect(res.body.bookIds).toEqual(newWishlist.bookIds)
    })
    it('responds with error message if specified user id does not exist', async () => {
        const newWishlist = {
            title: 'other books',
            bookIds: ['7']
        }
        const res = await request(app).post('/api/users/100/wishlist/')
            .send(newWishlist)
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(userErrors.invalidId('100'))
    })
})

describe('DELETE /api/users/:id/wishlist/:wishlistId', () => {
    it('deletes existing wishlist for valid existing user id', async () => {
        expect(users[0].lists.length).toBe(3)
        
        const res = await request(app).delete('/api/users/1/wishlist/2')

        expect(res.status).toEqual(200);
        expect(users[0].lists.length).toBe(2)
        expect(res.body.length).toBe(2)
    })

    it('responds with error message if specified user id does not exist', async () => {
        const res = await request(app).delete('/api/users/100/wishlist/1')
        expect(res.status).toEqual(400);
        expect(res.body).toEqual(userErrors.invalidId('100'))
    })

    it('responds with error message if specified user id does exist but wishlist does not', async () => {
        const res = await request(app).delete('/api/users/1/wishlist/100')

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(userErrors.invalidWishlistId('100'))
    })
})

// PUT update user wishlist
describe('PUT /api/users/:id/wishlist/:wishlistId', () => {
    it('updates existing wishlist for valid existing user id', async () => {
        const newWishlist = {
            title: 'READ!!!',
            bookIds: ['1', '2', '4', '5']
        }
        const res = await request(app).put('/api/users/1/wishlist/1')
            .send(newWishlist)
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200);
        expect(res.body.id).toBeDefined()
        expect(res.body.title).toEqual(newWishlist.title)
        expect(res.body.bookIds).toEqual(newWishlist.bookIds)
    })

    it('responds with error message if specified user id does not exist', async () => {
        const res = await request(app).put('/api/users/100/wishlist/1')
            .send({title: 'blah'})
            .set('Accept', 'application/json')
        
        expect(res.status).toEqual(400);
        expect(res.body).toEqual(userErrors.invalidId('100'))
    })

    it('responds with error message if specified user id does exist but wishlist does not', async () => {
        const res = await request(app).put('/api/users/1/wishlist/100')
            .send({title: 'blah'})
            .set('Accept', 'application/json')

        expect(res.status).toEqual(400);
        expect(res.body).toEqual(userErrors.invalidWishlistId('100'))
    })
})

import {server, app} from "../../server.ts";
import request from "supertest";
import { errorMsg } from "../books.ts";
import { TBook } from "../../types/types.ts";
import { books } from "../../../data.ts";

// let books: TBook[];

// reread data from saved file before each test 
// beforeEach(() => {
//     jest.resetModules();
//     books = require('../../../data.ts').books
// })

afterAll((done) => {
    server.close(done)
});

describe('GET /api/books', () => {
    it('responds with json for all books', async () => {
        const res = await request(app).get('/api/books')
        expect(res.body).toEqual(books)
        expect(res.statusCode).toBe(200)
    });
});

// Todo - see v2 for real database tests
describe('GET /api/books?queryParams', () => {
    it('responds with json for all books', async () => {
    });
});

describe('GET /api/books/:id', () => {
    describe('responds with json for book if it exists', () => {
        it('1', async () => {
            const res = await request(app).get('/api/books/1')
            expect(res.body).toEqual(books[0])
            expect(res.statusCode).toBe(200)
        });
        it('2', async () => {
            const res = await request(app).get('/api/books/5')
            expect(res.body).toEqual(books[4])
            expect(res.statusCode).toBe(200)
        });
    })

    describe('responds with error message if specified bookId does not exist', () => {
        it('1', async () => {
            const res = await request(app).get('/api/books/100')
            expect(res.body).toEqual(errorMsg.invalidBookId)
            expect(res.statusCode).toBe(404)
        })
        it('1', async () => {
            const res = await request(app).get('/api/books/fart')
            expect(res.body).toEqual(errorMsg.invalidBookId)
            expect(res.status).toBe(404)
        })
    })
});

describe('POST /api/books', () => {
    it('responds with json for newly created book if all fields are validly filled', async () => {
        const newBookBody = {
            title: 'newBook',
            description: 'blah',
            author: 'authorName',
            genres: ['genre1', 'genre2']
        }

        const res = await request(app)
            .post('/api/books')
            .send(newBookBody)
            .set('Accept', 'application/json')

        expect(res.status).toEqual(200);

        expect(res.body.id).toBeDefined()
        expect(res.body.title).toEqual(newBookBody.title)
        expect(res.body.description).toEqual(newBookBody.description)
        expect(res.body.author).toEqual(newBookBody.author)
        expect(res.body.genres).toEqual(newBookBody.genres)
    });

    it('responds with error message if any required fields are missing', async () => {
        const newBookBody = {
            description: 'blah',
            genres: ['genre1', 'genre2']
        }

        const res = await request(app)
            .post('/api/books')
            .send(newBookBody)
            .set('Accept', 'application/json')

        expect(res.body).toEqual(errorMsg.emptyField)
        expect(res.statusCode).toBe(400)
    });
});

// TODO: note: this now has 11 items after the post request from previous test
// not sure if this is good testing solution?

describe('DELETE /api/books/:id', () => {
    describe('responds with remaining books if valid id', () => {
        it('1', async () => {
            const res = await request(app).delete('/api/books/10')
            expect(res.body.length).toEqual(10)
            expect(res.statusCode).toBe(200)
        })
        it('2', async () => {
            const res = await request(app).delete('/api/books/1')
            expect(res.body.length).toEqual(9)
            expect(res.statusCode).toBe(200)
        })
    });

    it('responds with error if bookId requested to delete does not exist', async () => {
        const res = await request(app).delete('/api/books/100')
        expect(res.body).toEqual(errorMsg.invalidBookId)
        expect(res.statusCode).toBe(400)
    });

});
import {server, app} from "../../server.ts";
import request from "supertest";
import express, { Application } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import { books } from "../../../data.ts";

afterAll((done) => {
    server.close(done)
});


describe('GET /api/books', () => {
    it('responds with json', async () => {
        const res = await request(app).get('/api/books')
        expect(res.body).toEqual(books)
        expect(res.statusCode).toBe(200)
        // .set('Accept', 'application/json')
        // .expect('Content-Type', /json/)
        // .expect(200, done);
    });
});

// get all users
// get specific user
// PATCH update single user's information (not lists)
// POST add single user
// DELETE delete single user
// POST add user wishlist
// PUT update user wishlist (add book, remove books, delete wishlist)

import express, { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { TBook } from '../types/types.ts'
import { books } from '../../data.ts'

const bookRoutes: Router = express.Router()

export const errorMsg = {
    invalidBookId: { message: "error: no book of that id found"},
    emptyField: { message: "Error: please fill all fields" }
}

// get all books, process query params
// not refined - see v2 for better implementation
bookRoutes.get('/', (req: Request, res: Response) => {
    let booksWithQuery: TBook[] = [...books]

    // Todo: split into 1 fn (possible dynamic lookup of key?)
    if (typeof req.query.title === "string") {
        const titleQuery = req.query.title ?? ''
        booksWithQuery = books.filter(book => book.title.toLocaleLowerCase() === titleQuery.toLocaleLowerCase())
    } 
    if (typeof req.query.author === "string") {
        const authorQuery = req.query.author ?? ''
        booksWithQuery = booksWithQuery.filter(book => book.author.toLocaleLowerCase() === authorQuery.toLocaleLowerCase())
    } 
    if (typeof req.query.genre === "string") {
        const authorQuery = req.query.genre ?? ''
        booksWithQuery = booksWithQuery.filter(book => book.genres.includes(authorQuery))
    }

    res.json(booksWithQuery)
})

// get book by id
bookRoutes.get('/:id', (req: Request, res: Response) => {
    const [ book ] = books.filter(book => book.id === req.params.id)
    book ? res.status(200).json(book) : res.status(404).json(errorMsg.invalidBookId)
})

// add new book
bookRoutes.post('/', (req: Request, res: Response) => {
    const { title, description, author, genres } = req.body
    const isValuesFilled = title && description && author && genres

    const newBook: TBook = {
        id: uuidv4(),
        title: title || null,
        description: description || null,
        author: author|| null,
        genres: genres || []
    }

    isValuesFilled ? books.push(newBook) && res.json(newBook)
        : res.status(400).json(errorMsg.emptyField)
})

// delete book
bookRoutes.delete('/:id', (req: Request, res: Response) => {
    const deleteBookIndex = books.findIndex(book => book.id === req.params.id)
    const bookDeleted = deleteBookIndex !== -1
    bookDeleted ? books.splice(deleteBookIndex - 1, 1) && res.status(200).json(books) : res.status(400).json(errorMsg.invalidBookId)
})

export default bookRoutes
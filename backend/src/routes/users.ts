import express, { Response, Request, Router } from "express";
import { users } from '../../data.ts'
import { TList, TUser } from "../types/types.ts";
import { v4 as uuidv4 } from 'uuid'

const userRoutes: Router = express.Router()

export const userErrors = {
    invalidId: (id: string) => { return { error: `No user of id ${id} found`} },
    invalidWishlistId: (id: string) => { return { error: `No wishlist of id ${id} found`} },
    emptyField: { message: "Error: please fill all fields" }
}

// GET all users
userRoutes.get('/', (req: Request, res: Response) => {
    res.json(users)
})

// GET specific user
userRoutes.get('/:id', (req: Request, res: Response) => {
    const user = users.find(user => user.id === req.params.id)
    user ? res.status(200).json(user) : res.status(404).json(userErrors.invalidId(req.params.id))
})

// PATCH udpate single user's information (not lists)
userRoutes.patch('/:id', (req: Request, res: Response) => {
    const user = users.find(user => user.id === req.params.id)

    const updateUser = (users: TUser[], req: Request) => {
        const updated = req.body
        users.forEach((user) => {
            if (user.id === req.params.id) {
                user.name = updated.name || user.name,
                user.email = updated.email || user.email
            }
        })
        res.status(200).json(user)
    }

    user ? updateUser(users, req)
        : res.status(400).json({error: `No user of id ${req.params.id} found`})
})

// POST add single user
userRoutes.post('/', (req: Request, res: Response) => {
    const { name, email } = req.body
    const isValuesFilled = name && email

    const newUser: TUser = {
        id: uuidv4(),
        name: name,
        email: email,
        lists: []
    }

    isValuesFilled ? users.push(newUser) && res.json(newUser)
        : res.status(400).json(userErrors.emptyField)
})

// DELETE delete single user
userRoutes.delete('/:id', (req: Request, res: Response) => {
    const deleteUserIndex = users.findIndex(user => user.id === req.params.id)
    const userDeleted = deleteUserIndex !== -1
    userDeleted ? users.splice(deleteUserIndex, 1) && res.status(200).json(users) : res.status(400).json(userErrors.invalidId(req.params.id))
})

// POST add user wishlist
userRoutes.post('/:id/wishlist/', (req: Request, res: Response) => {
    const newWishList: TList = {
        id: uuidv4(),
        title: req.body.title as string || 'untitled',
        bookIds: [...req.body.bookIds as string] || [] 
    }
    const userIndex = users.findIndex(user => user.id === req.params.id)

    if (userIndex === -1) { 
        res.status(400).json(userErrors.invalidId(req.params.id))
    } else {
        users[userIndex].lists.push(newWishList)
        res.status(200).json(users[userIndex].lists.at(-1))
    }
})

// DELETE delete user wishlist
userRoutes.delete('/:id/wishlist/:wishlistId', (req: Request, res: Response) => {
    const userIndex = users.findIndex(user => user.id === req.params.id)

    if (userIndex === -1) { 
        res.status(400).json(userErrors.invalidId(req.params.id))
    } else {
        const remainingWishlists = users[userIndex].lists.filter(list => list.id !== req.params.wishlistId)
    
        if (remainingWishlists.length === users[userIndex].lists.length) { 
            res.status(400).json(userErrors.invalidWishlistId(req.params.wishlistId))
        } else {
            users[userIndex].lists = remainingWishlists
            res.status(200).json(users[userIndex].lists)
        }
    }
})

// PUT update user wishlist (add book, remove books, delete wishlist)
userRoutes.put('/:id/wishlist/:wishlistId', (req: Request, res: Response) => {
    const userIndex = users.findIndex(user => user.id === req.params.id)

    if (userIndex === -1) { 
        res.status(400).json(userErrors.invalidId(req.params.id))
    } else {
        const wishlistIndex = users[userIndex].lists.findIndex(list => list.id === req.params.wishlistId)
        
        if (wishlistIndex === -1) { res.status(400).json(userErrors.invalidWishlistId(req.params.wishlistId))}

        else {
            const updatedWishlist: TList = {
                id: users[userIndex].lists[wishlistIndex].id,
                title: req.body.title || users[userIndex].lists[wishlistIndex].title,
                bookIds: req.body.bookIds || users[userIndex].lists[wishlistIndex].bookIds
            }

            users[userIndex].lists[wishlistIndex] = updatedWishlist
            res.status(200).json(users[userIndex].lists[wishlistIndex])
        }
    }
})

export default userRoutes
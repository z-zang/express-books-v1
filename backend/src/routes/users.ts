import express, { Response, Request, Router } from "express";
import { users } from '../../data.ts'
import { TList, TUser } from "../types/types.ts";
import { v4 as uuidv4 } from 'uuid'

const userRoutes: Router = express.Router()

export const userErrors = {
    invalidId: (id: string) => `No user of id ${id} found` 
}

// get all users
userRoutes.get('/', (req: Request, res: Response) => {
    res.json(users)
})

// get specific user
userRoutes.get('/:id', (req: Request, res: Response) => {
    const user = users.find(user => user.id === req.params.id)
    res.json(user || { error: `No user of id ${req.params.id} found` })
})

// update single user's information (not lists)
userRoutes.patch('/:id', (req: Request, res: Response) => {
    const user = users.find(user => user.id === req.params.id)

    const updateUser = (users: TUser[], req: Request) => {
        const updated = req.body
        users.forEach((user) => {
            if (user.id === updated.id) {
                user.name = updated.name || user.name,
                user.email = updated.email || user.email
            }
        })
        res.json(user)
    }

    user ? updateUser(users, req) : res.json({error: `No user of id ${req.params.id} found`})
})

// add single user
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
        : res.status(400).json({message: "Error: please fill all fields"})
})

// delete single user
userRoutes.delete('/:id', (req: Request, res: Response) => {
    const deleteUserIndex = users.findIndex(user => user.id === req.params.id)
    const userDeleted = deleteUserIndex !== -1
    userDeleted ? users.splice(deleteUserIndex - 1, 1) && res.status(200).json(users) : res.status(400).json(userErrors.invalidId(req.params.id))
})


// add user wishlist
userRoutes.post('/:id/wishlist/', (req: Request, res: Response) => {
    const newWishList: TList = {
        id: uuidv4(),
        title: req.body.title as string || 'untitled',
        bookIds: [...req.body.bookIds as string] || [] 
    }

    const userIndex = users.findIndex(user => user.id === req.params.id)
    users[userIndex].lists = [...users[userIndex].lists, newWishList]

    res.json(users[userIndex].lists)
})

// delete user wishlist
userRoutes.delete('/:id/wishlist/:wishlistId', (req: Request, res: Response) => {
    const userIndex = users.findIndex(user => user.id === req.params.id)
    const remainingWishlists = users[userIndex].lists.filter(list => list.id !== req.params.wishlistId)
    
    if (remainingWishlists.length === users[userIndex].lists.length) { 
        res.json({error: 'no wishlist of that id found'})
    }

    users[userIndex].lists = remainingWishlists
    res.json(users[userIndex].lists)
})

// update user wishlist (add book, remove books, delete wishlist)
userRoutes.put('/:id/wishlist/:wishlistId', (req: Request, res: Response) => {
    const userIndex = users.findIndex(user => user.id === req.params.id)
    const wishlistIndex = users[userIndex].lists.findIndex(list=> list.id === req.query.wishlistId)

    const updatedWishlist: TList = {
        id: users[userIndex].lists[wishlistIndex].id,
        title: users[userIndex].lists[wishlistIndex].title || req.body.title,
        bookIds: users[userIndex].lists[wishlistIndex].bookIds || req.body.bookIds
    }

    users[userIndex].lists[wishlistIndex] = updatedWishlist

    res.json(users[userIndex].lists[wishlistIndex])
})

export default userRoutes
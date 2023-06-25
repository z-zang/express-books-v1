export type TBook = {
    id: string,
    title: string,
    description: string,
    author: string,
    genres: string[]
}

export type TList = {
    id: string,
    title: string,
    bookIds: string[]
}

export type TUser = {
    id: string,
    name: string,
    email: string,
    lists: TList[]
}
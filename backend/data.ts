import { TBook, TUser } from "./src/types/types.ts"

export const books: TBook[] = [
    {
        id: '1',
        title: "Milk Fed",
        description: "A scathingly funny, wildly erotic, and fiercely imaginative story about food, sex, and god.",
        author: "Melissa Broder",
        genres: ['fiction', 'queer', 'romance', 'lesbian', 'humour']
    },
    {
        id: "2",
        title: "Tell Me I'm Worthless",
        description: "A multi-layered, extremely graphic horror novel that tackles themes of trans identity and the rise of fascism.",
        author: "Alison Rumfitt",
        genres: ['horror', 'fiction', 'queer', 'gothic', 'transgender']
    },
    {
        id: "3",
        title: "Detransition, Baby",
        description: "Navigating the complicated waters of family-making and motherhood in the twenty-first century, this exciting and very funny debut follows the lives of three trans and cis women living in New York.",
        author: "Torrey Peters",
        genres: ['fiction', 'queer', 'transgender']
    },
    {
        id: "4",
        title: "Stone Butch Blues",
        description: "",
        author: "Leslie Feinberg",
        genres: ['fiction']
    },
    {
        id: "5",
        title: "Fun Home",
        description: "",
        author: "Alison Bechdel",
        genres: ['nonfiction', 'memoir', 'graphic-novel']
    },
    {
        id: "6",
        title: "My Dark Vanessa",
        description: "",
        author: "Kate Elizabeth Russell",
        genres: ['fiction']
    },
    {
        id: "7",
        title: "Crying in H Mart",
        description: "",
        author: "Michelle Zauner",
        genres: []
    },
    {
        id: "8",
        title: "I'm Glad My Mom Died",
        description: "A heartbreaking and hilarious memoir by iCarly and Sam & Cat star Jennette McCurdy about her struggles as a former child actor and how she retook control of her life.",
        author: "Jennette McCurdy",
        genres: ['nonfiction', 'memoir', 'mental health', 'humour']
    },
    {
        id: "9",
        title: "Queerly Autistic",
        description: "In this empowering and honest guide for LGBTQIA+ autistic teens, Erin Ekins gives you all the tools you need to figure out and explore your gender identity and sexuality.",
        author: "Erin Ekins",
        genres: ['nonfiction', 'memoir']
    },
    {
        id: "10",
        title: "Tampa",
        description: "",
        author: "Alissa Nutting",
        genres: ['fiction']
    }
]

export const users: TUser[] = [
    {
        id: "1",
        name: 'Zichao Zang',
        email: 'zichao@zang.com',
        lists: [
            {
                id: '1',
                title: 'read',
                bookIds: ['1', '2', '5']
            },
            {   
                id: '2',
                title: 'want to read',
                bookIds: ['3', '6', '8']
            }
        ]
    },
    {
        id: "2",
        name: 'Christina OS',
        email: 'christina@gmail.com',
        lists: [
            {   
                id: '1',
                title: 'read',
                bookIds: ['2']
            },
            {
                id: '2',
                title: 'want to read',
                bookIds: ['8']
            }
        ]
    }
]
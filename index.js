import {ApolloServer, gql} from 'apollo-server'
import {v1 as uuid} from 'uuid'

const students = [
    {
        name: "Adrian",
        phone: "50688288542",
        age: "20",
        birthday: "3/8/2002",
        city : "Heredia",
        country: "Costa Rica"
    },
    {
        name: "Cinthia",
        phone: "50688418345",
        age: "20",
        birthday: "10/8/1982",
        city : "Heredia",
        country: "Costa Rica"
    },
    {
        name: "John",
        phone: "56188288542",
        age: "40",
        birthday: "3/8/1982",
        city : "West Palm Beach",
        country: "United States"
    },
    {
        name: "Tom",
        phone: "561842612",
        age: "19",
        birthday: "3/8/2002",
        city : "Cancun",
        country: "Mexico"
    },
    {
        name: "Josh",
        phone: "588288542",
        age: "20",
        birthday: "3/8/2002",
        city : "Paris",
        country: "France"
    },
]

const typeDefs = gql`
    type Address {
        city: String!
        country: String!
    }
    type Student {
        name: String!
        phone: String
        age: String!
        birthday: String
        address: Address!
    }

    type Query {
        studentCount: Int!
        allStudents: [Student]!
        findStudent(name: String!): Student
    }

    type Mutation {
        addStudent(
            name: String!
            phone: String
            age: String!
            birthday: String
            city: String!
            country: String!
        ): Student
    }
`

const resolvers = {
    Query: {
        studentCount: () => students.length,
        allStudents: () => students,
        findStudent: (root, args) => {
            const {name} = args
            return students.find(student => student.name === name)
        }
    },

    Mutation: {
        addStudent: (root, args) => {
            if (students.find(p => p.name === args.name)) {
                throw new Error("Name must be unique")
            }
            const student = {... args, id: uuid()}
            students.push(student)  //update "database" with new student
            return student
        }
    },

    Student: {
        address: (root) => {
            return {
                city: root.city,
                country: root.country
            } 
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})
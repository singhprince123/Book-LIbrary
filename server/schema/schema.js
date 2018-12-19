const graphql = require('graphql');
const _= require('lodash');

const Book = require('../models/book');
const Author = require('../models/author')


// var books = [
//     {name: 'flying rani', genere: 'fantasy', id: '1', authId: '1'},
//     {name: 'flying rani3', genere: 'fantasy', id: '2', authId: '2'},
//     {name: 'flying rani 2', genere: 'game', id: '3', authId: '3'},
//     {name: 'singh rani ', genere: 'game', id: '4', authId: '3'},
//     {name: 'hero rani', genere: 'romance', id: '5', authId: '2'},
// ]

// let authors = [
//     {name: 'prince', id: '1', age: 23},
//     {name : 'sunil', id: '2', age: 43},
//     {name: 'prem' , id: '3', age: 34}
// ]

const { GraphQLObjectType,
      GraphQLString,
      GraphQLSchema,
      GraphQLID, 
      GraphQLInt,
      GraphQLList,
      GraphQLNonNull} = graphql;  

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genere: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
            console.log(parent)

            // return _.find(authors, {id : parent.authId })

            return Author.findById(parent.authId);

            }}
    })

});

const AuthorType = new GraphQLObjectType({
    name: 'Author', 
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age : {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){

                // return _.filter(books, {authId : parent.id})
                return Book.find({authId: parent.id});
            }
        }
    })

});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book:{
            type: BookType,
            args: {id : {type: GraphQLID}},
            resolve( parent, args){
                // code to get book
                console.log(typeof args.id)
                // return _.find(books ,{id : args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type: AuthorType,
            args: {id : {type: GraphQLID}},
            resolve(parent, args){

                // return _.find(authors, {id : args.id})
                return Author.findById(args.id);
            }
        } ,
        books : {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){

                // return authors; 
                return Author.find({})
            }
        }      
    }
});

const Mutation = new GraphQLObjectType({
     name:'Mutation',
     fields: {
         addAuthor: {
             type: AuthorType,
             args: {
                 name: {type:new GraphQLNonNull( GraphQLString )},
                 age: {type: new GraphQLNonNull(GraphQLInt)}
             },
             resolve(parent, args){
                 let author = new Author({
                    name: args.name,
                    age: args.age
                 });
                 return author.save();
                 
             }
         },

         addBook: {
             type: BookType,
             args: {
                 name: {type: new GraphQLNonNull(GraphQLString)},
                 genere: {type:new GraphQLNonNull( GraphQLString)},
                 authId: {type: new GraphQLNonNull(GraphQLID)}
             },
             resolve(parent, args){
                 let book = new Book({
                     name: args.name,
                     genere: args.genere,
                     authId: args.authId
                 });
                return book.save();
             }
         }
     }
})


module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation: Mutation
}
)
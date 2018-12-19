const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

//allow cross-origin request
app.use(cors());

//Database connection
mongoose.connect("mongodb://shyam:prince123@ds135061.mlab.com:35061/graphql", {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log('connected to Database successfully');
})



app.use('/graphql',graphqlHTTP({
 schema,
 graphiql: true
}));

app.listen(4000, () => {
    console.log('server started listening on port : 4000')
})
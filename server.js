const express = require('express')

const expressGraphQl= require('express-graphql')
const schema = require('./schema/schema')
const app = express()

// graphql - request for graphql 
 app.use('/graphql', expressGraphQl({
    schema,
     graphiql:true // it is tool that allow us to make queries against our development server, this is for one development
 }))
 

 app.listen(4001,()=>{
     console.log('listening')
 })
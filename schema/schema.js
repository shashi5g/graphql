const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
}=graphql;

const CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:{
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString}

    }
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:{
        id:{type:GraphQLString},
        firstName:{type:GraphQLString},
        age:{type:GraphQLInt},
        company:{
            type:CompanyType ,
            resolve(parentValue,args){
                console.log(parentValue,args)
                return  axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(response=> response.data)
            }
        }
    }
})

// allow  grapql  to jump to specific node with given id  as arges return the speccifc node
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
      user: {
        type:UserType,
        args:{id: {type:GraphQLString}},
        resolve(parentValue,args){
            return  axios.get(`http://localhost:3000/users/${args.id}`)
            .then(response=> response.data)
            //{data:{firstName:'bill'}}
        }
      }

    }
})


module.exports = new GraphQLSchema(
    {
        query:RootQuery 
    }
)
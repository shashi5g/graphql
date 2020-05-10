const graphql = require('graphql');
const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
}=graphql;

const CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        users:{
             type :new GraphQLList(UserType),
          
            resolve(parentValue,args){
                console.log(parentValue,args)
                return  axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(response=> response.data)
            }
        }

    })
})

const UserType = new GraphQLObjectType({
    name:'User',
    fields:()=>({
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
    })
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
      },
      company: {
        type:CompanyType,
        args:{id: {type:GraphQLString}},
        resolve(parentValue,args){
            return  axios.get(`http://localhost:3000/companies/${args.id}`)
            .then(response=> response.data)
            //{data:{firstName:'bill'}}
        }
      }

    }
})


const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
      addUser: {
        type:UserType,
        args:{
          
            firstName:{type: new GraphQLNonNull (GraphQLString)},
        age:{type: new GraphQLNonNull (GraphQLInt)},
        companyId:{type:GraphQLString}
        },
        resolve(parentValue,{firstName,age,companyId}){
            return  axios.post(`http://localhost:3000/users`,{firstName,age,companyId})
            .then(response=> response.data)
            //{data:{firstName:'bill'}}
        }
      },
    
      deleteUser: {
        type:UserType,
        args:{
            id:{type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parentValue,args){
            return  axios.delete(`http://localhost:3000/users/${args.id}`)
            .then(response=> response.data)
            //{data:{firstName:'bill'}}
        }
      },
      editUser: {
        type:UserType,
        args:{
            id:{type: new GraphQLNonNull(GraphQLString)},
            firstName:{type: new GraphQLNonNull (GraphQLString)},
            age:{type: new GraphQLNonNull (GraphQLInt)},
            companyId:{type:GraphQLString}
        },
        resolve(parentValue,args){
            return  axios.patch(`http://localhost:3000/users/${args.id}`, args)
            .then(response=> response.data)
            //{data:{firstName:'bill'}}
        }
      }

    }
})


module.exports = new GraphQLSchema(
    {
        query:RootQuery ,
        mutation
    }
)
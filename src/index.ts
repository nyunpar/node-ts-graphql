import "reflect-metadata";
import {createConnection, getConnection} from "typeorm";
import { User } from "./entity/User";
import { GraphQLServer } from 'graphql-yoga'
import { ResolverMap } from "./types/ResolverTypes";

const typeDefs = `
  type User{
    id:Int!
    firstName: String
    lastName: String
    age: Int
    email:String
  }

  type Query{
    hello(name:String):String!
    user(id:Int!):User!
    users:[User!]!
  }

  type Mutation{
    createUser(firstName: String!, lastName: String!, age:Int!, email: String!):User!
    updateUser(id: Int!, firstName: String, lastName: String, age:Int, email: String):Boolean
    deleteUser(id:Int!):Boolean
  }
`;

const resolvers:ResolverMap = {
  Query: {
    hello: (_:any, { name }:any) => `Hello ${name || 'World'}`,
    user: (_,{id})=> User.findOne(id)
  },
  Mutation:{
    createUser:(_,args) => User.create(args).save(),
    updateUser:async(_,{id,...args}) => {
      try{
        await User.update(id,args); 
      }catch(err){
          console.log(err);
          return false;
      }
      return true;
    },
    deleteUser:async (_,{userid}) => { 
      try{
        await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: userid })
        .execute(); 
      }catch(err){
          console.log(err);
          return false;
      }
      return true;
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
createConnection().then(()=>{
  server.start(() => console.log('Server is running on localhost:4000'))
});
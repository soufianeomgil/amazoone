"use server"

import { ZodError, ZodSchema } from "zod";

import { UnAuthorizedError, ValidationError } from "../http-errors";

import { Session } from "next-auth";
import { auth } from "@/auth";
import connectDB from "@/database/db";





interface ActionOptions<T>  {
  params?: T,
  schema?: ZodSchema<T>,
  authorize?: boolean
}
export async function  action<T> ({params,schema,authorize = false}:ActionOptions<T>) {
  
         if(schema && params) {
          try {
             schema.parse(params)
          } catch (error) {
            if(error instanceof ZodError) {
                 return new ValidationError(error.flatten().fieldErrors as Record<string,string[]>)
            }else {
                throw new Error("schema validation failed")
            }       
          }}
          let session: Session | null = null
          if(authorize) {
              session = await auth()
              if(!session) {
                return new UnAuthorizedError('Unauthorized')
              }
          }
          await connectDB()
          return {params,session}
}
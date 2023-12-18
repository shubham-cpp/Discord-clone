import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient 
// for developmenet as new instance of prisma will initialized everytime on hot reload, to avoid this we use globalThis property

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;
// appended prisma client to variable globalThis.prisma, as globalThis is not affected during hot reload
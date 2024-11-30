import { PrismaClient } from "@prisma/client";
export const PrismaWrite = new PrismaClient();
export const PrismaRead = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
export const prisma = new PrismaClient();
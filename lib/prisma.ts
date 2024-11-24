import { PrismaClient } from '@prisma/client'

declare global {
    var prismaGlobal: PrismaClient
}
const prisma = global.prismaGlobal || new PrismaClient()
if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma

export default prisma;
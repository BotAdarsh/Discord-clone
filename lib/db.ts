import { PrismaClient} from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prisma = db  /* added this line to bypass hot reload (hot reload -automatically updating the schema when changes are done) globalThis.Prisma*/ 
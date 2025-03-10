import { Prisma } from "@prisma/client";
import { DynamicClientExtensionThis, InternalArgs } from "@prisma/client/runtime/library";

export type PaginationParams = {
    skip?: number;
    take?: number;
}

export type PaginatedResult<T> = {
    data: T[];
    count: number;
}

export type ExtendedPrismaClient = DynamicClientExtensionThis<Prisma.TypeMap<InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>, Prisma.TypeMapCb, {
    result: {};
    model: {};
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>
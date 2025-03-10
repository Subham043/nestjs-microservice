import { Prisma } from "@prisma/client";

export type UserType = Omit<Prisma.UserGetPayload<{}>, "password">
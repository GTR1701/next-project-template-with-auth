"use server"

import { prisma } from "@/prisma/prisma"

export async function getUserTypes() {
    return await prisma.userTypes.findMany()
}
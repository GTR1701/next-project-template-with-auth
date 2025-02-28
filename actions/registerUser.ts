"use server"

import { RegisterSchema } from "@/schemas/UserSchemas";
import * as z from 'zod';
import bcrypt from 'bcrypt'
import { prisma } from "@/prisma/prisma";

export async function registerUser(credentials: z.infer<typeof RegisterSchema>) {
    const username = String(credentials.username);
    const password = String(credentials.password);
    const userExists = await prisma.user.findFirst({ where: { username } });
    
    if (userExists) {
        return {message: 'User not found'}
    }

    const userTypeId = await prisma.userTypes.findFirst({
        where: {
            type: credentials.userType
        },
        select: {
            id: true
        }
    })

    if (!userTypeId) {
        return {message: 'User type not found'}
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            userTypeId: userTypeId.id
        },
    });

    return {message: 'User registered', uuid: newUser.id}
}
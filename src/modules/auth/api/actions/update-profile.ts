'use server'

import { db } from '@/server/db'
import { getCurrentUser } from '../utils/auth-server'
import { revalidatePath } from 'next/cache'
import { users } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import { updateProfileSchema } from '../models/z.profile'

export async function updateProfile(formData: FormData) {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const validatedFields = updateProfileSchema.safeParse({
        name: formData.get('name'),
        instagramHandle: formData.get('instagramHandle'),
    })

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { name, instagramHandle } = validatedFields.data

    await db.update(users)
        .set({
            name,
            instagramHandle,
        })
        .where(eq(users.id, user.id))

    revalidatePath('/profile')
    return { success: true }
} 
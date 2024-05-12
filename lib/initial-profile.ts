import { currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async (): Promise<Profile> => {
    const user = await currentUser();

    if (!user) {
        return redirectToSignIn();
    }

    // Assuming Profile is the Prisma model type
    const profile: Profile | null = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) {
        return profile;
    }

    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });
    return newProfile;
};

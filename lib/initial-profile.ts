import { currentUser,redirectToSignIn,auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const initialProfile = async () => {
    const user = await currentUser();

    if(!user) {
        return auth().redirectToSignIn();
    }

    const profile = await db.profile.findUnique({//findUnique is the function in prisma ORM
        where:{
            userId: user.id // user.id refers to the id of the user in the application
        }
    });

    if(profile) { 
        return profile;
    }

    const newProfile = await db.profile.create({//create is the funciton in prisma orm to create a new record with parameter data and stores it in databse.
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress // accesses the first email address associated with the user
        }
    });
    return newProfile;
};
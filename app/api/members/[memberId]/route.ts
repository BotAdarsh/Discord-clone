import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string }}
) {
    try{
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");
 
        if(!profile){
            return new NextResponse("Unauthorised",{ status: 401 });
        }

        if(!serverId){
            return new NextResponse("Server ID missing",{ status: 400});
        }

        if(!params.memberId){
            return new NextResponse("Member ID missing",{ status: 4000});
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id // so that user does not delete themselves
                        }
                    }
                }
            },
            include: {// so that the response include the updated server and member ordered by role
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                },
            }
        });

        return NextResponse.json(server);
    }
    catch (error){
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Erro" , { status: 500});
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string}}
) {
    try{
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
                /* The URL constructor is used to parse the request URL (req.url).
                searchParams is a property of the URL object that provides access to the query parameters of the URL.
                This allows you to easily retrieve specific query parameters from the URL, such as serverId.*/

        const { role } = await req.json();

        const serverId = searchParams.get("serverId");
                /*The searchParams object provides a get method to retrieve the value of a specific query parameter by its name.
                searchParams.get("serverId") retrieves the value of the serverId query parameter from the URL.
                serverId is used to identify the server to which the member belongs and which needs to be updated.*/
        
        if(!profile){
            return new NextResponse("Unauthorised", { status: 401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", { status: 400});
        }

        if(!params.memberId){
            return new NextResponse("Member ID missing", { status:400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,//so that only admin can do the changes
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id // so that admin cannot change is own role
                            }
                        },
                        data: {
                            role
                        }
                    }                 
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        return NextResponse.json(server);
        //usage of new keyword -> This approach allows you to customize the response more flexibly, including setting headers, status codes, and response bodies directly.
    }
    catch(error){
        console.log("[MEMBERS_ID_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
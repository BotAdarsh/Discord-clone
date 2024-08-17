/*import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; I don't  why this is not working */


import { authMiddleware } from "@clerk/nextjs/server";
export default authMiddleware({
  publicRoutes: ["/api/uploadthing"]
});
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
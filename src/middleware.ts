import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/",
    "/expenses/:path*",
    "/budgets/:path*",
    "/analytics/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
}

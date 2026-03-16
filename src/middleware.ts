export { default } from "next-auth/middleware"

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

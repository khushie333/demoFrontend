import { getCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'
// admin route
const isAdminRoute = (pathname: string) => {
	return pathname.startsWith('/Admin')
}

// user route
const isUserRoute = (pathname: string) => {
	return pathname.startsWith('/User')
}

//apply middleware
export async function middleware(req: NextRequest) {
	const res = NextResponse.next()
	//retrive user token and role
	const isLoginUser = getCookie('token', { req, res })
	const isUserRole = getCookie('role', { req, res })

	const { pathname } = req.nextUrl

	// validate user role or path name
	if (isUserRoute(pathname) && isUserRole !== 'user') {
		return NextResponse.redirect(new URL('/SignIn', req.url))
	}
	if (isAdminRoute(pathname) && isUserRole !== 'admin') {
		return NextResponse.redirect(new URL('/SignIn', req.url))
	}
}

export const config = {
	matcher: ['/User/:path*', '/Admin/:path*'],
}

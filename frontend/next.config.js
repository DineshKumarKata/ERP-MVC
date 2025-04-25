/** @type {import('next').NextConfig} */

const securityHeaders = [
	{key: 'X-Frame-Options',value: 'SAMEORIGIN'},
]
require("dotenv").config();
const nextConfig = {
	async headers() {
		return [
		  {
			// Apply these headers to all routes in your application.
			source: '/:path*',
			headers: securityHeaders,
		  },
		]
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/StudentLoginPage',
				permanent: true,
			},
			{
				source: '/vignan',
				destination: '/vignan/StudentLoginPage',
				permanent: true,
			},
		];
	},
	poweredByHeader: false,
	reactStrictMode: true,
	basePath: "/vignan",
	env:{
		BACKEND_URL:process.env.BACKEND_URL,
		NEXT_PUBLIC_BASE_PATH:"/vignan",
	},
}

module.exports = nextConfig

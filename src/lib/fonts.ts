import localFont from "next/font/local"
import { Space_Grotesk, Inter, Roboto_Mono, Source_Sans_3 } from "next/font/google"

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: 'swap',
    variable: "--font-space-grotesk",
})

export const sourceSans = Source_Sans_3({
    subsets: ["latin"],
    display: 'swap',
    variable: "--font-source-sans",
})

export const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: 'swap',
    variable: "--font-roboto-mono",
})

export const inter = Inter({
    subsets: ["latin"],
    display: 'swap',
    variable: "--font-inter",
})

export const calSans = localFont({
    src: "./CalSans-SemiBold.woff2",
    variable: "--font-cal",
})
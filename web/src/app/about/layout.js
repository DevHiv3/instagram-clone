export const metadata = {
    title: "About",
    description: "About Page",

}


export default function RootLayout({
    children
}) {
    return(
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
export const metadata = {
    title: "IAM DASHBOARD",
    description: "IAM access for authorized users only!",

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
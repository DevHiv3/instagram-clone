export const metadata = {
    title: "TERMS AND CONDITIONS",
    description: "Review the terms and conditions of using [App Name]. Understand your rights, responsibilities, and our guidelines for a safe community",
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
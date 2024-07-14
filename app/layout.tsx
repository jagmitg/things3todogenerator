import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata = {
    title: "Things3 Todo Generator",
    description: "A simple to-do list generator"
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                {children}
            </body>
        </html>
    );
}

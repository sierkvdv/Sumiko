import "./globals.css";
export const metadata = {
  title: "Sumiko",
  description: "Let the leaves speak"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        {children}
      </body>
    </html>
  );
}


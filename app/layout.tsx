export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>LabControl</h1>
        {children}

      </body>
    </html>
  );
}

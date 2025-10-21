export const metadata = {
  title: "Amanat Pflege – KI Assistent",
  description: "Pflege-KI für Wundbeobachtung, Allgemeinzustand & Beratung.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{
        margin: 0,
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb'
      }}>
        {children}
      </body>
    </html>
  );
}

import Providers from "./providers";

export const metadata = {
  title: 'CVtify — Professional CV Builder',
  description: 'Build and download a professional CV in minutes. Choose from premium templates, customize every section, and land your dream job.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Dancing+Script:wght@400&family=Inter:wght@300;400;600&family=Montserrat:wght@300;400;500;700&family=Source+Serif+4:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import Providers from "./providers";

export const metadata = {
  title: 'CVtify — Professional CV Builder',
  description: 'Build and download a professional CV in minutes. Choose from premium templates, customize every section, and land your dream job.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

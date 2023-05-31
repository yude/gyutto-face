import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "ぎゅっとface",
  description: "Instantly generate the world's coolest face variants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

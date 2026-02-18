import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Risk Assessment App",
  description: "Risk Assessment and Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata = {
  title: "BugScribe",
  description: "AI-powered bug ticket writer for PMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        <main className="flex-1">{children}</main>
        <Analytics />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="f6d6423e-c0df-4be1-9604-43ad021b372a"
          strategy="afterInteractive"
        />
        <footer className="border-t border-gray-200 bg-white py-4 px-6 text-center text-xs text-gray-500">
          <p>
            <span className="font-medium text-gray-600">Data Privacy Notice:</span>{" "}
            BugScribe sends the content you enter to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Google&apos;s Gemini API</a>{" "}
            solely to generate ticket summaries and user flows — no input data is stored or shared by this tool. Google may process and retain submitted content in accordance with their{" "}
            <a href="https://policies.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Terms of Service</a>.{" "}
            Please avoid entering sensitive personal information, confidential business data, or credentials.{" "}
            This site is hosted on{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Vercel</a>,{" "}
            which may collect request metadata (IP address, headers) as part of its infrastructure.{" "}
            Anonymized usage analytics are collected via{" "}
            <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">Umami</a>{" "}
            — no cookies are used and no personally identifiable information is tracked.
          </p>
        </footer>
      </body>
    </html>
  );
}

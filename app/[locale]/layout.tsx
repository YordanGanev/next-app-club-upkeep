import ThemeProvider from "@/contexts/ThemeContext";
import { UserProvider } from "@auth0/nextjs-auth0/client";

import { NextIntlClientProvider, useLocale } from "next-intl";
import { notFound } from "next/navigation";

const locales = ["en", "bg", "de"];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) notFound();

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <UserProvider>
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <body>{children}</body>
          </NextIntlClientProvider>
        </ThemeProvider>
      </UserProvider>
    </html>
  );
}

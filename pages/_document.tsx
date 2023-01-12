import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap&apos;);
        </style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

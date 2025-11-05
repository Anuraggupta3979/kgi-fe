import "../styles/index.scss";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import store from "@/redux/store/store";
import { Provider } from "react-redux";
import MainLayout from "@/components/layout/MainLayout";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const routes = [
    "privacy-policy",
    "terms-conditions",
    "responsible-gaming",
    "support",
    "contact-us",
    "faq",
    "about",
    "blogs",
    "404",
  ];

  const IsTokenValid = () => {
    const path = router?.pathname?.split("/");

    let hashcode = localStorage.getItem("hashcode");
    if (!hashcode) {
      if (
        !routes?.includes(path[1]) &&
        path?.[1] !== "login" &&
        path?.[1] !== "" &&
        path?.[1] !== "privacy-policy" &&
        path?.[1] !== "terms-conditions" &&
        path?.[1] !== "responsible-gaming" &&
        path?.[1] !== "refund-policy" &&
        path?.[1] !== "support" &&
        path?.[1] !== "blogs" &&
        path?.[1] !== "faq" &&
        path?.[1] !== "blogs" &&
        path?.[1] !== "contact-us"
      ) {
        router.push("/login");
      }
    }
  };
  useEffect(() => {
    IsTokenValid();
  }, []);
  const GA_MEASUREMENT_ID = "G-H3B9FHFY46";
  return (
    <>
      <Provider store={store}>
        <Head>
          <meta property="og:title" content="KgiPay" />
          <title>KgiPay</title>

          <link rel="shortlink" href="https://kgipay.com/" />

          <link rel="icon" href="/kgipaylogo.png" sizes="32x32" />
          <link rel="icon" href="/kgipaylogo.png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/kgipaylogo.png" />
          <meta name="msapplication-TileImage" content="/kgipaylogo.png" />
        </Head>

        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        <StyledComponentsRegistry>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </StyledComponentsRegistry>
        {/* <script src="//in.fw-cdn.com/32181230/1164002.js" chat="true"></script> */}
      </Provider>
    </>
  );
}

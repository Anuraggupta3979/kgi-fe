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
          <meta
            property="og:title"
            content="KgiPay - Play Skill Games & Win Real Cash | Online Gaming Platform"
          />
          <title>
            KgiPay - Play Skill Games & Win Real Cash | Online Gaming Platform
          </title>
          <meta
            name="keywords"
            content="kgipay | kgipay club login | kgipayclub | kgipay login | star ludo club login | star ludo players | star ludo.club | star ludo player | kgipay.com | star ludo.com | star ludo club | KgiPay| kgipay.com | kgipay.com| Star Ludo | Ludo | Gaming | kgipayClub | kgipay.com | Star Ludo Play | Ludo Players | LudoPlayers | win real cash "
          />
          <meta name="twitter:card" content="KgiPay" />
          <meta
            name="description"
            content="Compete in skill-based games like Ludo, Chess, & Pool on India's premier HTML5 gaming platform. Play tournaments, win real cash, and withdraw instantly via multiple payment options."
          />
          <meta
            property="og:description"
            content="Compete in skill-based games like Ludo, Chess, & Pool on India's premier HTML5 gaming platform. Play tournaments, win real cash, and withdraw instantly via multiple payment options."
          />
          <meta
            name="twitter:description"
            content="Compete in skill-based games like Ludo, Chess, & Pool on India's premier HTML5 gaming platform. Play tournaments, win real cash, and withdraw instantly via multiple payment options."
          />

          <meta name="url" content={`https://kgipay.com/`} />
          <meta property="og:image" content="/kgipaylogo.png" />
          <meta property="og:url" content="https://kgipay.com/" />
          <meta name="twitter:url" content="https://kgipay.com/" />
          <link rel="canonical" href="https://www.kgipay.com/" />
          <meta name="author" content="KgiPay" />
          <meta property="og:type" content="website" />
          <meta name="twitter:type" content="summary" />
          <meta property="og:locale" content="English" />
          <meta property="og:site_name" content="KgiPay" />
          <meta name="og:email" content="msgurjar1992@gmail.com" />
          <meta name="og:phone_number" content="+91 9667175604" />
          <meta name="og:latitude" content="26.9124" />
          <meta name="og:longitude" content="75.7873" />
          <meta name="og:street-address" content="US" />
          <meta name="og:locality" content="IN" />
          <meta name="og:region" content="IN" />
          <meta name="og:postal-code" content="302001" />
          <meta name="og:country-name" content="IN" />
          <meta charset="UTF-8" />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link rel="canonical" href="https://www.kgipay.com/" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="KgiPay - Play Skill Games & Win Real Cash | Online Gaming Platform"
          />
          <meta
            property="og:description"
            content="Compete in skill-based games like Ludo, Chess, & Pool on India's premier HTML5 gaming platform. Play tournaments, win real cash, and withdraw instantly via multiple payment options."
          />
          <meta
            property="og:site_name"
            content="KgiPay - Play Skill Games & Win Real Cash | Online Gaming Platform"
          />
          <meta
            property="article:modified_time"
            content="2025-01-13T21:54:39+00:00"
          />

          <meta name="twitter:card" content="summary_large_image" />

          <link rel="shortlink" href="https://kgipay.com/" />

          <link rel="icon" href="/kgipaylogo192.png" sizes="32x32" />
          <link rel="icon" href="/kgipaylogo192.png" sizes="192x192" />
          <link rel="apple-touch-icon" href="/kgipaylogo192.png" />
          <meta name="msapplication-TileImage" content="/kgipaylogo192.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "KgiPay",
                url: "https://kgipay.com/",
                logo: "https://www.kgipay.com/_next/static/media/kgipaylogo.4b046a07.png",
                description: "Play Skill Games & Win Real Cash",
                sameAs: ["https://www.instagram.com/kgipay.com/"],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "Customer Support",
                  telephone: "+919216126998",
                  url: "https://kgipay.com/support",
                  availableLanguage: "en",
                },
              }),
            }}
          />
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

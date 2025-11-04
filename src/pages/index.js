import Head from "next/head";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const siteSetting = useSelector((state) => state.setting.value);

  const IsTokenValid = () => {
    let hashcode = localStorage.getItem("hashcode");
    if (!hashcode) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  useEffect(() => {
    IsTokenValid();
  }, []);

  return (
    <div>
      <Head>
        <title>KgiPay</title>
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="shortlink" href="https://kgipay.com/" />
        <link rel="icon" href="/kgipaylogo192.png" sizes="32x32" />
        <link rel="icon" href="/kgipaylogo192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/kgipaylogo192.png" />
        <meta name="msapplication-TileImage" content="/kgipaylogo192.png" />
      </Head>
      <Layout>
        <div className="tournaments_container">
          {siteSetting?.homePageMsg && (
            <div
              className="notification_alert_container"
              style={{ marginBottom: "20px" }}
            >
              ◉ {siteSetting?.homePageMsg}
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

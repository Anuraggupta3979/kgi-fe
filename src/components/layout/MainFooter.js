import { Col, Divider, Row } from "antd";
import Image from "next/image";
import React from "react";
import Logo from "../../Assets/layout/kgipaylogo.png";
import Instagram from "../../Assets/layout/footer/instagram.svg";
import WhatsApp from "../../Assets/layout/footer/whatsapp.svg";
import Email from "../../Assets/layout/footer/email.svg";
import Youtube from "../../Assets/layout/footer/youtube.svg";
import Fb from "../../Assets/layout/footer/fb.svg";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function MainFooter() {
  const user = useSelector((state) => state.user.value);
  const siteSetting = useSelector((state) => state.setting.value);
  const router = useRouter();
  return (
    <div className="footer_main_container">
      <div className="content_footer_container">
        <div className="footer_links_container">
          <h3 className="quick_links"> Quick Links</h3>
          <Row justify={""}>
            <Col onClick={() => router.push("/")} xs={12} md={8}>
              <p>Home</p>
            </Col>
            <Col onClick={() => router.push("/about")} xs={12} md={8}>
              <p>About Us</p>
            </Col>
            <Col
              onClick={() => router.push("/tournaments/classic")}
              xs={12}
              md={8}
            >
              <p>Star Classic</p>
            </Col>
            <Col onClick={() => router.push("/blogs")} xs={12} md={8}>
              <p>Blogs</p>
            </Col>

            <Col onClick={() => router.push("/faq")} xs={12} md={8}>
              <p>FAQs</p>
            </Col>
            <Col onClick={() => router.push("/profile")} xs={12} md={8}>
              <p>Profile</p>
            </Col>
            <Col onClick={() => router.push("/privacy-policy")} xs={12} md={8}>
              <p>Privacy Policy</p>
            </Col>
            <Col onClick={() => router.push("/refer-earn")} xs={12} md={8}>
              <p>Refer & Earn</p>
            </Col>
            <Col
              onClick={() => router.push("/terms-conditions")}
              xs={12}
              md={8}
            >
              <p>Terms & Conditions</p>
            </Col>
          </Row>
        </div>
        <Divider />
        <Row justify={"center"}>
          <Col>
            <Image className="logo" alt="Logo" src={Logo} />
          </Col>
        </Row>
        <Row
          className="icon_container"
          align={"middle"}
          justify={"center"}
          gutter={20}
        >
          <Col span={24}>
            <p>Connect with us!</p>
          </Col>
          <Col>
            <a href="mailto:support@kgipay.com">
              <Image width={28} height={24} src={Email} alt="email" />
            </a>
          </Col>
          <Col
            onClick={() =>
              router.push(`https://www.youtube.com/shorts/GZ9vEadHQxE`)
            }
          >
            <Image width={28} height={28} src={Youtube} alt="Youtube" />
          </Col>
          <Col onClick={() => router.push(`/`)}>
            <Image width={28} height={24} src={Fb} alt="Fb" />
          </Col>
          <Col
            onClick={() => router.push(`https://www.instagram.com/kgipay.com/`)}
          >
            <Image width={28} height={24} src={Instagram} alt="Instagram" />
          </Col>
          {user && user.verified === "verified" && (
            <Col
              onClick={() =>
                router.push(
                  `https://api.whatsapp.com/send?phone=+91${
                    siteSetting?.whatsappNumber
                      ? siteSetting?.whatsappNumber
                      : "9216126998"
                  }&text=Hello`
                )
              }
            >
              <Image width={28} height={26} src={WhatsApp} alt="WhatsApp" />
            </Col>
          )}
        </Row>
        <Row justify={"center"}>
          <p className="copyright">2025 © Copyright | All Rights Reserved</p>
        </Row>
      </div>
    </div>
  );
}

export default MainFooter;

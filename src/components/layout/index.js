import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Row, Col } from "antd";
import Image from "next/image";
import Logo from "../../Assets/layout/kgipaylogo.png";

import { useRouter } from "next/router";
import { UserFooterBar } from "./Footer";
import MainFooter from "./MainFooter";
function Layout({ page, children, isTournament = false }) {
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);
  const routes = [
    "privacy-policy",
    "terms-conditions",
    "responsible-gaming",
    "support",
    "refund-policy",
    "contact-us",
    "about",
    "faq",
    "blogs",
    "404",
    "login",
  ];
  const IsTokenValid = () => {
    const path = router?.pathname?.split("/");
    let hashcode = localStorage.getItem("hashcode");
    if (!hashcode) {
      if (!routes?.includes(path[1])) {
        router.push("/");
      }
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  useEffect(() => {
    IsTokenValid();
  }, []);
  return (
    <Row>
      <Col xs={24} className="common_layout">
        {!isTournament && <Header isValid={isValid} />}
        <div className="layout_content_container">
          <div
            className={`content_box ${
              isTournament ? "tournament-content-box" : ""
            }`}
          >
            <div className="content_container">
              <div className="pageContent">
                {page && <h1 className="pageTitle">{page}</h1>}
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* <MainFooter /> */}
      </Col>
    </Row>
  );
}

export default Layout;

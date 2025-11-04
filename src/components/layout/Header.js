import React, { useState } from "react";
import { Row, Col, Button, Drawer } from "antd";
import Logo from "../../Assets/layout/kgipaylogo.png";
import Image from "next/image";
import MoreIcon from "../../Assets/layout/sidebar.png";

import TransactionHistoryIcon from "../../Assets/layout/transaction.svg";
import LogoutIcon from "../../Assets/layout/logout.svg";

import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { UserOutlined, WalletFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "@/redux/slices/userSlice";

const numberWithCommas = (number) => {
  var parts = number.toString().split(".");
  if (parts?.length > 0) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return number;
};
function Header({ isValid }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  return (
    <div className="header_main_container">
      <div className="headerContent">
        <Row justify={"space-between"} align={"middle"}>
          <Col>
            <Image
              src={Logo}
              alt="logo"
              className="logo"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </Col>
          <Col>
            <Row align={"middle"} gutter={10}>
              {!isValid && (
                <Col>
                  <Button
                    className="primary_button2"
                    onClick={() => router.push("/login")}
                  >
                    LOGIN
                  </Button>
                </Col>
              )}
              {isValid && (
                <Col>
                  <Row>
                    <Col>
                      <Button className="cashBtn addCashBtn">
                        <Row
                          align={"middle"}
                          gutter={[4, 4]}
                          className="headerRow"
                        >
                          <Col className="font-12">Cash</Col>
                          <Col className="amount font-12">
                            {numberWithCommas(
                              user?.Wallet_balance
                                ? user?.Wallet_balance.toFixed(2)
                                : 0
                            )}
                          </Col>
                        </Row>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              )}

              <Col>
                <Image
                  src={MoreIcon}
                  alt="more"
                  className="moreIcon"
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(true)}
                />
              </Col>

              <Drawer
                title={
                  <>
                    <Image
                      src={Logo}
                      alt="logo"
                      // className="logo"

                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                        maxWidth: "96px",
                      }}
                      onClick={() => router.push("/")}
                    />
                  </>
                }
                placement={"left"}
                width={500}
                onClose={() => setOpen(false)}
                open={open}
                rootClassName="menu_drawer_container"
              >
                {isValid && (
                  <>
                    <Row
                      gutter={16}
                      className="headerMenuItem"
                      onClick={() => {
                        router.push("/profile");
                        setOpen(false);
                      }}
                    >
                      <Col className="menuLink">
                        <UserOutlined />
                      </Col>
                      <Col className="menuLink">My Profile</Col>
                    </Row>

                    <Row
                      gutter={16}
                      className="headerMenuItem"
                      onClick={() => {
                        router.push("/transaction-history");
                        setOpen(false);
                      }}
                    >
                      <Col>
                        <Image
                          src={TransactionHistoryIcon}
                          alt="profile"
                          height={20}
                        />
                      </Col>
                      <Col className="menuLink">Transaction History</Col>
                    </Row>
                  </>
                )}

                <Row
                  gutter={16}
                  className="headerMenuItem"
                  onClick={() => {
                    Cookies.remove("expireTime");
                    localStorage.clear();
                    dispatch(setUserDetail({}));
                    router.push("/login");
                    setOpen(false);
                  }}
                >
                  {isValid && (
                    <>
                      <Col>
                        <Image src={LogoutIcon} alt="profile" height={20} />
                      </Col>
                      <Col className="logoutLink">Logout</Col>
                    </>
                  )}
                </Row>
              </Drawer>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Header;

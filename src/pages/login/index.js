import React, { useState, useEffect } from "react";
import { Row, Form, Input, Button, Col, message } from "antd";
import Logo from "../../Assets/layout/kgipaylogo.png";
import CallIcon from "../../Assets/layout/call.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import API_MANAGER, { HELPERS } from "../api";
import Layout from "@/components/layout";
import OtpInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { setUserDetail } from "@/redux/slices/userSlice";
import { setSettingDetail } from "@/redux/slices/settingSlice";

function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [secretCode, setSecretCode] = useState(null);
  const [counter, setCounter] = useState(0);
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState();
  const [requestID, setRequestID] = useState(null);
  const [otpBtnDisabled, setOtpBtnDisabled] = useState(true);
  const dispatch = useDispatch();

  const router = useRouter();

  const handleSendNumberForOTP = async (param) => {
    try {
      const response = await API_MANAGER.login(param);
      setShowOtp(true);
      setCounter(15);
      const binaryData = Buffer.from(response?.data?.data, "base64"); // Decode Base64 to Buffer
      const jsonData = JSON.parse(binaryData.toString());
      setSecretCode(jsonData?.secret);
      setRequestID(jsonData?.requestID);
      setLoading(false);
    } catch (error) {
      console.log(error, "error");
      setLoading(false);
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  const handleNumberSubmit = async (values) => {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (re.test(values?.number)) {
      setLoading(true);
      try {
        setPhone(values?.number);

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (position.coords.latitude && position.coords.longitude) {
                let param = {
                  phone: values?.number,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                if (router?.query?.referral_code) {
                  param["referral"] = router?.query?.referral_code;
                }
                handleSendNumberForOTP(param);
              } else {
                message.error("Please allow location first.");
              }
            },
            (error) => {
              let param = {
                phone: values?.number,
              };
              if (router?.query?.referral_code) {
                param["referral"] = router?.query?.referral_code;
              }
              handleSendNumberForOTP(param);
            }
          );
        } else {
          console.error("Geolocation not supported");
        }
      } catch (error) {
        setLoading(false);
        message.error(
          error?.response?.data?.message || "Something went wrong!"
        );
      }
    } else {
      message.error("Please enter a valid number!");
    }
  };
  const getSiteSettings = async () => {
    try {
      const response = await API_MANAGER.getAllSettings();
      const decryptedData = HELPERS.decrypt(response?.data?.data);
      dispatch(setSettingDetail(decryptedData));
    } catch (e) {}
  };
  const handleVerifyOTP = async (values) => {
    if (otp) {
      try {
        const param = {
          phone: phone,
          twofactor_code: otp,
          secretCode,
          requestID: requestID,
        };
        const response = await API_MANAGER.verifyOtp(param);
        setShowOtp(true);
        const binaryData = Buffer.from(response?.data?.data, "base64"); // Decode Base64 to Buffer
        const jsonData = JSON.parse(binaryData.toString());
        dispatch(setUserDetail(jsonData?.user));

        localStorage.setItem("hashcode", jsonData?.token?.accessToken);
        getSiteSettings();

        router.push("/");
      } catch (error) {
        message.error(
          error?.response?.data?.message || "Something went wrong!"
        );
      }
    } else {
      message.error("Please enter a valid OTP!");
    }
  };
  const resendOtp = async () => {
    try {
      let param = {
        phone: phone,
      };
      if (router?.query?.referral_code) {
        param["referral"] = router?.query?.referral_code;
      }
      const response = await API_MANAGER.login(param);
      setCounter(15);
      const binaryData = Buffer.from(response?.data?.data, "base64"); // Decode Base64 to Buffer
      const jsonData = JSON.parse(binaryData.toString());
      setSecretCode(jsonData?.secret);
      setRequestID(jsonData?.requestID);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };
  const handleChangeOtp = (newValue) => {
    if (newValue.length == 6) {
      setOtpBtnDisabled(false);
    } else {
      setOtpBtnDisabled(true);
    }
    setOtp(newValue);
  };
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);
  return (
    <>
      <Layout>
        <div className="loginContainer">
          <div className="loginContentContainer">
            <div className="loginCard">
              <Row justify={"center"}>
                <p className="title">
                  Sign In
                  {router?.query?.referral_code && (
                    <p className="referCode">
                      Referral code : {router?.query?.referral_code}
                    </p>
                  )}
                </p>
              </Row>
              <Row justify={"center"}>
                <Image
                  src={Logo}
                  alt="KgiPay"
                  style={{ width: "200px", height: "auto", marginTop: "32px" }}
                  onClick={() => router.push("/")}
                />
              </Row>
              <Row>
                <Col xs={24}>
                  {!showOtp ? (
                    <Form onFinish={handleNumberSubmit}>
                      <Form.Item
                        name="number"
                        rules={[
                          {
                            required: true,
                            message: "Mobile number is required!",
                          },
                          {
                            length: 10,
                            message: "please enter valid number!",
                          },
                        ]}
                      >
                        <Input
                          className="inputBox"
                          minLength={10}
                          maxLength={10}
                          placeholder="Enter your mobile number"
                          prefix={
                            <div className="mobilePrefix">
                              {/* <Image src={CallIcon} width={20} height={24} /> */}
                              +91 |
                            </div>
                          }
                        />
                      </Form.Item>

                      <Form.Item>
                        <Row justify={"center"}>
                          <Button
                            htmlType="submit"
                            className="primary_button2 login_btn"
                            placeholder="Enter your mobile number"
                            loading={loading}
                          >
                            CONTINUE
                          </Button>
                        </Row>
                      </Form.Item>
                    </Form>
                  ) : (
                    <Form onFinish={handleVerifyOTP}>
                      <Form.Item
                        name="otp"
                        rules={[
                          {
                            required: true,
                            message: "OTP is required!",
                          },
                        ]}
                      >
                        {/* <Input
                          className="inputBox"
                          placeholder="Enter OTP"
                          prefix={<div className="mobilePrefix">OTP |</div>}
                        /> */}
                        <OtpInput
                          value={otp}
                          onChange={handleChangeOtp}
                          numInputs={6}
                          shouldAutoFocus={true}
                          // isInputNum={true}
                          inputStyle="otpInput"
                          containerStyle="otpContainer"
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                        />
                      </Form.Item>
                      <Row justify={"end"}>
                        <Col>
                          <p
                            className="resendOtp"
                            onClick={() => {
                              if (counter === 0) {
                                resendOtp();
                              }
                            }}
                            style={{
                              cursor: counter === 0 ? "pointer" : "not-allowed",
                            }}
                          >
                            Resend OTP{" "}
                            <span>{(counter != 0 && counter) || ""}</span>
                          </p>
                        </Col>
                      </Row>
                      <Form.Item>
                        <Row justify={"center"}>
                          <Button
                            htmlType="submit"
                            className="primary_button2 login_btn"
                            placeholder="Enter your mobile number"
                            prefix={
                              <span className="mobilePrefix">
                                <Image src={CallIcon} /> |
                              </span>
                            }
                            disabled={otpBtnDisabled}
                          >
                            VERIFY
                          </Button>
                        </Row>
                      </Form.Item>
                    </Form>
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Login;

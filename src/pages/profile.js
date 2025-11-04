import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import {
  Avatar,
  Row,
  Col,
  Button,
  Form,
  Input,
  message,
  Modal,
  Upload,
} from "antd";
import {
  EditOutlined,
  UsergroupAddOutlined,
  CreditCardFilled,
  ArrowRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import WalletImage from "../Assets/layout/Wallet.svg";
import rsImage from "../Assets/rs.png";
import BattelImage from "../Assets/battel.png";
import penaltyImage from "../Assets/layout/penalty.png";
import UserIcon from "../Assets/user.png";
import ErrorModal from "../components/common/ErrorModal";
import API_MANAGER, { HELPERS } from "./api";
import { useRouter } from "next/router";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetail } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";
function Profile() {
  const [errorModal, setErrorModal] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [resetPasswordOpenModal, setResetPasswordOpenModal] = useState(false);
  const [requestID, setRequestID] = useState(null);
  const [offerRank, setOfferRank] = useState({
    offerCompletedGameRank: 0,
    offerWonAMountRank: 0,
  });
  const [offerReferRank, setOfferReferRank] = useState();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const router = useRouter();
  const user = useSelector((state) => state.user.value);

  const uploadButton = <div className="upload_btn">Change Profile Photo</div>;
  const dispatch = useDispatch();
  const getUserProfile = async () => {
    try {
      const response = await API_MANAGER.getUserDetail();
      const decryptedData = await HELPERS.decrypt(response?.data?.data);
      dispatch(setUserDetail(decryptedData));
    } catch (error) {
      message.error("Something went wrong!");
    }
  };
  const referralCount = async () => {
    try {
      const response = await API_MANAGER.offerReferralCount(
        user?.referral_code
      );

      setOfferReferRank(response?.data?.data?.[0]);
    } catch (error) {}
  };
  const handleProfileChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const handleSubmit = async (values) => {
    const param = {
      referral: values?.referral,
    };
    try {
      await API_MANAGER.updateUser(param);
      message.success("Updated Successfully!");
      form.resetFields();
      getUserProfile();
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong.");
      setErrorModal(true);
    }
  };
  const handleNameEdit = async (values) => {
    try {
      await API_MANAGER.updateUser(values);
      message.success("Updated Successfully!");
      form.resetFields();
      getUserProfile();
      setShowNameEdit(false);
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong.");
    }
  };
  const handleChangePassword = async (values) => {
    if (values?.newPassword !== values?.confirmPassword) {
      message.error("Password does not match.");
      return;
    }
    try {
      setIsLoading(true);
      await API_MANAGER.changePassword(values);
      setIsLoading(false);
      setOpenChangePassword(false);
      message.success("Password changed successfully.");
      changePasswordForm.resetFields();
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong.");
      setIsLoading(false);
      setOpenChangePassword(false);
    }
  };
  const handleResetPassword = async () => {
    try {
      setResetPasswordLoading(true);
      const response = await API_MANAGER.resetPassword();
      const decryptedData = await HELPERS.decrypt(response?.data?.data);
      setRequestID(decryptedData?.requestID);
      setResetPasswordLoading(false);
      setResetPasswordOpenModal(true);
    } catch (error) {
      message.error(error?.response?.data?.message || "Something went wrong.");
      setResetPasswordLoading(false);
    }
  };
  const handleVerifyesetPassword = async (values) => {
    if (values?.newPassword !== values?.confirmPassword) {
      message.error("Password does not match.");
      return;
    }
    try {
      setResetPasswordLoading(true);

      await API_MANAGER.verifyResetPassword({
        ...values,
        secretCode: requestID?.secret,
      });
      setResetPasswordLoading(false);
      setResetPasswordOpenModal(false);
      resetPasswordForm.resetFields();
      message.success("Password set successfully.");
    } catch (error) {
      setResetPasswordOpenModal(false);
      message.error(error?.response?.data?.message || "Something went wrong.");
      setResetPasswordLoading(false);
    }
  };
  const numberWithCommas = (number) => {
    var parts = number.toString().split(".");
    if (parts?.length > 0) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return number;
  };

  const getAllUser = async () => {
    try {
      const response = await API_MANAGER.getAllUser(user?._id);
      setTotal(response?.data?.data);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user?._id) {
      form2.setFieldsValue({ Name: user?.Name });
      getAllUser();
    }
    if (user?.referral_code) {
      form.setFieldsValue({ referral: user?.referral_code });
    }
  }, [user]);
  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referral_code);
    message.success("Referral code copied!");
  };
  const getOfferRank = async () => {
    try {
      const response = await API_MANAGER.getOfferRank();
      const decryptedData = HELPERS.decrypt(response?.data?.data);

      setOfferRank(decryptedData);
    } catch (error) {
      // message.error("Something went wrong!");
    }
  };
  useEffect(() => {
    getOfferRank();
    referralCount();
  }, []);
  return (
    <>
      <Layout>
        <div className="profileContainer">
          <Row justify={"center"}>
            <Avatar src={<Image src={UserIcon} />} size={100} />
          </Row>
          {/* <Row justify={"center"}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              // onPreview={handlePreview}
              pre
              onChange={handleProfileChange}
              className="change_profile_upload"
            >
              <Button className="primary_button2 mt-10">{uploadButton}</Button>
            </Upload>
          </Row> */}
          {!showNameEdit && user?.Name ? (
            <Row justify={"center"} align={"middle"} gutter={8}>
              <Col>
                <p className="name">{user?.Name}</p>
              </Col>
              <Col>
                <EditOutlined
                  className="cursor-pointer"
                  onClick={() => setShowNameEdit(true)}
                />
              </Col>
            </Row>
          ) : (
            <Row justify={"center"} align={"middle"} gutter={8}>
              <Form form={form2} onFinish={(e) => handleNameEdit(e)}>
                <Form.Item name="Name">
                  <Input
                    placeholder="Enter Your Name"
                    className="name_input_box"
                    maxLength={15}
                    suffix={
                      <span
                        className="cursor-pointer"
                        // style={{ marginTop: "4px" }}
                        onClick={() => form2.submit()}
                      >
                        {/* <Image height={20} src={RightIcon} /> */}
                        {/* <RightIcon /> */}
                        <ArrowRightOutlined />
                      </span>
                    }
                  />
                </Form.Item>
              </Form>
            </Row>
          )}

          <Row justify={"center"}>
            <p className="number">{user?.Phone}</p>
          </Row>

          <Button
            onClick={() => {
              Cookies.remove("expireTime");
              localStorage.clear();
              dispatch(setUserDetail({}));
              router.push("/login");
            }}
            className="primary_button3 w-100"
            style={{ marginBottom: "20px" }}
          >
            Logout
          </Button>
        </div>
        <ErrorModal
          title="Invalid referral code or referral code already exist!"
          visible={errorModal}
          setVisible={setErrorModal}
        />
      </Layout>
    </>
  );
}

export default Profile;

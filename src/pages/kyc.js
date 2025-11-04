import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  // DatePicker,
  // Upload,
  Modal,
  message,
  Select,
  DatePicker,
} from "antd";
// import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";
import API_MANAGER from "./api";
import Head from "next/head";
import OtpInput from "react-otp-input";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import moment from "moment";

function KYC() {
  const user = useSelector((state) => state.user.value);

  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewFrontImage, setPreviewImage] = useState("");
  // const [previewTitle, setPreviewTitle] = useState("");
  // const [previewBackImage, setPreviewBackImage] = useState("");
  // const [fileList, setFileList] = useState([]);
  // const [backFileList, setBackFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState();
  const [form] = Form.useForm();
  const [otpBtnDisabled, setOtpBtnDisabled] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);
  const [kycType, setKycType] = useState(null);
  const router = useRouter();
  // const handleCancel = () => setPreviewOpen(false);
  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  //   setPreviewTitle(
  //     file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
  //   );
  // };
  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  // const handleBackChange = ({ fileList: newFileList }) =>
  //   setBackFileList(newFileList);
  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </div>
  // );

  const handleSubmit = async (values) => {
    let params = {
      ...values,
    };
    setLoading(true);

    try {
      // const frontImage = {
      //   extension: values?.front?.file    ? values?.front?.file?.type.split("/")[1]
      //     : "",
      //   type: "kyc",
      //   contentType: values?.front?.file ? values?.front?.file?.type : "",
      // };
      // if (values?.front?.file) {
      //   const responseFront = await API_MANAGER.fileUpload(frontImage);
      //   await axios.put(
      //     responseFront?.data?.data?.url,
      //     values?.front?.file?.originFileObj
      //   );
      //   params["front"] = responseFront?.data?.data  ? responseFront?.data?.data?.key
      //     : "";
      // }
      // const backImage = {
      //   extension: values?.back?.file  ? values?.back?.file?.type.split("/")[1]
      //     : "",
      //   type: "kyc",
      //   contentType: values?.back?.file ? values?.back?.file?.type : "",
      // };
      // if (values?.back?.file) {
      //   const responseBack = await API_MANAGER.fileUpload(backImage);
      //   await axios.put(
      //     responseBack?.data?.data?.url,
      //     values?.back?.file?.originFileObj
      //   );
      //   params["back"] = responseBack?.data?.data     ? responseBack?.data?.data?.key
      //     : "";
      // }
      const response = await API_MANAGER.requestKYC(params);
      setRequestData(response?.data?.data);
      // setOtpModal(true);
      setLoading(false);
      message.success(response?.data?.message || "KYC Requested!");
      // setFileList([]);
      // setBackFileList([]);
      if (response?.data?.data?.sdk_url) {
        router.push(response?.data?.data?.sdk_url);
      }
      form.resetFields();
    } catch (error) {
      setLoading(false);

      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  const handleVerifyOTP = async (values) => {
    try {
      setOtpLoading(true);
      const response = await API_MANAGER.verifyAadharOtp({
        otp: values?.otp,
        request_id: requestData?.request_id,
        task_id: requestData?.task_id,
      });
      if (response?.data?.data?.success) {
        message.success("Your kyc is approved!");
        setOtpModal(false);
        router.push("/withdraw");
      } else {
        message.error("OTP is not valid!");
      }
      setOtpLoading(false);
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Something went wrong, please try again."
      );
      setOtpLoading(false);
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

  const handleSubmitKycByPan = async (values) => {
    let params = {
      ...values,
    };
    setLoading(true);
    try {
      const response = await API_MANAGER.requestKycByPan(params);
      setLoading(false);
      message.success(response?.data?.message || "KYC requested.");
      router.push("/");
      window.location.reload();
      form.resetFields();
    } catch (error) {
      setLoading(false);
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  const handleSubmitKycByDl = async (values) => {
    let dob = values?.dob;
    dob = moment(dob).format("DD-MM-YYYY");

    let params = {
      ...values,
      dob: dob,
    };
    setLoading(true);
    try {
      const response = await API_MANAGER.requestKycByDl(params);
      setLoading(false);
      message.success(response?.data?.message || "KYC requested.");
      router.push("/");
      window.location.reload();
      form.resetFields();
    } catch (error) {
      setLoading(false);
      message.error(error?.response?.data?.message || "Something went wrong!");
    }
  };
  useEffect(() => {
    if (user?.verified === "verified" || user?.verified === "manualverify") {
      message.warning(
        user.verified === "verified"
          ? "Your Kyc is verified"
          : "Your KYC is pending, please wait for sometime or contact with Admin."
      );
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <div>
        <Layout page={"Complete KYC"}>
          <Modal
            open={otpModal}
            centered={true}
            onClose={() => setOtpModal(false)}
            title="Enter otp sent to your registered mobile number"
            footer={false}
            rootClassName="kyc_otp_modal"
          >
            <Form
              requiredMark={false}
              layout="vertical"
              onFinish={handleVerifyOTP}
            >
              <Form.Item
                name="otp"
                rules={[
                  {
                    required: true,
                    message: "OTP is required!",
                  },
                ]}
                label="OTP"
              >
                {/* <Input className="inputBox" placeholder="Enter OTP" /> */}
                <OtpInput
                  value={otp}
                  onChange={handleChangeOtp}
                  numInputs={6}
                  shouldAutoFocus={true}
                  isInputNum={true}
                  inputStyle="otpInput"
                  containerStyle="otpContainer"
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </Form.Item>

              <Form.Item>
                <Row justify={"center"}>
                  <Button
                    htmlType="submit"
                    className="  primary_button2"
                    placeholder="Enter your mobile number"
                    disabled={otpBtnDisabled}
                    loading={otpLoading}
                  >
                    VERIFY
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </Modal>
          <div className="kvc_container">
            <p className="desc">
              You need to submit a document that shows that you are above 18
              years of age and not a resident of Assam, Odisha, Sikkim,
              Nagaland, Telangana, Andhra Pradesh, Tamil Nadu and Karnataka.
            </p>
            <p className="desc">Enter details of Aadhar Card:</p>
            <Form.Item>
              <Select
                onChange={(e) => setKycType(e)}
                className="inputBox"
                placeholder="Select kyc method"
              >
                <Select.Option value="aadhar">Aadhar Kyc</Select.Option>
                <Select.Option value="dl">Driving Licence KYC</Select.Option>
                {/* <Select.Option value="pan">Pan Card KYC</Select.Option> */}
              </Select>
            </Form.Item>
            {kycType === "aadhar" && (
              <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name*"
                      name={"name"}
                      rules={[{ required: true, message: "Name is required!" }]}
                    >
                      <Input
                        placeholder="Please input your name"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Aadhar Number"
                      name="number"
                      rules={[
                        { required: true, message: "Number is required!" },
                      ]}
                    >
                      <Input
                        placeholder="Please input your aadhar number"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {/* <Row>
                <Form.Item
                  label="Upload front photo of your Aadhar"
                  name="front"
                  rules={[
                    { required: true, message: "Front photo is required!" },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList?.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </Row> */}
                {/* <Row>
                <Form.Item
                  label="Upload back photo of your Aadhar"
                  name="back"
                  rules={[
                    { required: true, message: "Back Photo is required!" },
                  ]}
                >
                  <Upload
                    listType="picture-card"
                    fileList={backFileList}
                    onPreview={handlePreview}
                    onChange={handleBackChange}
                  >
                    {backFileList?.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </Row> */}
                {/* <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewFrontImage}
                />
              </Modal> */}
                <Row>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      loading={loading}
                      className="primary_button3"
                    >
                      SUBMIT
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            )}
            {/* {kycType === "pan" && (
              <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={handleSubmitKycByPan}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name*"
                      name={"name"}
                      rules={[{ required: true, message: "Name is required!" }]}
                    >
                      <Input
                        placeholder="Please input your name"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Pan Number"
                      name="number"
                      rules={[
                        { required: true, message: "Number is required!" },
                      ]}
                    >
                      <Input
                        placeholder="Please input your pan number"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      loading={loading}
                      className="primary_button3"
                    >
                      SUBMIT
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            )} */}
            {kycType === "dl" && (
              <Form
                requiredMark={false}
                form={form}
                layout="vertical"
                onFinish={handleSubmitKycByDl}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Name*"
                      name={"name"}
                      rules={[{ required: true, message: "Name is required!" }]}
                    >
                      <Input
                        placeholder="Please input your name"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Driving Licence Number"
                      name="number"
                      rules={[
                        { required: true, message: "Number is required!" },
                      ]}
                    >
                      <Input
                        placeholder="Please input your dl number"
                        className="inputBox"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Date of Birth"
                      name="dob"
                      rules={[{ required: true, message: "DOB is required!" }]}
                    >
                      <DatePicker
                        className="inputBox w-100"
                        placeholder="Please select your dob"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      loading={loading}
                      className="primary_button3"
                    >
                      SUBMIT
                    </Button>
                  </Form.Item>
                </Row>
              </Form>
            )}
          </div>
        </Layout>
      </div>
    </>
  );
}

export default KYC;

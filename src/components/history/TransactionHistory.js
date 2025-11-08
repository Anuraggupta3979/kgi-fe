import React, { useState, useEffect } from "react";
import Image from "next/image";
import CustomPagination from "../common/CustomPagination";
import { Row, Col, Table, Input, message, Drawer, Space, Button } from "antd";
import moment from "moment";
import NoDataImage from "../../Assets/noData.svg";
import API_MANAGER, { HELPERS } from "../../pages/api";
import { EyeFilled } from "@ant-design/icons";
function TransactionHistory({ user }) {
  const [page, setPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setPaymentDetail(null);
  };
  const numberWithCommas = (number) => {
    var parts = number.toString().split(".");
    if (parts?.length > 0) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
    return number;
  };

  const getTransactionHistory = async (id) => {
    try {
      const response = await API_MANAGER.getTransactionHistory(user?._id, page);
      const decryptedData = HELPERS.decrypt(response?.data?.data);
      setData(decryptedData?.result);

      setNumberOfPages(decryptedData?.totalCount);
    } catch (error) {
      message.error("Something went wrong!");
    }
  };
  const cancelWithdrawalRequest = async (id) => {
    try {
      const response = await API_MANAGER.cancelWithdrawalRequest(
        {
          status: "FAILED",
        },
        id
      );
      getTransactionHistory();
    } catch (error) {}
  };
  const checkDepositRabyPay = async (order_id) => {
    try {
      await API_MANAGER.depositUpiRmsPayresponse({ order_id });
      getTransactionHistory();
    } catch (error) {}
  };
  useEffect(() => {
    if (user?._id) {
      getTransactionHistory();
    }
  }, [page, user]);

  const columns = [
    {
      title: "Description",
      dataIndex: "txn_msg",
      // align: "center",
      width: 200,
      render: (item, row) => {
        return (
          <div>
            <b>
              <span style={{ textTransform: "uppercase" }}>
                {" "}
                {row?.Req_type === "manualwithdraw" ||
                row?.Req_type === "withdraw"
                  ? "Payout"
                  : "Deposit"}
              </span>{" "}
              {row?.Req_type !== "bonus" && (
                <>
                  {row?.status === "none" ||
                  (row?.status === "Pending" &&
                    (row?.Req_type === "withdraw" ||
                      row?.Req_type === "manualwithdraw"))
                    ? "Pending"
                    : row?.status === "Pending" && row?.Req_type === "deposit"
                    ? "Pending"
                    : row?.status}
                </>
              )}
              {((row?.Req_type === "withdraw" && row?.status === "SUCCESS") ||
                (row?.Req_type === "deposit" && row?.status === "PAID")) && (
                <EyeFilled
                  style={{
                    marginLeft: "3px",
                    color: "green",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPaymentDetail(row);
                    setOpen(true);
                  }}
                />
              )}
              {row?.payment_gatway === "depositrmspay" &&
                row?.order_id &&
                row?.Req_type === "deposit" &&
                row?.status === "Pending" && (
                  <Button
                    onClick={() => checkDepositRabyPay(row?._id)}
                    className="change_password_button"
                  >
                    <span style={{ color: "white" }}>Check Status</span>
                  </Button>
                )}
            </b>
            <br />
            <span style={{ fontSize: "10px" }}>
              {row?.txn_msg ? row?.txn_msg : ""}
            </span>
          </div>
        );
      },
    },

    {
      title: "Date | Time",
      dataIndex: "date",
      align: "center",
      width: 137,
      render: (item, row) => (
        <span style={{ fontSize: "12px" }}>
          {moment(row?.createdAt).format("DD/MM/YYYY")}
          <br /> {moment(row?.createdAt).format("h:mm a")}{" "}
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      align: "center",
      render: (item, row) => {
        let signIcon = "";
        if (
          (row?.Req_type === "deposit" ||
            row?.Req_type === "bonus" ||
            row?.Req_type === "redeem") &&
          row?.status != "FAILED"
        ) {
          if (row?.status === "Pending" && row?.Req_type === "deposit") {
            signIcon = "X";
          } else {
            signIcon = "+";
          }
        } else if (
          (row?.Req_type === "withdraw" ||
            row?.Req_type === "manualwithdraw") &&
          row?.status != "FAILED"
        ) {
          signIcon = "-";
        } else if (row?.Req_type === "penalty" && row?.status != "FAILED") {
          signIcon = "-";
        } else if (row?.status === "Pending" || row?.status === "FAILED") {
          signIcon = "X";
        }
        return (
          <span>
            <b style={{ color: "red" }}>{signIcon}</b>
            <b> {` ${numberWithCommas(row?.amount)}`}</b>
            <br />
            <span style={{ fontSize: "10px" }}>
              Closing Balance:{" "}
              {numberWithCommas(
                row?.closing_balance ? row?.closing_balance : 0
              )}
            </span>
          </span>
        );
      },
    },
  ];
  return (
    <div style={{ height: "100%" }}>
      <Drawer
        title={
          <Row justify={"center"}>
            <Col>
              {paymentDetail?.Req_type === "deposit" ? "Deposit" : "Withdrawal"}{" "}
              Details
            </Col>
          </Row>
        }
        placement={"bottom"}
        width={500}
        onClose={onClose}
        open={open}
        // closable={false}
        rootClassName="payment_detail_drawer"
        className=""
      >
        {paymentDetail?.status && (
          <Row justify={"space-between"} className="item_row">
            <Col>Status:</Col>
            <Col>{paymentDetail?.status}</Col>
          </Row>
        )}
        {paymentDetail?.createdAt && (
          <Row justify={"space-between"} className="item_row">
            <Col>Request Time:</Col>
            <Col>{moment(paymentDetail?.createdAt).format("LLL")}</Col>
          </Row>
        )}{" "}
        {paymentDetail?.updatedAt && (
          <Row justify={"space-between"} className="item_row">
            <Col>Proceed Time:</Col>
            <Col>{moment(paymentDetail?.updatedAt).format("LLL")}</Col>
          </Row>
        )}
        {paymentDetail?.Withdraw_type && (
          <Row justify={"space-between"} className="item_row">
            <Col>Withdrawal Type:</Col>
            <Col>{paymentDetail?.Withdraw_type}</Col>
          </Row>
        )}
        {paymentDetail?.amount && (
          <Row justify={"space-between"} className="item_row">
            <Col>Amount:</Col>
            <Col>{paymentDetail?.amount}</Col>
          </Row>
        )}
        {paymentDetail?.holder_name && (
          <Row justify={"space-between"} className="item_row">
            <Col>Account Holder Name:</Col>
            <Col>{paymentDetail?.holder_name}</Col>
          </Row>
        )}
        {paymentDetail?.upi_id && (
          <Row justify={"space-between"} className="item_row">
            <Col> UPI ID:</Col>
            <Col>{paymentDetail?.upi_id}</Col>
          </Row>
        )}
        {paymentDetail?.account_number && (
          <Row justify={"space-between"} className="item_row">
            <Col> Account No:</Col>
            <Col>{paymentDetail?.account_number}</Col>
          </Row>
        )}
        {paymentDetail?.bank_name && (
          <Row justify={"space-between"} className="item_row">
            <Col> Bank:</Col>
            <Col>{paymentDetail?.bank_name}</Col>
          </Row>
        )}
        {paymentDetail?.ifsc_code && (
          <Row justify={"space-between"} className="item_row">
            <Col>IFSC Code:</Col>
            <Col>{paymentDetail?.ifsc_code}</Col>
          </Row>
        )}
        {paymentDetail?.UTR_number && (
          <Row justify={"space-between"} className="item_row">
            <Col>Order ID:</Col>
            <Col>{paymentDetail?.UTR_number}</Col>
          </Row>
        )}
        {paymentDetail?._id && (
          <Row justify={"space-between"} className="item_row">
            <Col>Reference ID:</Col>
            <Col>{paymentDetail?._id}</Col>
          </Row>
        )}
      </Drawer>
      {data?.length > 0 ? (
        <>
          <Table
            pagination={false}
            dataSource={data}
            columns={columns}
            // scroll={{ x: "calc(450px + 60%)" }}
          />
          <CustomPagination
            currentPage={page}
            setCurrentPage={setPage}
            total={numberOfPages}
            itemPerPage={10}
          />
        </>
      ) : (
        <div className="noDataContainer">
          <div>
            <Row justify={"center"}>
              <p className="desc">No Transaction History !</p>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionHistory;

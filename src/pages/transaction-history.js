import React from "react";
import TransactionHistory from "../components/history/TransactionHistory";
import Layout from "@/components/layout";
import { useSelector } from "react-redux";
function TransactionHistoryPage() {
  const user = useSelector((state) => state.user.value);

  return (
    <>
      <Layout page={"Transaction History"}>
        <div className="history_container">
          <div className="historyContentContainer">
            <div className="content_container">
              <div className="pageContent">
                <TransactionHistory user={user} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default TransactionHistoryPage;

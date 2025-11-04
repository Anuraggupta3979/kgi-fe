import React, { useState } from "react";
import { Pagination, Row, Col } from "antd";
function CustomPagination({ currentPage, setCurrentPage, total, itemPerPage }) {
  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <a>
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1L1 6L6 11"
              stroke="#1B2444"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      );
    }
    if (type === "next") {
      return (
        <a>
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L6 6L1 11"
              stroke="#1B2444"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      );
    }
    return originalElement;
  };

  //  total === 0 ? 0 : (current - 1) * pageSize + 1,
  //     current * pageSize > total ? total : current * pageSize,
  return (
    <div className="customPagination">
      <Row justify={"end"} align={"middle"}>
        {/* <Col className="subDesc mt-3">
          Rows per page{" "}
          <span>
            {(currentPage * itemPerPage > total
              ? total
              : currentPage * itemPerPage) %
              itemPerPage ===
            0
              ? itemPerPage
              : (currentPage * itemPerPage > total
                  ? total
                  : currentPage * itemPerPage) % itemPerPage}
          </span>
        </Col> */}
        <Col>
          <Pagination
            itemRender={itemRender}
            simple
            total={total}
            current={currentPage}
            showTotal={(total, range) => (
              <span className="subDesc pageNumbers">
                {range[0]}-{range[1]} of {total}
              </span>
            )}
            onChange={(page) => setCurrentPage(page)}
            showTitle={false}
            defaultPageSize={itemPerPage}
            defaultCurrent={1}
            pageSizeOptions={[10]}
            hideOnSinglePage
            showQuickJumper={false}
          />
        </Col>
      </Row>
    </div>
  );
}

export default CustomPagination;

import { Button, Select } from "antd";
import React, { useMemo } from "react";
import { DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ROLE_ADMIN } from "../constant/role";
import { useFilterState } from "../context/FilterContext";
const { RangePicker } = DatePicker;

function Filter({ fetchData }) {
  const { curCompany, updateCurCompany, companyList, updateDateRange } =
    useFilterState();

  const isAdmin = useMemo(
    () => JSON.parse(sessionStorage.getItem("authority"))?.includes(ROLE_ADMIN),
    []
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        flexWrap: "wrap",
        gap: "0.3rem",
      }}
    >
      {isAdmin && <p style={{ margin: "auto 0" }}>{curCompany.feeRate}</p>}
      <Select
        placeholder="회사"
        onChange={updateCurCompany}
        value={curCompany.companyName}
        style={{ width: "8rem" }}
      >
        {companyList?.map((company) => (
          <Select.Option value={company.companyName} key={company.companyName}>
            {company.companyName}
          </Select.Option>
        ))}
      </Select>
      <RangePicker
        placeholder={["입금날짜", "입금날짜"]}
        autoFocus={true}
        onChange={updateDateRange}
        className="onepage"
      />

      <Button icon={<SearchOutlined />} onClick={fetchData}>
        조회
      </Button>
    </div>
  );
}

export default Filter;

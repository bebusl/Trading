import React from "react";

function ListedData({ data }) {
  return (
    <ul>
      <li>
        <b>입출금일자|</b> {data?.txTime}
      </li>
      <li>
        <b>은 행|</b>
        {data?.bank}
      </li>
      <li>
        <b>이체유형|</b>
        {data?.txType === "WITHDRAW" ? "출금" : "입금"}
      </li>
      <li>
        <b>입/출금자명|</b> {data?.name}
      </li>
      <li>
        <b>입/출금금액|</b>
        {data?.amount}
      </li>
      <li>
        <b>수수료|</b> {data?.fee}
      </li>
      <li>
        <b>잔금|</b> {data?.balance}
      </li>
      <li>
        <b>잔액|</b> {data?.totalAmount}
      </li>
    </ul>
  );
}

export default ListedData;

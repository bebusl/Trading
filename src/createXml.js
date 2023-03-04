export default function createXml(content) {
  const XLSX = require("xlsx-js-style");
  const wb = XLSX.utils.book_new();

  let cnt = content.length;

  //데이터 형식 변경해줄 Mapper
  const dataMapper = {
    txTime: { t: "s", s: { alignment: { horizontal: "center" } } },
    txType: {
      valueMapper: (v) => (v === "WITHDRAW" ? "출금" : "입금"),
      t: "s",
      s: { alignment: { horizontal: "center" } },
    },
    name: { t: "s", s: { alignment: { horizontal: "center" } } },
    amount: {
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    fee: {
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    balance: {
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    totalAmount: {
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    bank: { t: "s", s: { alignment: { horizontal: "center" } } },
  };

  const keyOfMapper = Object.keys(dataMapper);

  //합계를 위한 변수
  let sumOfAmount = 0;
  let sumOfFee = 0;
  let sumOfBalance = 0;

  // 인자를 excel로 만들 수 있도록 dataMapper로 매핑함
  const formedContent = content.map((item) => {
    const data = [
      { v: cnt--, t: "n", s: { alignment: { horizontal: "center" } } },
    ];
    keyOfMapper.forEach((key) =>
      data.push({
        v: dataMapper[key].valueMapper
          ? dataMapper[key].valueMapper(item[key])
          : item[key],
        t: dataMapper[key].t,
        s: dataMapper[key].s,
      })
    );
    sumOfAmount += item.amount;
    sumOfBalance += item.balance;
    sumOfFee += item.fee;
    return data;
  });

  const header = [
    { v: "No.", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "이체시간", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "입금타입", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "입/출금자", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "입/출금금액", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "수수료", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "잔급", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "잔액", t: "s", s: { alignment: { horizontal: "center" } } },
    { v: "은행", t: "s", s: { alignment: { horizontal: "center" } } },
  ];

  const total = [
    { v: "", t: "s" },
    { v: "", t: "s" },
    { v: "", t: "s" },
    { v: "", t: "s" },
    {
      v: sumOfAmount,
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    {
      v: sumOfFee,
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    {
      v: sumOfBalance,
      t: "n",
      s: { alignment: { horizontal: "center" }, numFmt: "#,###" },
    },
    { v: "", t: "s" },
    { v: "", t: "s" },
  ];

  // 워크시트 생성
  const ws = XLSX.utils.aoa_to_sheet([header, ...formedContent, total]);
  ws["!cols"] = [
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
    { width: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, ws, "sheet1");

  // 브라우저에서 다운
  XLSX.writeFile(wb, `bankone-${Date.now()}.xlsx`);
}

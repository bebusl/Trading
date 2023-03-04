const SSEServer = require("sse-fake-server");

const createRandomData = (min = 10000, max = 20000000) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const companyName = ["benz", "made", "macao", "gangnam", "air", "test"];

const createTx = () => {
  const data = {
    amount: createRandomData(),
    balance: createRandomData(),
    bank: "KB",
    companyName: companyName[createRandomData(0, 5)],
    fee: createRandomData(),
    name: "테스트이름",
    totalAmoun: createRandomData(),
    txTime: new Date(),
    txType: "DEPOSIT",
  };
  const flattenData = JSON.stringify(data);
  return flattenData;
};

const createDashboard = () => {
  const data = {
    companyName: companyName[createRandomData(0, 5)],
    ytotalDeposit: createRandomData(),
    ytotalWithdraw: createRandomData(),
    ytotalFee: createRandomData(),
    ytotalBalance: createRandomData(),
    totalDeposit: createRandomData(),
    totalWithdraw: createRandomData(),
    totalFee: createRandomData(),
    totalBalance: createRandomData(),
  };
  const flattenData = JSON.stringify(data);
  return flattenData;
};

SSEServer((client) => {
  setInterval(() => {
    client.customSend("dashboard", createDashboard());
    client.customSend("tx", createTx());
  }, 10000);
});

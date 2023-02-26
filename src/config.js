if (process.env.NODE_ENV === "production") {
  console.log = console.debug = console.error = () => {};
}

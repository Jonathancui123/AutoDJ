const production = {
  backendAddress: "http://autodj123.herokuapp.com"
};

const development = {
  backendAddress: "http://localhost:3000"
};

export default process.env.NODE_ENV === "development"
  ? development
  : production;

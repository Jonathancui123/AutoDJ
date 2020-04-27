const production = {
  backendAddress: "http://autodj-backend.herokuapp.com",
  frontendAddress: "http://autodj-frontend.herokuapp.com"
};

const development = {
  backendAddress: "http://localhost:3000",
  frontendAddress: "http://localhost:3001"
};

export default process.env.NODE_ENV === "development"
  ? development
  : production;

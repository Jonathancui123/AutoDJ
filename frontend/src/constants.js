const production = {
  backendAddress: "https://autodj-backend.herokuapp.com",
  frontendAddress: "https://autodj-frontend.herokuapp.com"
};

const development = {
  backendAddress: "http://localhost:3000",
  frontendAddress: "http://localhost:3001"
};

export default process.env.NODE_ENV === "development"
  ? development
  : production;

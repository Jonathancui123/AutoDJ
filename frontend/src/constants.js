const production = {
    backendAddress : "https://autodj123.herokuapp.com"
};

const development = {
    backendAddress : "https://localhost:3000"
};


export default process.env.NODE_ENV === 'development' ? development : production;
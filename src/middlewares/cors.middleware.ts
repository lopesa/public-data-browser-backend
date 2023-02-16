import cors from "cors";

const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const corsMiddleware = () => {
  return cors(options);
};

export default corsMiddleware;

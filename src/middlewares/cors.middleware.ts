import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.publicdatabrowser.com",
  "https://publicdatabrowser.com",
  "https://databrowserprototype.lopesdesign.com",
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

const corsMiddleware = () => {
  return cors(options);
};

export default corsMiddleware;

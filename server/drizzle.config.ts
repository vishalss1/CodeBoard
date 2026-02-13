import "dotenv/config";

export default {
  dialect: "postgresql",
  schema: "./src/config/schema.ts",
  out: "./config",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

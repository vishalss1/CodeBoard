import "dotenv/config";

export default {
  dialect: "postgresql",
  schema: "./src/config/schema.ts",
  out: "./src/config/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};

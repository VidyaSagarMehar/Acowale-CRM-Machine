function getEnv(name: "MONGODB_URI" | "JWT_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  mongodbUri: getEnv("MONGODB_URI"),
  jwtSecret: getEnv("JWT_SECRET")
};

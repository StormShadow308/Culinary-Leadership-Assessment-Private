declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: string;
    // Drizzle
    DATABASE_URL: string;
    // Authentication
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    // Email
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
  }
}

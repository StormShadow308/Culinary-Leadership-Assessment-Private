declare namespace NodeJS {
  interface ProcessEnv {
    // Database
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_PORT: string;
    // Drizzle
    DATABASE_URL: string;
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    // Email
    RESEND_API_KEY: string;
    EMAIL_FROM: string;
  }
}

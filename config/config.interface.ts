export interface AppConfig {
  port: number | 3000;
  jwtSecret: string;
  frontend: string;
  fileServer: string;
  mode: string;
  database: {
    host: string | 'localhost';
    port: number | 5432;
  };
  mail: {
    user: string;
    password: string;
    host: string;
  };
}

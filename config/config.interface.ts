export interface AppConfig {
  port: number | 3000;
  jwtSecret: string;
  frontend: string;
  mode: string;
  database: {
    host: string | 'localhost';
    port: number | 5432;
  };

  meili: {
    host: string;
    key: string;
  };
  mail: {
    host: string;
    user: string;
    password: string;
    from: string;
  };
  redis: {
    host: string | 'localhost';
    port: number | 6379;
    username: string;
    password: string;
  };
}

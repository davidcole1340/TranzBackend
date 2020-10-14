declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    TRANZQL_PORT: number,
    HOLIDAY_TIMETABLE: string,
    SSL_KEY_PATH: string|undefined,
    AT_API_KEY: string,
    NODE_ENV: 'development' | 'production'
  }
}
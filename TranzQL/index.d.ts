declare var process: {
  env: {
    MONGO_HOST: string,
    MONGO_DB: string,
    MONGO_GTFS_DB: string,
    HOLIDAY_TIMETABLE: string,
    AT_API_KEY: string,
    NODE_ENV: 'development' | 'production'
  }
}
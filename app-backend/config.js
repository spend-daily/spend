export const DB_NAME = process.env.DB_NAME || 'spend'
export const DB_USER = process.env.DB_USER || 'spend'
export const DB_PASSWORD = process.env.DB_PASSWORD || ''
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 5432

export const DB_ENDPOINT = encodeURI(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
)

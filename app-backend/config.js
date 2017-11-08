export const DB_NAME = process.env.DB_NAME || 'spend'
export const DB_USER = process.env.DB_USER || 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_ADDRESS = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 5432

export const DB_ENDPOINT = encodeURI(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_ADDRESS}:${DB_PORT}/${DB_NAME}`
)

export const jwtConstants = {
  access_secret: process.env.JWT_CLIENT_SECRET,
  admin_access_secret: process.env.JWT_ADMIN_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET,
};

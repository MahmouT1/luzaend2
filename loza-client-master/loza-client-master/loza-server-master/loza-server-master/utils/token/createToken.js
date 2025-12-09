import jwt from "jsonwebtoken";

export const createToken = (user, statusCode, res) => {
  // Use fallback values for development if environment variables are not set
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
  const jwtExpire = process.env.JWT_EXPIRE || '7d';

  const token = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: jwtExpire,
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // Changed from "strict" to "lax" for development
    secure: false, // Set to false for development
  });

  res.status(statusCode).json({
    user: {
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    },
    token: token
  });
};

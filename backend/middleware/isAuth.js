import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.tocken; // ✅ keep "tocken" as per your usage

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // ✅ use .id because that’s how you signed it

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default isAuth;




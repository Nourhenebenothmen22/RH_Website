const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) 
    return res.status(403).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) 
    return res.status(403).json({ message: "Token missing in Authorization header" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ 
      message: "Invalid token",
      error: error.message 
    });
  }
};

const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) 
    return res.status(403).json({ message: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) 
    return res.status(403).json({ message: "Token missing in Authorization header" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Vérification insensible à la casse
    if (!req.user.itemtype || req.user.itemtype.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins Only" });
    }
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ 
      message: "Invalid token",
      error: error.message 
    });
  }
};

module.exports = { verifyToken, verifyTokenAdmin };
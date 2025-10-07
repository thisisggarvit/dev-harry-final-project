import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    console.warn("⚠️ No token provided");
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");

    // Debug log to confirm token payload
    console.log("✅ Auth middleware verified user:", decoded);

    // Attach user info to request
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

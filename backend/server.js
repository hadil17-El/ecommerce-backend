import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commerce-site-butb.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

import registerRoutes from "./routes/register.js";
import loginRoutes from "./routes/login.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import ordersRoutes from "./routes/orders.js";
import favoritesRoutes from "./routes/favorites.js";
import analyticsRoutes from "./routes/analytics.js";
import usersRoutes from "./routes/users.js";

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/products", productsRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/orders", ordersRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/users", usersRoutes);
app.get("/debug-env", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    hostLength: process.env.DB_HOST ? process.env.DB_HOST.length : 0
  });
});
import dns from "dns";

app.get("/debug-dns", (req, res) => {
  dns.lookup(process.env.DB_HOST, (err, address) => {
    if (err) {
      return res.json({ error: err.message, code: err.code });
    }
    res.json({ address });
  });
});
app.get("/debug-dns2", (req, res) => {
  dns.lookup("google.com", (err, address) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json({ address });
  });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import { DataGrid } from "@mui/x-data-grid";

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [userRes, orderRes, productRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/user/all"),
          axios.get("http://localhost:8080/api/orders"),
          axios.get("http://localhost:8080/api/v1/product/all"),
        ]);
        setUsers(userRes.data);
        setOrders(orderRes.data);
        setProducts(productRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const chartData = {
    users: [
      { name: "Sellers", value: users.filter(u => u.role === "SELLER").length },
      { name: "Buyers", value: users.filter(u => u.role === "BUYER").length },
    ],
    orders: [
      { name: "Pending", value: orders.filter(o => o.status === "Pending").length },
      { name: "Approved", value: orders.filter(o => o.status === "ACCEPTED").length },
      { name: "Delivered", value: orders.filter(o => o.status === "Delivered").length },
    ],
    products: [
      { name: "Available", value: products.filter(p => p.available).length },
      { name: "Out of Stock", value: products.filter(p => !p.available).length },
    ],
  };

  const rows =
    selectedView === "users" ? users :
    selectedView === "orders" ? orders :
    selectedView === "products" ? products : [];

  const columns = {
    users: [
      { field: "id", headerName: "ID", width: 70 },
      { field: "telegramId", headerName: "Telegram ID", width: 150 },
      { field: "chatId", headerName: "Chat ID", width: 180 },
      { field: "username", headerName: "Username", width: 150 },
      { field: "role", headerName: "Role", width: 120 },
      { field: "telegramChannel", headerName: "TelegramChannel", width: 150 },
      { field: "latitude", headerName: "Latitude", width: 120 },
      { field: "longitude", headerName: "Longitude", width: 120 },
    ],
    orders: [
      { field: "id", headerName: "ID", width: 70 },
      { field: "productName", headerName: "Product", width: 150 },
      { field: "buyer", headerName: "Buyer", width: 150 },
      { field: "seller", headerName: "Seller", width: 150 },
      { field: "status", headerName: "Status", width: 120 },
      { field: "totalPrice", headerName: "Total Price", width: 130, type: "number" },
    ],
    products: [
      { field: "id", headerName: "ID", width: 70 },
      { field: "productName", headerName: "Product Name", width: 200 },
      { field: "price", headerName: "Price", width: 100, type: "number" },
      { field: "stockQuantity", headerName: "Stock Quantity", width: 150 },
      { field: "category", headerName: "Category", width: 120 },
      { field: "description", headerName: "Description", width: 300 },
      {
        field: "sellerUsername",
        headerName: "Seller Username",
        width: 180,
        renderCell: (params) => params.row?.seller?.username ?? "N/A",
      },
      {
        field: "available",
        headerName: "Available",
        width: 120,
        type: "boolean"
      },
    ],
  };

  const SummaryCard = ({ icon, label, value, color }) => (
    <Card sx={{ width: 250, m: 1, background: color, color: 'white' }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon} {label}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <nav style={{
        width: 220,
        background: "#212121",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        fontSize: 16
      }}>
        <h2 style={{ color: "#00C49F" }}>Admin Panel</h2>
        {["dashboard", "users", "orders", "products"].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            style={{
              margin: "0.5rem 0",
              padding: "0.6rem",
              background: selectedView === view ? "#424242" : "transparent",
              color: "white",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              borderRadius: 6
            }}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: "1.5rem",
        background: "#f4f6f8",
        overflowY: "auto"
      }}>
        <h1 style={{ marginBottom: 20 }}>
          {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Dashboard
        </h1>

        {selectedView === "dashboard" && (
          <Box display="flex" flexWrap="wrap" mb={4}>
            <SummaryCard icon={<GroupIcon />} label="Total Users" value={users.length} color="#1976d2" />
            <SummaryCard icon={<GroupIcon />} label="Sellers" value={users.filter(u => u.role === "SELLER").length} color="#388e3c" />
            <SummaryCard icon={<GroupIcon />} label="Buyers" value={users.filter(u => u.role === "BUYER").length} color="#f57c00" />
            <SummaryCard icon={<ShoppingCartIcon />} label="Orders" value={orders.length} color="#d32f2f" />
            <SummaryCard icon={<StoreIcon />} label="Products" value={products.length} color="#7b1fa2" />
          </Box>
        )}

        {selectedView !== "dashboard" && (
          <>
            {/* Charts Section */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
              {/* Pie Chart */}
              <div style={{ background: "#fff", padding: "1rem", borderRadius: 10 }}>
                <h3 style={{ textAlign: "center" }}>Pie Chart</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={chartData[selectedView]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {chartData[selectedView].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              {/* Bar Chart */}
              <div style={{ background: "#fff", padding: "1rem", borderRadius: 10 }}>
                <h3 style={{ textAlign: "center" }}>Bar Chart</h3>
                <BarChart
                  width={400}
                  height={300}
                  data={chartData[selectedView]}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </div>
            </div>

            {/* Data Table */}
            <div style={{
              height: 400,
              background: "white",
              borderRadius: 8,
              padding: "1rem"
            }}>
              <DataGrid
                rows={rows}
                columns={columns[selectedView]}
                loading={loading}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                getRowId={(row) => row.id}
                sx={{ textAlign: "center" }}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (selectedView === "users") {
          const res = await axios.get("http://localhost:8080/api/v1/user/all");
          setUsers(res.data);
        } else if (selectedView === "orders") {
          const res = await axios.get("http://localhost:8080/api/orders");
          setOrders(res.data);
        } else if (selectedView === "products") {
          const res = await axios.get("http://localhost:8080/api/v1/product/all");
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedView]);

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
      // {
      //   field: "image",
      //   headerName: "Image",
      //   width: 100,
      //   renderCell: (params) =>
      //     params.value ? (
      //       <img
      //         src={params.value}
      //         alt="Product"
      //         style={{ width: 60, height: 60, objectFit: "cover" }}
      //       />
      //     ) : (
      //       "No Image"
      //     ),
      // },
    ],
  };

  const rows =
    selectedView === "users" ? users :
    selectedView === "orders" ? orders :
    products;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <nav style={{
        width: 200,
        background: "#222",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "1rem"
      }}>
        <h2>Admin Panel</h2>
        <button
          style={{
            margin: "0.5rem 0",
            padding: "0.5rem",
            background: selectedView === "users" ? "#444" : "transparent",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setSelectedView("users")}
        >
          Users
        </button>
        <button
          style={{
            margin: "0.5rem 0",
            padding: "0.5rem",
            background: selectedView === "orders" ? "#444" : "transparent",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setSelectedView("orders")}
        >
          Orders
        </button>
        <button
          style={{
            margin: "0.5rem 0",
            padding: "0.5rem",
            background: selectedView === "products" ? "#444" : "transparent",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => setSelectedView("products")}
        >
          Products
        </button>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: "1rem",
        background: "#f5f5f5",
        overflowY: "auto"
      }}>
        <h1>{selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} Dashboard</h1>

        {/* Chart Section */}
        <div style={{ maxWidth: 400, marginBottom: 30 }}>
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
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../backend/cust";

const Login  = () => {
     const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("CUST123");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    console.log(customerId);
    
    const user = await service.getAccount(customerId);
    localStorage.setItem("customer" , JSON.stringify(user));

     console.log(user);
     

    navigate("/dashboard");
  };
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-sky-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">FinTech Demo Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        <form className="space-y-5" onSubmit={onLogin}>
          <div className="space-y-2">
            <label htmlFor="customerId">Customer ID</label>
            <input id="customerId" value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="CUST123" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full h-11 text-base">Login</button>
        </form>
      </div>
    </div>
    )
}
export default Login;
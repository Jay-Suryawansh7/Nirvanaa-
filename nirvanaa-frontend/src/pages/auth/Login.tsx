import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Store token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Redirect based on role
        if (data.role === "JUDGE") navigate("/dashboard/judge");
        else if (data.role === "LAWYER") navigate("/dashboard/lawyer");
        else if (data.role === "STAFF") navigate("/dashboard/staff");
        else navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    },
    onError: (error: any) => {
      console.log("Login error response:", error.response?.data);
      const msg = error.response?.data?.message || "Login failed";
      alert(`Login failed: ${msg}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to Auchitya</CardTitle>
          <CardDescription>Enter your credentials to access the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@court.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <div className="pt-4 flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate("/")}>Cancel</Button>
                <Button type="submit" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Logging in..." : "Login"}</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

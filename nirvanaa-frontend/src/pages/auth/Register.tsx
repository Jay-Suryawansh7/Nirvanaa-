import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "LAWYER" // Default
  });
  
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async () => {
      // Ensure we send the data structure the backend expects
      const res = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword, // Backend now validates this
        role: formData.role
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    },
    onError: (error: any) => {
        console.log("Registration error response:", error.response?.data);
        const msg = error.response?.data?.message || "Registration failed";
        alert(`Error: ${msg}`);
    }
  });

  const validatePassword = (pass: string) => {
    const criteria = {
        length: pass.length >= 8,
        upper: /[A-Z]/.test(pass),
        lower: /[a-z]/.test(pass),
        number: /[0-9]/.test(pass),
        special: /[^A-Za-z0-9]/.test(pass) // Adjusted regex to allow common special chars
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (id === "password") {
        validatePassword(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) {
        alert("Please meet all password requirements.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    registerMutation.mutate();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Register for Auchitya Justice Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@court.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <select id="role" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={formData.role} onChange={handleChange}>
                    <option value="LAWYER">Lawyer</option>
                    <option value="JUDGE">Judge</option>
                    <option value="STAFF">Court Staff</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                
                {/* Password Strength Indicators */}
                <div className="text-xs space-y-1 mt-2 p-3 bg-muted rounded-md text-muted-foreground">
                    <p className="font-medium mb-1">Password Guidelines:</p>
                    <div className="grid grid-cols-2 gap-1">
                        <span className={passwordCriteria.length ? "text-green-600 font-medium" : ""}>• 8+ Characters</span>
                        <span className={passwordCriteria.upper ? "text-green-600 font-medium" : ""}>• Uppercase (A-Z)</span>
                        <span className={passwordCriteria.lower ? "text-green-600 font-medium" : ""}>• Lowercase (a-z)</span>
                        <span className={passwordCriteria.number ? "text-green-600 font-medium" : ""}>• Number (0-9)</span>
                        <span className={passwordCriteria.special ? "text-green-600 font-medium" : ""}>• Special Char</span>
                    </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <div className="pt-4 flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate("/")}>Cancel</Button>
                <Button type="submit" disabled={registerMutation.isPending}>{registerMutation.isPending ? "Registering..." : "Register"}</Button>
              </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

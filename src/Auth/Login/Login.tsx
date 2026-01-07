import { useState } from "react";
import axios from "../../api/axios"; // axios instance (withCredentials = true)
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInput = (e: { target: { name: any; value: any; }; }) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post("/api/auth/login", {
        email: user.email,
        password: user.password,
      });
      toast.success(res.data.message );
      setUser({ email: "", password: "" });
      // navigate("/dashboard");
        if (res.data.user.role === "admin") {
        navigate("/auth/admin");
      } else {
        navigate("/auth/user");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            Login to Your Account
          </CardTitle>
          <CardDescription>
            Login using your official email address
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@domain.gov"
                value={user.email}
                onChange={handleInput}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={user.password}
                onChange={handleInput}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white"
            >
              {loading ? "Login..." : "Login"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
                Don't have an account? Register 
                <Link to="/register" className="underline text-blue-600">here</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

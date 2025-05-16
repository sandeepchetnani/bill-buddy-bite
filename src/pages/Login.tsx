
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { restaurantInfo } from '../data/mockData';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { login, isLoggedIn, isAdmin, isWaiter } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin()) {
        navigate('/');
      } else if (isWaiter()) {
        navigate('/tables');
      }
    }
  }, [isLoggedIn, navigate, isAdmin, isWaiter]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('Login successful!');
        if (isAdmin()) {
          navigate('/');
        } else if (isWaiter()) {
          navigate('/tables');
        }
      } else {
        setError('Invalid username or password');
        toast.error('Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-restaurant-primary">
            {restaurantInfo.name}
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Enter username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Admin: thebasefour / thebasefour98</p>
              <p>Waiter: waiter / waiter123</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-restaurant-primary hover:bg-restaurant-secondary" 
              type="submit"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

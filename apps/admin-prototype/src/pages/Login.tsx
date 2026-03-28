import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { useAppData } from '../context/AppDataContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { state } = useAppData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== 'admin') {
      setError('Invalid password. Hint: it is "admin"');
      return;
    }

    const foundUser = state.users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (foundUser) {
      login(foundUser);
    } else {
      setError('User not found. Try DeV, Leader, or Member.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 mb-4">
            <Lock className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Prototype</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your dummy credentials to access the sandbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="DeV, Leader, or Member"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-300" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 focus-visible:ring-blue-500"
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-sm text-zinc-500 border-t border-zinc-800 pt-4 mt-4 text-center">
          <p>Available dummy logins (Password is always 'admin'):</p>
          <ul className="mt-2 space-y-1">
            <li><span className="text-blue-400 font-medium">DeV</span> - Master Role</li>
            <li><span className="text-blue-400 font-medium">Leader</span> - Leader Role</li>
            <li><span className="text-blue-400 font-medium">Member</span> - Member Role</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  );
}
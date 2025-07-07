
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  onLogin: (email: string) => void;
}

const AuthForm = ({ onLogin }: AuthFormProps) => {
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      onLogin(loginForm.email);
      toast.success("Welkom terug! 🌟");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.name && signupForm.email && signupForm.password) {
      onLogin(signupForm.email);
      toast.success("Account aangemaakt! Welkom! 🎉");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Book className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Verhaaltjes App</h1>
          <p className="text-purple-600">Magische bedtijdverhalen voor kinderen</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-700">
              {showLogin ? "Inloggen" : "Account Maken"}
            </CardTitle>
            <CardDescription className="text-purple-600">
              {showLogin ? "Welkom terug, kleine dromer!" : "Begin je verhalenavontuur!"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-purple-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-purple-700">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6">
                  Inloggen ✨
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-purple-700">Naam</Label>
                  <Input
                    id="name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-purple-700">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-purple-700">Wachtwoord</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6">
                  Account Maken 🌟
                </Button>
              </form>
            )}
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowLogin(!showLogin)}
                className="text-purple-600 hover:text-purple-700"
              >
                {showLogin ? "Nog geen account? Maak er een!" : "Al een account? Log in hier!"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;

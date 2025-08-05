import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: ""
  });
  
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Vul alle velden in");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Wachtwoord moet minimaal 6 karakters zijn");
      return;
    }

    if (!isLogin && !formData.displayName) {
      toast.error("Vul je naam in");
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Onjuiste email of wachtwoord");
          } else {
            toast.error("Er ging iets mis bij het inloggen");
          }
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error("Dit email adres is al geregistreerd");
          } else {
            toast.error("Er ging iets mis bij het registreren");
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("Er ging iets mis");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-2">
            Fantabula
          </h1>
          <p className="text-purple-600">Magische Verhalenwereld</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-purple-800">
              {isLogin ? "Welkom terug!" : "Maak een account"}
            </CardTitle>
            <CardDescription className="text-purple-600">
              {isLogin ? "Log in om je verhalen te bekijken" : "Begin je magische reis"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="displayName" className="text-purple-700">Jouw naam</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="border-purple-200 focus:border-purple-400"
                    placeholder="Voer je naam in"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email" className="text-purple-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-purple-200 focus:border-purple-400"
                  placeholder="voornaam@voorbeeld.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-purple-700">Wachtwoord</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-purple-200 focus:border-purple-400 pr-10"
                    placeholder="Minimaal 6 karakters"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-purple-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-purple-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {loading ? "Bezig..." : (isLogin ? "Inloggen" : "Account maken")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-purple-600">
                {isLogin ? "Nog geen account? " : "Al een account? "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-700 font-semibold p-0 h-auto"
                >
                  {isLogin ? "Registreer hier" : "Log hier in"}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
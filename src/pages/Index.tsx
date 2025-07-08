
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Sparkles } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import MainMenu from "@/components/MainMenu";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("bedtimeStoryUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
      setShowWelcome(false);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem("bedtimeStoryUser", email);
    setCurrentUser(email);
    setIsLoggedIn(true);
    setShowWelcome(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("bedtimeStoryUser");
    setIsLoggedIn(false);
    setCurrentUser("");
    setShowWelcome(true);
    toast.success("Tot ziens! 👋");
  };

  if (showWelcome && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-4">
              Fantabula
            </h1>
            <p className="text-xl text-purple-600 mb-2">Magische Verhalenwereld</p>
            <p className="text-purple-500">Waar elke droom een verhaal wordt</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-2 mb-8">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <Button 
                  onClick={() => setShowWelcome(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Begin je Avontuur ✨
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <MainMenu currentUser={currentUser} onLogout={handleLogout} />
  );
};

export default Index;

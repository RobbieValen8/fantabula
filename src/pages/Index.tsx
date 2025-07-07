
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import MainMenu from "@/components/MainMenu";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("bedtimeStoryUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem("bedtimeStoryUser", email);
    setCurrentUser(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("bedtimeStoryUser");
    setIsLoggedIn(false);
    setCurrentUser("");
    toast.success("Tot ziens! 👋");
  };

  if (!isLoggedIn) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <MainMenu currentUser={currentUser} onLogout={handleLogout} />
  );
};

export default Index;

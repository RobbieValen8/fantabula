
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AuthForm from "@/components/AuthForm";
import MainMenu from "@/components/MainMenu";
import ApiKeyInput from "@/components/ApiKeyInput";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("bedtimeStoryUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    // Check if API key is set when user logs in
    if (isLoggedIn) {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        setShowApiKeyInput(true);
      }
    }
  }, [isLoggedIn]);

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

  const handleApiKeySet = () => {
    setShowApiKeyInput(false);
  };

  if (!isLoggedIn) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <>
      <MainMenu currentUser={currentUser} onLogout={handleLogout} />
      {showApiKeyInput && <ApiKeyInput onApiKeySet={handleApiKeySet} />}
    </>
  );
};

export default Index;

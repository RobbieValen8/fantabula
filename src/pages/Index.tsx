
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, BookOpen } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("bedtimeStoryUser");
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email && loginForm.password) {
      localStorage.setItem("bedtimeStoryUser", loginForm.email);
      setCurrentUser(loginForm.email);
      setIsLoggedIn(true);
      toast.success("Welkom terug! 🌟");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.name && signupForm.email && signupForm.password) {
      localStorage.setItem("bedtimeStoryUser", signupForm.email);
      setCurrentUser(signupForm.email);
      setIsLoggedIn(true);
      toast.success("Account aangemaakt! Welkom! 🎉");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bedtimeStoryUser");
    localStorage.removeItem("currentStory");
    setIsLoggedIn(false);
    setCurrentUser("");
    toast.success("Tot ziens! 👋");
  };

  if (isLoggedIn) {
    return <MainMenu currentUser={currentUser} onLogout={handleLogout} />;
  }

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

const MainMenu = ({ currentUser, onLogout }: { currentUser: string, onLogout: () => void }) => {
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showPreviousStory, setShowPreviousStory] = useState(false);
  const previousStory = localStorage.getItem("currentStory");

  if (showStoryCreator) {
    return <StoryCreator onBack={() => setShowStoryCreator(false)} />;
  }

  if (showPreviousStory && previousStory) {
    return <StoryViewer story={JSON.parse(previousStory)} onBack={() => setShowPreviousStory(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-800">Hallo! 👋</h1>
            <p className="text-purple-600 text-sm">{currentUser.split('@')[0]}</p>
          </div>
          <Button onClick={onLogout} variant="ghost" className="text-purple-600 hover:text-purple-700">
            Uitloggen
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-purple-800 mb-2">Wat wil je doen?</h2>
          <p className="text-purple-600">Kies je verhalenavontuur!</p>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowStoryCreator(true)}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Nieuw Verhaal</h3>
              <p className="text-purple-600">Begin een spannend nieuw avontuur!</p>
            </CardContent>
          </Card>

          {previousStory && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowPreviousStory(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Vorig Verhaal</h3>
                <p className="text-purple-600">Lees je laatste verhaal opnieuw!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const StoryCreator = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyChoices, setStoryChoices] = useState<Record<string, string>>({});
  const [generatedStory, setGeneratedStory] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const storyQuestions = [
    {
      question: "Wie is de hoofdpersoon van het verhaal?",
      options: [
        { value: "princess", label: "Een dappere prinses 👑", emoji: "👑" },
        { value: "knight", label: "Een moedige ridder ⚔️", emoji: "⚔️" },
        { value: "animal", label: "Een slim dier 🦊", emoji: "🦊" },
        { value: "child", label: "Een avontuurlijk kind 🧒", emoji: "🧒" }
      ]
    },
    {
      question: "Waar speelt het verhaal zich af?",
      options: [
        { value: "castle", label: "In een magisch kasteel 🏰", emoji: "🏰" },
        { value: "forest", label: "In een betoverd bos 🌲", emoji: "🌲" },
        { value: "ocean", label: "Onder de zee 🌊", emoji: "🌊" },
        { value: "space", label: "In de ruimte 🚀", emoji: "🚀" }
      ]
    },
    {
      question: "Wat voor avontuur wil je beleven?",
      options: [
        { value: "treasure", label: "Een schat zoeken 💎", emoji: "💎" },
        { value: "rescue", label: "Iemand redden 🦸", emoji: "🦸" },
        { value: "friendship", label: "Nieuwe vrienden maken 🤝", emoji: "🤝" },
        { value: "magic", label: "Magie leren 🔮", emoji: "🔮" }
      ]
    }
  ];

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Simulate AI story generation (replace with actual AI API call)
    const storyPrompt = `Schrijf een kindvriendelijk bedtijdverhaal over een ${storyChoices.character} in ${storyChoices.setting} die ${storyChoices.adventure}. Het verhaal moet geschikt zijn voor kinderen en een positief einde hebben.`;
    
    // Simulated story generation - replace with actual AI API
    setTimeout(() => {
      const sampleStory = `Er was eens een ${storyChoices.character === 'princess' ? 'dappere prinses' : storyChoices.character === 'knight' ? 'moedige ridder' : storyChoices.character === 'animal' ? 'slim vosje' : 'avontuurlijk kind'} die woonde ${storyChoices.setting === 'castle' ? 'in een magisch kasteel' : storyChoices.setting === 'forest' ? 'in een betoverd bos' : storyChoices.setting === 'ocean' ? 'onder de zee' : 'in de ruimte'}.

Op een mooie dag besloot onze held om ${storyChoices.adventure === 'treasure' ? 'op zoek te gaan naar een verloren schat' : storyChoices.adventure === 'rescue' ? 'iemand in nood te helpen' : storyChoices.adventure === 'friendship' ? 'nieuwe vrienden te maken' : 'de kunst van magie te leren'}.

Het was een spannend avontuur vol wonderlijke ontmoetingen en magische momenten. Onderweg leerde onze held dat moed, vriendelijkheid en doorzettingsvermogen de belangrijkste schatten zijn die je kunt bezitten.

En ze leefden nog lang en gelukkig! 🌟

Het einde.`;

      setGeneratedStory(sampleStory);
      localStorage.setItem("currentStory", JSON.stringify({
        story: sampleStory,
        choices: storyChoices,
        createdAt: new Date().toISOString()
      }));
      setIsGenerating(false);
      toast.success("Je verhaal is klaar! 📖✨");
    }, 3000);
  };

  const handleChoice = (value: string) => {
    const questionKey = ['character', 'setting', 'adventure'][currentStep];
    setStoryChoices({ ...storyChoices, [questionKey]: value });
    
    if (currentStep < storyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateStory();
    }
  };

  if (generatedStory) {
    return <StoryViewer story={{ story: generatedStory, choices: storyChoices }} onBack={onBack} />;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">Verhaal wordt gemaakt...</h3>
            <p className="text-purple-600 mb-6">De verhaalmaker werkt hard aan jouw speciale verhaal! ✨</p>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = storyQuestions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="text-purple-600 hover:text-purple-700 mr-4">
            ← Terug
          </Button>
          <div className="flex space-x-2">
            {storyQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-purple-500' : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800 mb-4">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  onClick={() => handleChoice(option.value)}
                  className="h-auto p-6 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-800 border-2 border-purple-200 hover:border-purple-300 transition-all"
                  variant="ghost"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-lg font-medium">{option.label}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StoryViewer = ({ story, onBack }: { story: { story: string, choices: Record<string, string> }, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-purple-600 hover:text-purple-700">
            ← Terug naar Menu
          </Button>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-purple-800">Jouw Verhaal</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-purple max-w-none">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-lg">
                {story.story}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            onClick={() => {
              localStorage.removeItem("currentStory");
              onBack();
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            Nieuw Verhaal Maken 🌟
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

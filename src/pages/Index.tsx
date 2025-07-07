import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Book, BookOpen, Clock, Users } from "lucide-react";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  story: string;
  choices: Record<string, string>;
  ageGroup: string;
  createdAt: string;
  imageUrl?: string;
}

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
  const [showStoryLibrary, setShowStoryLibrary] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  const savedStories = JSON.parse(localStorage.getItem(`stories_${currentUser}`) || "[]") as Story[];

  if (showStoryCreator) {
    return <StoryCreator onBack={() => setShowStoryCreator(false)} currentUser={currentUser} />;
  }

  if (showStoryLibrary) {
    return <StoryLibrary stories={savedStories} onBack={() => setShowStoryLibrary(false)} onSelectStory={setSelectedStory} />;
  }

  if (selectedStory) {
    return <StoryViewer story={selectedStory} onBack={() => setSelectedStory(null)} />;
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

          {savedStories.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowStoryLibrary(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Mijn Verhalen</h3>
                <p className="text-purple-600">{savedStories.length} opgeslagen verhale{savedStories.length !== 1 ? 'n' : ''}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const StoryLibrary = ({ stories, onBack, onSelectStory }: { stories: Story[], onBack: () => void, onSelectStory: (story: Story) => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center mb-6">
          <Button onClick={onBack} variant="ghost" className="text-purple-600 hover:text-purple-700 mr-4">
            ← Terug
          </Button>
          <h1 className="text-2xl font-bold text-purple-800">Mijn Verhalen</h1>
        </div>

        <div className="space-y-4">
          {stories.map((story) => (
            <Card key={story.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => onSelectStory(story)}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {story.imageUrl ? (
                    <img src={story.imageUrl} alt={story.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-800 mb-1">{story.title}</h3>
                    <p className="text-purple-600 text-sm mb-2">
                      {story.ageGroup} • {new Date(story.createdAt).toLocaleDateString('nl-NL')}
                    </p>
                    <p className="text-purple-700 text-sm line-clamp-2">
                      {story.story.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const StoryCreator = ({ onBack, currentUser }: { onBack: () => void, currentUser: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyChoices, setStoryChoices] = useState<Record<string, string>>({});
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const storyQuestions = [
    {
      question: "Voor welke leeftijd is dit verhaal?",
      options: [
        { value: "young", label: "3-6 jaar (kort verhaal)", emoji: "👶", description: "5 minuten voorlezen" },
        { value: "older", label: "7-12 jaar (lang verhaal)", emoji: "🧒", description: "10 minuten voorlezen" }
      ]
    },
    {
      question: "Wie is de hoofdpersoon van het verhaal?",
      options: [
        { value: "princess", label: "Een dappere prinses", emoji: "👑" },
        { value: "knight", label: "Een moedige ridder", emoji: "⚔️" },
        { value: "animal", label: "Een slim dier", emoji: "🦊" },
        { value: "child", label: "Een avontuurlijk kind", emoji: "🧒" }
      ]
    },
    {
      question: "Waar speelt het verhaal zich af?",
      options: [
        { value: "castle", label: "In een magisch kasteel", emoji: "🏰" },
        { value: "forest", label: "In een betoverd bos", emoji: "🌲" },
        { value: "ocean", label: "Onder de zee", emoji: "🌊" },
        { value: "space", label: "In de ruimte", emoji: "🚀" }
      ]
    },
    {
      question: "Wat voor avontuur wil je beleven?",
      options: [
        { value: "treasure", label: "Een schat zoeken", emoji: "💎" },
        { value: "rescue", label: "Iemand redden", emoji: "🦸" },
        { value: "friendship", label: "Nieuwe vrienden maken", emoji: "🤝" },
        { value: "magic", label: "Magie leren", emoji: "🔮" }
      ]
    }
  ];

  const generateLongStory = (choices: Record<string, string>) => {
    const isYoung = choices.ageGroup === 'young';
    const ageText = isYoung ? 'jonge kinderen (3-6 jaar)' : 'oudere kinderen (7-12 jaar)';
    const lengthText = isYoung ? '5 minuten' : '10 minuten';
    
    const characterMap = {
      princess: 'dappere prinses Luna',
      knight: 'moedige ridder Sam',
      animal: 'slimme vos Roos',
      child: 'avontuurlijke Emma'
    };
    
    const settingMap = {
      castle: 'het magische Kristalkasteel',
      forest: 'het Betoverde Woud',
      ocean: 'de Parelzee',
      space: 'de Sterrenvallei'
    };
    
    const adventureMap = {
      treasure: 'op zoek naar de Regenboogschat',
      rescue: 'om de verdwenen muzieknoten te redden',
      friendship: 'om nieuwe vrienden te maken',
      magic: 'om de kunst van vriendschapsmagie te leren'
    };

    const character = characterMap[choices.character as keyof typeof characterMap];
    const setting = settingMap[choices.setting as keyof typeof settingMap];
    const adventure = adventureMap[choices.adventure as keyof typeof adventureMap];

    if (isYoung) {
      return `Er was eens ${character} die woonde in ${setting}.

Op een zonnige ochtend besloot ${character.split(' ')[1]} ${adventure}. 

${character.split(' ')[1]} stapte voorzichtig door de grote deur en ontdekte een wereld vol wonderen. Overal waren vriendelijke dieren die wilden helpen.

"Hallo!" zei een kleine muis. "Ik kan je de weg wijzen!"

Samen gingen ze op avontuur. Ze klommen over zachte heuvels en wandelden langs glinsterend water. Onderweg zongen ze vrolijke liedjes.

Plotseling hoorden ze iemand huilen. Het was een klein konijntje dat zijn weg kwijt was.

"Maak je geen zorgen," zei ${character.split(' ')[1]} vriendelijk. "Wij helpen je!"

Met z'n drieën vonden ze de weg terug naar het konijntjes huis. De mama konijn was zo blij!

"Dankjewel voor jullie vriendelijkheid," zei ze. "Echte vrienden helpen elkaar altijd."

${character.split(' ')[1]} glimlachte. Het mooiste avontuur was nieuwe vrienden maken.

En ze leefden nog lang en gelukkig! 🌟

Het einde.`;
    } else {
      return `Er was eens ${character} die woonde in ${setting}. Dit was geen gewoon thuis - het was een plek waar magie in de lucht hing en avonturen achter elke hoek wachtten.

Op een bijzondere dag, toen de sterren extra helder schenen, ontdekte ${character.split(' ')[1]} een mysterieuze kaart die ${adventure} beschreef. De kaart gloeide zachtjes en fluisterde: "Alleen degene met een moedig hart kan deze queeste voltooien."

${character.split(' ')[1]} pakte een rugzak en stapte vol vertrouwen naar buiten. De eerste uitdaging kwam snel: een brede rivier die de weg blokkeerde. Maar er was geen brug!

Gelukkig hoorde ${character.split(' ')[1]} een vriendelijke stem: "Psst, hier!" Een wijze oude uil zat op een tak. "Ik ken een geheim. Als je drie keer je ogen dichtdoet en aan iets moois denkt, gebeurt er iets magisch."

${character.split(' ')[1]} deed precies wat de uil zei. Plots verscheen er een regenboogbrug over het water! "Wauw!" riep ${character.split(' ')[1]}. "Hoe kan dat?"

"Magie zit niet in toverstokken," glimlachte de uil. "Het zit in geloven in jezelf."

Aan de andere kant van de rivier wachtte een donker bos. Het zag er een beetje eng uit, maar ${character.split(' ')[1]} was niet bang. Diep in het bos brandde een warm lichtje.

Bij het lichtje zat een familie mussen die niet kon slapen. "We zijn onze slaapliedjes kwijt," piepten ze verdrietig. "Zonder muziek kunnen we niet dromen."

${character.split(' ')[1]} dacht even na en begon toen zachtjes te neuriën. De melodie was zo mooi dat alle dieren uit het bos kwamen luisteren. Samen maakten ze de mooiste muziek die ooit geklonken had.

"Dankjewel!" jubelden de mussen. "Als dank krijg je dit." Ze gaven ${character.split(' ')[1]} een gouden veertje dat zachtjes gloeide.

Met het magische veertje vond ${character.split(' ')[1]} eindelijk wat ${character.split(' ')[1]} zocht. Maar het echte cadeau was veel mooier: ${character.split(' ')[1]} had geleerd dat de grootste schatten vriendschap, moed en vriendelijkheid zijn.

Toen ${character.split(' ')[1]} thuiskwam, glansden de sterren nog helderder dan voorheen. En elke nacht daarna droomde ${character.split(' ')[1]} over nieuwe avonturen, wetende dat er altijd magie te vinden is voor degenen die durven te geloven.

En ze leefden nog lang en gelukkig! 🌟

Het einde.`;
    }
  };

  const generateStory = async () => {
    setIsGenerating(true);
    
    // Simulate AI story generation with longer content
    setTimeout(() => {
      const longStory = generateLongStory(storyChoices);
      
      const newStory: Story = {
        id: crypto.randomUUID(),
        title: `Verhaal van ${storyChoices.character === 'princess' ? 'de prinses' : storyChoices.character === 'knight' ? 'de ridder' : storyChoices.character === 'animal' ? 'het dier' : 'het kind'}`,
        story: longStory,
        choices: storyChoices,
        ageGroup: storyChoices.ageGroup === 'young' ? '3-6 jaar' : '7-12 jaar',
        createdAt: new Date().toISOString(),
        imageUrl: `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop&q=80`
      };

      // Save to user's story collection
      const existingStories = JSON.parse(localStorage.getItem(`stories_${currentUser}`) || "[]") as Story[];
      existingStories.unshift(newStory);
      localStorage.setItem(`stories_${currentUser}`, JSON.stringify(existingStories));

      setGeneratedStory(newStory);
      setIsGenerating(false);
      toast.success("Je verhaal is klaar! 📖✨");
    }, 4000);
  };

  const handleChoice = (value: string) => {
    const questionKey = ['ageGroup', 'character', 'setting', 'adventure'][currentStep];
    setStoryChoices({ ...storyChoices, [questionKey]: value });
    
    if (currentStep < storyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateStory();
    }
  };

  if (generatedStory) {
    return <StoryViewer story={generatedStory} onBack={onBack} />;
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
            <p className="text-purple-600 mb-2">De verhaalmaker werkt hard aan jouw speciale verhaal! ✨</p>
            <p className="text-purple-500 text-sm mb-6">
              {storyChoices.ageGroup === 'young' ? '5 minuten verhaal voor 3-6 jaar' : '10 minuten verhaal voor 7-12 jaar'}
            </p>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
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
                  <div className="text-center w-full">
                    <div className="text-3xl mb-2">{option.emoji}</div>
                    <div className="text-lg font-medium mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-purple-600">{option.description}</div>
                    )}
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

const StoryViewer = ({ story, onBack }: { story: Story, onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="ghost" className="text-purple-600 hover:text-purple-700">
            ← Terug
          </Button>
          <div className="flex items-center text-purple-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{story.ageGroup}</span>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            {story.imageUrl && (
              <img src={story.imageUrl} alt={story.title} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            )}
            <CardTitle className="text-2xl text-purple-800">{story.title}</CardTitle>
            <CardDescription className="text-purple-600">
              Voor {story.ageGroup} • {new Date(story.createdAt).toLocaleDateString('nl-NL')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose prose-purple max-w-none">
              <div className="text-purple-800 leading-relaxed whitespace-pre-line text-lg">
                {story.story}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

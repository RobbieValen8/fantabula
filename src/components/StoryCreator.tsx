
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Story } from "@/types/Story";
import { generateStoryWithAI } from "@/services/aiService";
import StoryViewer from "./StoryViewer";

interface StoryCreatorProps {
  onBack: () => void;
  currentUser: string;
}

const StoryCreator = ({ onBack, currentUser }: StoryCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [storyChoices, setStoryChoices] = useState<Record<string, string>>({});
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const storyQuestions = [
    {
      id: "age",
      title: "Leeftijd kiezen",
      question: "Voor welke leeftijd is dit verhaal?",
      description: "Kies de leeftijdsgroep voor je verhaal",
      options: [
        { value: "young", label: "3-6 jaar", emoji: "👶", description: "Kort verhaal (5 minuten voorlezen)" },
        { value: "older", label: "7-12 jaar", emoji: "🧒", description: "Lang verhaal (10 minuten voorlezen)" }
      ]
    },
    {
      id: "character",
      title: "Hoofdpersoon kiezen",
      question: "Wie is de hoofdpersoon van het verhaal?",
      description: "Kies wie de held van je verhaal wordt",
      options: [
        { value: "princess", label: "Een dappere prinses", emoji: "👑", description: "Moedig en slim" },
        { value: "knight", label: "Een moedige ridder", emoji: "⚔️", description: "Sterk en eerlijk" },
        { value: "animal", label: "Een slim dier", emoji: "🦊", description: "Grappig en vindingrijk" },
        { value: "child", label: "Een avontuurlijk kind", emoji: "🧒", description: "Nieuwsgierig en dapper" }
      ]
    },
    {
      id: "setting",
      title: "Locatie kiezen",
      question: "Waar speelt het verhaal zich af?",
      description: "Kies de prachtige wereld voor je avontuur",
      options: [
        { value: "castle", label: "In een magisch kasteel", emoji: "🏰", description: "Vol geheime kamers en mysteries" },
        { value: "forest", label: "In een betoverd bos", emoji: "🌲", description: "Met sprekende dieren en magie" },
        { value: "ocean", label: "Onder de zee", emoji: "🌊", description: "Bij zeemeerminnen en vissen" },
        { value: "space", label: "In de ruimte", emoji: "🚀", description: "Tussen sterren en planeten" }
      ]
    },
    {
      id: "adventure",
      title: "Avontuur kiezen",
      question: "Wat voor avontuur wil je beleven?",
      description: "Kies het spannende avontuur dat je wilt meemaken",
      options: [
        { value: "treasure", label: "Een schat zoeken", emoji: "💎", description: "Op zoek naar verborgen schatten" },
        { value: "rescue", label: "Iemand redden", emoji: "🦸", description: "Een vriend in nood helpen" },
        { value: "friendship", label: "Nieuwe vrienden maken", emoji: "🤝", description: "Bijzondere vriendschappen sluiten" },
        { value: "magic", label: "Magie leren", emoji: "🔮", description: "Toveren en betovering ontdekken" }
      ]
    }
  ];

  const generateStory = async () => {
    setIsGenerating(true);
    console.log('Starting story generation with choices:', storyChoices);
    
    try {
      const storyContent = await generateStoryWithAI(storyChoices);
      
      const characterNames = {
        princess: 'de Prinses',
        knight: 'de Ridder', 
        animal: 'het Dier',
        child: 'het Kind'
      };
      
      const newStory: Story = {
        id: crypto.randomUUID(),
        title: `Het Verhaal van ${characterNames[storyChoices.character as keyof typeof characterNames]}`,
        story: storyContent,
        choices: storyChoices,
        ageGroup: storyChoices.ageGroup === 'young' ? '3-6 jaar' : '7-12 jaar',
        createdAt: new Date().toISOString(),
        imageUrl: `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop&q=80`
      };

      // Save to user's story collection
      const existingStories = JSON.parse(localStorage.getItem(`stories_${currentUser}`) || "[]") as Story[];
      existingStories.unshift(newStory);
      localStorage.setItem(`stories_${currentUser}`, JSON.stringify(existingStories));
      
      console.log('Story saved successfully');
      setGeneratedStory(newStory);
      setIsGenerating(false);
      toast.success("Je verhaal is klaar! 📖✨");
    } catch (error) {
      setIsGenerating(false);
      toast.error("Er ging iets mis bij het maken van je verhaal. Probeer het opnieuw!");
      console.error("Story generation error:", error);
    }
  };

  const handleChoice = (value: string) => {
    const questionKey = ['ageGroup', 'character', 'setting', 'adventure'][currentStep];
    const newChoices = { ...storyChoices, [questionKey]: value };
    setStoryChoices(newChoices);
    
    console.log(`Step ${currentStep}: ${questionKey} = ${value}`);
    
    if (currentStep < storyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('All choices made, generating story...');
      setTimeout(() => {
        generateStory();
      }, 100);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
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
            <p className="text-purple-600 mb-2">De AI schrijft een speciaal verhaal voor jou! ✨</p>
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
  const progressPercentage = ((currentStep + 1) / storyQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4">
      <div className="max-w-lg mx-auto pt-4">
        {/* Header with back button and progress */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleBack} variant="ghost" className="text-purple-600 hover:text-purple-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Menu' : 'Vorige'}
          </Button>
          <div className="text-sm text-purple-600 font-medium">
            Stap {currentStep + 1} van {storyQuestions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-200 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Question card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-purple-800 mb-2">
              {currentQuestion.title}
            </CardTitle>
            <p className="text-purple-600 text-lg font-medium mb-2">
              {currentQuestion.question}
            </p>
            <p className="text-purple-500 text-sm">
              {currentQuestion.description}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={option.value}
                  onClick={() => handleChoice(option.value)}
                  className="h-auto p-6 bg-gradient-to-r from-white to-purple-50 hover:from-purple-100 hover:to-pink-100 text-purple-800 border-2 border-purple-200 hover:border-purple-300 transition-all duration-200 transform hover:scale-105"
                  variant="ghost"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center mb-3">
                      <div className="text-4xl mr-4">{option.emoji}</div>
                      <div>
                        <div className="text-lg font-semibold mb-1">{option.label}</div>
                        <div className="text-sm text-purple-600">{option.description}</div>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next button hint (optional) */}
        {currentStep < storyQuestions.length - 1 && (
          <div className="text-center">
            <p className="text-purple-500 text-sm flex items-center justify-center">
              Kies een optie om door te gaan
              <ArrowRight className="w-4 h-4 ml-2" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCreator;

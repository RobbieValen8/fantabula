
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
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
      // Use the updated choices directly for generation
      setTimeout(() => {
        generateStory();
      }, 100);
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

export default StoryCreator;

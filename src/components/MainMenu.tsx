
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Book, BookOpen } from "lucide-react";
import { Story } from "@/types/Story";
import { useAuth } from "@/hooks/useAuth";
import { getUserStories } from "@/services/storyService";
import StoryCreator from "./StoryCreator";
import StoryLibrary from "./StoryLibrary";
import StoryViewer from "./StoryViewer";

interface MainMenuProps {
  currentUser: string;
  onLogout: () => void;
}

const MainMenu = ({ currentUser }: MainMenuProps) => {
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  const [showStoryLibrary, setShowStoryLibrary] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { signOut } = useAuth();

  useEffect(() => {
    const loadStories = async () => {
      try {
        const userStories = await getUserStories();
        setStories(userStories);
      } catch (error) {
        console.error('Error loading stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const refreshStories = async () => {
    try {
      const userStories = await getUserStories();
      setStories(userStories);
    } catch (error) {
      console.error('Error refreshing stories:', error);
    }
  };

  if (showStoryCreator) {
    return <StoryCreator onBack={() => setShowStoryCreator(false)} onStoryCreated={refreshStories} />;
  }

  if (showStoryLibrary) {
    return (
      <StoryLibrary 
        stories={stories} 
        onBack={() => setShowStoryLibrary(false)} 
        onSelectStory={setSelectedStory}
        onStoriesChanged={refreshStories}
      />
    );
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
          <Button onClick={handleLogout} variant="ghost" className="text-purple-600 hover:text-purple-700">
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

          {!loading && stories.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowStoryLibrary(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">Mijn Verhalen</h3>
                <p className="text-purple-600">{stories.length} opgeslagen verhale{stories.length !== 1 ? 'n' : ''}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

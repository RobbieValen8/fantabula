
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Story } from "@/types/Story";

interface StoryLibraryProps {
  stories: Story[];
  onBack: () => void;
  onSelectStory: (story: Story) => void;
}

const StoryLibrary = ({ stories, onBack, onSelectStory }: StoryLibraryProps) => {
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

export default StoryLibrary;

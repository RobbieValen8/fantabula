
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Story } from "@/types/Story";

interface StoryViewerProps {
  story: Story;
  onBack: () => void;
}

const StoryViewer = ({ story, onBack }: StoryViewerProps) => {
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

export default StoryViewer;

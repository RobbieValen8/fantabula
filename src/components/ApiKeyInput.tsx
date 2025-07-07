
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      toast.success("API key opgeslagen! Nu kun je verhalen genereren 🎉");
      onApiKeySet();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-purple-800">OpenAI API Key</CardTitle>
          <CardDescription className="text-purple-600">
            Om verhalen te genereren hebben we een OpenAI API key nodig
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="apikey" className="text-purple-700">API Key</Label>
              <Input
                id="apikey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="border-purple-200 focus:border-purple-400"
              />
              <p className="text-xs text-purple-600 mt-1">
                Je API key wordt lokaal opgeslagen en niet gedeeld
              </p>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              API Key Opslaan
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-purple-600">
              Geen API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-800 underline">Maak er een aan</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeyInput;

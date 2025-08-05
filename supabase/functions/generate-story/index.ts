import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the user's JWT token
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log('Authenticated user:', user.id);

    const { choices } = await req.json();

    // Validate input
    if (!choices || typeof choices !== 'object') {
      throw new Error('Invalid choices provided');
    }

    const requiredFields = ['character', 'setting', 'adventure', 'ageGroup'];
    for (const field of requiredFields) {
      if (!choices[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const isYoung = choices.ageGroup === 'young';
    const ageText = isYoung ? 'jonge kinderen (3-6 jaar)' : 'oudere kinderen (7-12 jaar)';
    const lengthText = isYoung ? '5 minuten' : '10-15 minuten';
    
    const characterMap: Record<string, string> = {
      princess: 'dappere prinses',
      knight: 'moedige ridder',
      animal: 'slim dier',
      child: 'avontuurlijk kind'
    };
    
    const settingMap: Record<string, string> = {
      castle: 'magisch kasteel',
      forest: 'betoverd bos',
      ocean: 'onderwaterwereld',
      space: 'de ruimte'
    };
    
    const adventureMap: Record<string, string> = {
      treasure: 'op zoek naar een schat',
      rescue: 'iemand redden',
      friendship: 'nieuwe vrienden maken',
      magic: 'magie leren'
    };

    const character = characterMap[choices.character] || 'avontuurlijk personage';
    const setting = settingMap[choices.setting] || 'magische wereld';
    const adventure = adventureMap[choices.adventure] || 'spannend avontuur';

    const prompt = `Schrijf een Nederlands bedtijdverhaal voor ${ageText} dat ongeveer ${lengthText} duurt om voor te lezen.

Het verhaal moet:
- Hoofdpersoon: ${character}
- Locatie: ${setting}
- Avontuur: ${adventure}
- Volledig kindvriendelijk en positief zijn
- Een duidelijk begin, midden en einde hebben
- Leerzame elementen bevatten zoals vriendschap, moed, of vriendelijkheid
- Eindigen met "En ze leefden nog lang en gelukkig! 🌟\n\nHet einde."

${isYoung ? 
  'Houd het verhaal simpel met korte zinnen en herhaling. Gebruik veel geluiden en emoties.' : 
  'Maak het verhaal rijk aan details met wat meer complexe avonturen en karakterontwikkeling.'
}

Schrijf het verhaal in een warme, verhalende toon alsof een ouder het voorleest. Maak het uniek en creatief, vermijd herhalingen en clichés.`;

    console.log('Generating story with OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert kinderverhalenschrijver die warme, veilige en unieke bedtijdverhalen creëert. Elk verhaal moet origineel zijn en vermijd clichés.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: isYoung ? 800 : 1500,
        temperature: 0.9, // Higher creativity
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedStory = data.choices[0].message.content;

    // Generate a title from the story content
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Genereer een korte, aantrekkelijke titel voor dit kinderverhaal. Maximaal 5 woorden.'
          },
          {
            role: 'user',
            content: `Verhaal: ${generatedStory.substring(0, 200)}...`
          }
        ],
        max_tokens: 20,
        temperature: 0.7,
      }),
    });

    let title = 'Een Nieuw Avontuur';
    if (titleResponse.ok) {
      const titleData = await titleResponse.json();
      title = titleData.choices[0].message.content.replace(/['"]/g, '').trim();
    }

    // Save the story to the database
    const { data: storyData, error: saveError } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        title: title,
        content: generatedStory,
        choices: choices,
        age_group: ageText
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving story:', saveError);
      throw new Error('Failed to save story');
    }

    console.log('Story generated and saved successfully');

    return new Response(JSON.stringify({
      story: generatedStory,
      title: title,
      id: storyData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
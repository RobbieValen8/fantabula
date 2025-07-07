
// AI Service for generating stories
// Note: This requires an API key to be set by the user

export const generateStoryWithAI = async (choices: Record<string, string>): Promise<string> => {
  // Get API key from localStorage (user input)
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    throw new Error('API key is required. Please set your OpenAI API key first.');
  }

  const isYoung = choices.ageGroup === 'young';
  const ageText = isYoung ? 'jonge kinderen (3-6 jaar)' : 'oudere kinderen (7-12 jaar)';
  const lengthText = isYoung ? '5 minuten' : '10-15 minuten';
  
  const characterMap = {
    princess: 'dappere prinses',
    knight: 'moedige ridder',
    animal: 'slim dier',
    child: 'avontuurlijk kind'
  };
  
  const settingMap = {
    castle: 'magisch kasteel',
    forest: 'betoverd bos',
    ocean: 'onderwaterwereld',
    space: 'de ruimte'
  };
  
  const adventureMap = {
    treasure: 'op zoek naar een schat',
    rescue: 'iemand redden',
    friendship: 'nieuwe vrienden maken',
    magic: 'magie leren'
  };

  const character = characterMap[choices.character as keyof typeof characterMap];
  const setting = settingMap[choices.setting as keyof typeof settingMap];
  const adventure = adventureMap[choices.adventure as keyof typeof adventureMap];

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

Schrijf het verhaal in een warme, verhalende toon alsof een ouder het voorleest.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Je bent een expert kinderverhalenschrijver die warme, veilige bedtijdverhalen creëert.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: isYoung ? 800 : 1500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI story generation failed:', error);
    throw new Error('Het genereren van het verhaal is mislukt. Controleer je internetverbinding en API key.');
  }
};

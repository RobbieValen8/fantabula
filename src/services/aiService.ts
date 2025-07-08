
// AI Service for generating stories
// Using provided API key with better error handling

export const generateStoryWithAI = async (choices: Record<string, string>): Promise<string> => {
  // Use the provided API key directly
  const apiKey = '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';

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
    console.log('Generating story with choices:', choices);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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

    console.log('API Response status:', response.status);

    if (!response.ok) {
      // If quota exceeded or other API error, return a fallback story
      if (response.status === 429) {
        console.log('API quota exceeded, using fallback story');
        return generateFallbackStory(choices);
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Story generated successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI story generation failed:', error);
    // Return fallback story instead of throwing error
    return generateFallbackStory(choices);
  }
};

const generateFallbackStory = (choices: Record<string, string>): string => {
  const isYoung = choices.ageGroup === 'young';
  const character = choices.character === 'princess' ? 'Prinses Luna' : 
                   choices.character === 'knight' ? 'Ridder Dapper' :
                   choices.character === 'animal' ? 'Konijn Pip' : 'Klein Alex';
  
  const setting = choices.setting === 'castle' ? 'een prachtig kasteel' :
                 choices.setting === 'forest' ? 'een magisch bos' :
                 choices.setting === 'ocean' ? 'de diepblauwe zee' : 'tussen de sterren';

  const adventure = choices.adventure === 'treasure' ? 'een gouden schat vinden' :
                   choices.adventure === 'rescue' ? 'een vriend helpen' :
                   choices.adventure === 'friendship' ? 'nieuwe vrienden maken' : 'magie ontdekken';

  if (isYoung) {
    return `Er was eens ${character} die woonde in ${setting}. 

${character} wilde heel graag ${adventure}. "Wat spannend!" zei ${character}.

Op een zonnige dag ging ${character} op avontuur. Onderweg ontmoette ${character} veel vriendelijke dieren. "Hallo!" zeiden ze allemaal vrolijk.

Samen hielpen ze elkaar. ${character} was heel blij en dankbaar. "Wat fijn dat we vrienden zijn!" zei ${character}.

Na het avontuur ging ${character} terug naar huis. ${character} voelde zich gelukkig en tevreden.

En ze leefden nog lang en gelukkig! 🌟

Het einde.`;
  } else {
    return `In een tijd lang geleden woonde ${character} in ${setting}. Dit was geen gewone plek, want hier gebeurden de mooiste avonturen.

${character} droomde er al lang van om ${adventure}. Met moed in het hart en een glimlach op het gezicht begon ${character} aan dit bijzondere avontuur.

Onderweg kwamen er uitdagingen, maar ${character} gaf nooit op. Met wijsheid en vriendelijkheid werd elke hindernis overwonnen. Andere personages sloten zich aan bij het avontuur, en samen vormden ze een hecht team.

Door samenwerking en doorzettingsvermogen lukte het om het doel te bereiken. ${character} leerde dat de mooiste schatten vriendschap en moed zijn.

Toen het avontuur voorbij was, keerde ${character} terug naar huis, rijker aan ervaring en vol prachtige herinneringen.

En ze leefden nog lang en gelukkig! 🌟

Het einde.`;
  }
};

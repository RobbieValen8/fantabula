import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/Story';

export const generateStoryWithAI = async (choices: Record<string, string>): Promise<{ story: string; title: string; id: string }> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }

  // Validate choices
  const requiredFields = ['character', 'setting', 'adventure', 'ageGroup'];
  for (const field of requiredFields) {
    if (!choices[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Sanitize choices
  const sanitizedChoices = {
    character: choices.character.replace(/[<>]/g, ''),
    setting: choices.setting.replace(/[<>]/g, ''),
    adventure: choices.adventure.replace(/[<>]/g, ''),
    ageGroup: choices.ageGroup.replace(/[<>]/g, '')
  };

  try {
    console.log('Calling secure story generation edge function...');
    
    const { data, error } = await supabase.functions.invoke('generate-story', {
      body: { choices: sanitizedChoices },
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error('Failed to generate story');
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      story: data.story,
      title: data.title,
      id: data.id
    };
  } catch (error) {
    console.error('Story generation failed:', error);
    throw error;
  }
};

export const getUserStories = async (): Promise<Story[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      return [];
    }

    return data.map(story => ({
      id: story.id,
      title: story.title,
      story: story.content,
      choices: story.choices as Record<string, string>,
      ageGroup: story.age_group,
      createdAt: story.created_at,
      imageUrl: story.image_url
    }));
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return [];
  }
};

export const deleteStory = async (storyId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }

  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('user_id', session.user.id); // Ensure user can only delete their own stories

    if (error) {
      console.error('Error deleting story:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting story:', error);
    return false;
  }
};
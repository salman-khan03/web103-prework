import { supabase } from '../../client.js';

export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('creators')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
};

export const detectTableSchema = async () => {
  try {
    // Try to fetch one record to see what columns exist
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error detecting schema:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('Available columns:', columns);
      return columns;
    }
    
    // If no records exist, return null
    console.log('No records found to detect schema');
    return null;
  } catch (error) {
    console.error('Schema detection error:', error);
    return null;
  }
};

export const detectImageColumn = async () => {
  try {
    // First get the schema
    const columns = await detectTableSchema();
    
    if (columns) {
      const possibleImageColumns = ['image', 'imageURL', 'image_url', 'imageUrl'];
      
      for (const column of possibleImageColumns) {
        if (columns.includes(column)) {
          console.log(`Found image column: ${column}`);
          return column;
        }
      }
    }
    
    // If no records exist, try inserting a test record to see what columns work
    const testData = {
      name: 'TEST_CREATOR_DELETE_ME',
      url: 'https://example.com',
      description: 'Test creator for column detection'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('creators')
      .insert([testData])
      .select();
    
    if (!insertError && insertData && insertData.length > 0) {
      const testRecord = insertData[0];
      const possibleImageColumns = ['image', 'imageURL', 'image_url', 'imageUrl'];
      
      for (const column of possibleImageColumns) {
        if (column in testRecord) {
          console.log(`Found image column: ${column}`);
          
          // Clean up test record
          await supabase
            .from('creators')
            .delete()
            .eq('id', testRecord.id);
          
          return column;
        }
      }
      
      // Clean up test record
      await supabase
        .from('creators')
        .delete()
        .eq('id', testRecord.id);
    }
    
    console.log('No image column found');
    return null;
  } catch (error) {
    console.error('Error in detectImageColumn:', error);
    return null;
  }
};

export const createSampleData = async () => {
  try {
    console.log('Creating sample creator data...');
    
    const sampleCreators = [
      {
        name: 'MrBeast',
        url: 'https://www.youtube.com/@MrBeast',
        description: 'Jimmy Donaldson, known professionally as MrBeast, is an American YouTuber, online personality, entrepreneur, and philanthropist.',
        imageURL: 'https://yt3.googleusercontent.com/ytc/AIdro_mNzkxyU_WM1sGLjCCBR0mWOLnGTM6L-uOwtAQN4A=s176-c-k-c0x00ffffff-no-rj'
      },
      {
        name: 'PewDiePie',
        url: 'https://www.youtube.com/@PewDiePie',
        description: 'Felix Arvid Ulf Kjellberg, known online as PewDiePie, is a Swedish YouTuber known for his gaming and comedic formatted videos and shows.',
        imageURL: 'https://yt3.googleusercontent.com/5oUY3tashyxfqsjO5SGhjT4dus8FkN9CsAHwXWISFrdPYii1FudD4ICtLfuCw6-THJsJbgoY=s176-c-k-c0x00ffffff-no-rj'
      }
    ];

    for (const creator of sampleCreators) {
      // Try with imageURL first
      let { data, error } = await supabase
        .from('creators')
        .insert([creator])
        .select();

      // If imageURL column doesn't exist, try with image
      if (error && error.message.includes('imageURL')) {
        const creatorWithImage = {
          ...creator,
          image: creator.imageURL
        };
        delete creatorWithImage.imageURL;

        const result = await supabase
          .from('creators')
          .insert([creatorWithImage])
          .select();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error creating sample data:', error);
        return false;
      }
    }

    console.log('Sample data created successfully');
    return true;
  } catch (error) {
    console.error('Error in createSampleData:', error);
    return false;
  }
};

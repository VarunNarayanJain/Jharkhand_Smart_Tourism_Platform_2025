const express = require('express');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
const router = express.Router();

// Initialize LLM clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Validate API keys
if (!process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
  console.error('❌ No LLM API key configured. Please set OPENAI_API_KEY or GROQ_API_KEY');
}

// POST /api/itinerary/generate
router.post('/generate', async (req, res) => {
  try {
    const {
      startCity,
      dates,
      duration,
      interests,
      groupType,
      desiredPlaces
    } = req.body;

    // Validate required fields
    if (!startCity || !duration) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'startCity and duration are required'
      });
    }

    // Create the prompt for OpenAI
    const prompt = createItineraryPrompt({
      startCity,
      dates,
      duration,
      interests,
      groupType,
      desiredPlaces
    });

    console.log('🤖 Generating itinerary with LLM...');
    console.log('📍 Start City:', startCity);
    console.log('📅 Duration:', duration);
    console.log('🎯 Interests:', interests);
    console.log('👥 Group Type:', groupType);
    console.log('🏞️ Desired Places:', desiredPlaces);

    let aiResponse;
    let llmProvider = 'unknown';

    // Try Groq first (free), then fallback to OpenAI
    if (process.env.GROQ_API_KEY) {
      try {
        // Try 70B model first, then fallback to 8B model
        let groqModel = "llama-3.1-70b-instant";
        let completion;
        
        try {
          console.log('🚀 Using Groq (Llama 3.1 70B)...');
          completion = await groq.chat.completions.create({
            model: groqModel,
            messages: [
              {
                role: "system",
                content: "You are a professional travel planner specializing in Jharkhand, India. Create detailed, practical itineraries that include specific times, activities, and recommendations. Always focus on Jharkhand destinations and provide realistic travel times and costs."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });
        } catch (modelError) {
          // Fallback to 8B model if 70B fails
          console.log('⚠️ 70B model failed, trying 8B model...', modelError.message);
          groqModel = "llama-3.1-8b-instant";
          console.log('🚀 Using Groq (Llama 3.1 8B)...');
          completion = await groq.chat.completions.create({
            model: groqModel,
            messages: [
              {
                role: "system",
                content: "You are a professional travel planner specializing in Jharkhand, India. Create detailed, practical itineraries that include specific times, activities, and recommendations. Always focus on Jharkhand destinations and provide realistic travel times and costs."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          });
        }
        
        aiResponse = completion.choices[0].message.content;
        llmProvider = `groq-${groqModel}`;
        console.log(`✅ Groq response received using ${groqModel}`);
      } catch (groqError) {
        console.log('⚠️ Groq failed, trying OpenAI...', groqError.message);
        throw groqError; // Will be caught by outer try-catch
      }
    } else if (process.env.OPENAI_API_KEY) {
      try {
        console.log('🚀 Using OpenAI (GPT-3.5-turbo)...');
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a professional travel planner specializing in Jharkhand, India. Create detailed, practical itineraries that include specific times, activities, and recommendations. Always focus on Jharkhand destinations and provide realistic travel times and costs."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        });
        aiResponse = completion.choices[0].message.content;
        llmProvider = 'openai';
        console.log('✅ OpenAI response received');
      } catch (openaiError) {
        console.log('❌ OpenAI failed:', openaiError.message);
        throw openaiError;
      }
    } else {
      throw new Error('No LLM API key configured');
    }
    
    console.log('📄 Raw AI Response:');
    console.log('='.repeat(80));
    console.log(aiResponse);
    console.log('='.repeat(80));
    
    // Parse the AI response into structured itinerary
    const itinerary = parseItineraryResponse(aiResponse, duration);

    console.log('✅ Itinerary generated successfully');

    res.json({
      success: true,
      itinerary,
      rawResponse: aiResponse,
      llmProvider,
      metadata: {
        startCity,
        duration,
        interests,
        groupType,
        desiredPlaces,
        generatedAt: new Date().toISOString(),
        llmProvider
      }
    });

  } catch (error) {
    console.error('❌ Error generating itinerary:', error);
    
    // Handle API errors
    if (error.code === 'insufficient_quota' || error.message?.includes('quota')) {
      return res.status(402).json({
        error: 'API quota exceeded',
        message: 'Please check your API billing or try using Groq (free)'
      });
    }
    
    if (error.code === 'invalid_api_key' || error.message?.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your API key configuration'
      });
    }

    if (error.message?.includes('No LLM API key')) {
      return res.status(400).json({
        error: 'No LLM configured',
        message: 'Please set GROQ_API_KEY or OPENAI_API_KEY in your environment variables'
      });
    }

    res.status(500).json({
      error: 'Failed to generate itinerary',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// Helper function to create the prompt
function createItineraryPrompt(data) {
  const {
    startCity,
    dates,
    duration,
    interests,
    groupType,
    desiredPlaces
  } = data;

  let prompt = `Create a detailed ${duration}-day itinerary for Jharkhand, India starting from ${startCity}.`;

  if (dates) {
    prompt += ` Travel dates: ${dates}.`;
  }

  if (interests && interests.length > 0) {
    prompt += ` Interests: ${interests.join(', ')}.`;
  }

  if (groupType) {
    prompt += ` Group type: ${groupType}.`;
  }

  if (desiredPlaces && desiredPlaces.length > 0) {
    prompt += ` Must include these places: ${desiredPlaces.join(', ')}.`;
  }

  prompt += `

Please provide a structured itinerary with:
1. Day-by-day breakdown
2. Specific times for activities
3. Travel routes and transportation
4. Estimated costs
5. Local recommendations
6. Safety tips

Focus on popular Jharkhand destinations like:
- Netarhat (Queen of Chotanagpur Plateau)
- Hundru Falls
- Betla National Park
- Ranchi (capital city)
- Dassam Falls
- Patratu Valley
- Hazaribagh
- Deoghar (Baidyanath Temple)

Format the response as a detailed day-by-day itinerary with specific activities, timings, and practical information.`;

  return prompt;
}

// Helper function to parse AI response into structured format
function parseItineraryResponse(response, duration) {
  try {
    const days = parseInt(duration) || 3;
    
    // Parse the AI response to extract structured data
    const structuredDays = parseAIResponseIntoDays(response, days);
    const estimatedBudget = extractBudget(response);
    
    return {
      days: days,
      summary: `AI-generated ${days}-day itinerary for Jharkhand`,
      rawContent: response,
      structuredDays: structuredDays,
      estimatedBudget: estimatedBudget
    };
  } catch (error) {
    console.error('Error parsing itinerary response:', error);
    return {
      days: parseInt(duration) || 3,
      summary: 'AI-generated itinerary for Jharkhand',
      rawContent: response,
      structuredDays: [],
      estimatedBudget: 'Contact for details'
    };
  }
}

// Helper function to extract budget from AI response
function extractBudget(response) {
  // Look for budget/cost information in various formats:
  // Total: ₹ 29,500 - ₹ 49,000
  // Total: INR 29,500 - 49,000
  // approximately ₹ 5,900 - ₹ 9,800 per person
  const budgetMatch = response.match(/Total[:\s]+[₹INR\s]*([\d,]+)\s*-\s*[₹INR\s]*([\d,]+)/i) ||
                      response.match(/approximately[:\s]+[₹INR\s]*([\d,]+)\s*-\s*[₹INR\s]*([\d,]+)\s*per person/i);
  
  if (budgetMatch) {
    return `₹${budgetMatch[1]} - ₹${budgetMatch[2]}`;
  }
  
  return 'Contact for details';
}

// Helper function to parse AI response into structured days
function parseAIResponseIntoDays(response, totalDays) {
  const structuredDays = [];
  
  // Split response into lines but keep original formatting
  const lines = response.split('\n');
  
  console.log(`📝 Parsing AI response (${lines.length} lines) for ${totalDays} days...`);
  console.log('First 5 lines:', lines.slice(0, 5));
  
  // Image pool for destinations
  const images = [
    'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
  ];
  
  let currentDay = null;
  let currentActivities = [];
  let currentRecommendation = '';
  let capturingRecommendations = false;
  let lastActivityTime = null;
  let currentDayContent = ''; // Capture ALL content for current day as fallback
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;
    
    // Match day headers with VERY flexible pattern
    // Matches: "**Day 1:", "Day 2 -", "**Day 3**", etc.
    const dayMatch = line.match(/\*{0,2}Day\s+(\d+)[:\s-]*(.*?)(\*{0,2})$/i);
    
    if (dayMatch) {
      // Save previous day if exists (even with 0 activities - we'll extract content later)
      if (currentDay) {
        // If no activities found, try to parse the collected content
        if (currentActivities.length === 0 && currentDayContent.length > 0) {
          console.log(`⚠️ No activities matched patterns, extracting from content...`);
          currentActivities = extractActivitiesFromContent(currentDayContent);
        }
        
        console.log(`✅ Saving Day ${currentDay.day}: ${currentDay.location} with ${currentActivities.length} activities`);
        structuredDays.push({
          day: currentDay.day,
          location: currentDay.location,
          image: images[(currentDay.day - 1) % images.length],
          activities: currentActivities.length > 0 ? currentActivities : [
            { time: '9:00 AM', activity: 'Morning exploration and sightseeing' },
            { time: '1:00 PM', activity: 'Lunch and afternoon activities' },
            { time: '6:00 PM', activity: 'Evening leisure and dinner' }
          ],
          recommendation: currentRecommendation.trim() || 'Enjoy your day exploring this beautiful destination!'
        });
      }
      
      // Start new day
      const dayNumber = parseInt(dayMatch[1]);
      let location = dayMatch[2].replace(/\*+/g, '').trim();
      
      // Clean up location name - remove dates in various formats
      location = location.replace(/\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}/gi, '');
      location = location.replace(/\(Jan \d+, \d{4}\)/gi, ''); // Remove (Jan 30, 2026)
      location = location.replace(/\(Feb \d+, \d{4}\)/gi, ''); // Remove (Feb 1, 2026)
      location = location.replace(/\(Mar \d+, \d{4}\)/gi, ''); // etc.
      location = location.replace(/\(\d+\s*km[^)]*\)/gi, '').trim(); // Remove distance
      location = location.replace(/^[:\s-\(\)]+|[:\s-\(\)]+$/g, '').trim(); // Clean edges
      
      if (!location || location.length < 2) {
        location = `Day ${dayNumber} Exploration`;
      }
      
      console.log(`📅 Found Day ${dayNumber}: "${location}"`);
      
      currentDay = {
        day: dayNumber,
        location: location
      };
      currentActivities = [];
      currentRecommendation = '';
      capturingRecommendations = false;
      lastActivityTime = null;
      currentDayContent = ''; // Reset content capture
      continue;
    }
    
    // Skip if we haven't found a day yet
    if (!currentDay) continue;
    
    // Capture all content for this day (for fallback extraction)
    if (!line.match(/^(Transportation|Accommodation|Food|Safety|Total|Estimated|Note)/i)) {
      currentDayContent += line + ' ';
    }
    
    // Try MULTIPLE activity patterns
    let timeMatch = null;
    let activityText = null;
    
    // Pattern 1: 1. **8:00 AM**: Activity (NUMBERED LIST FORMAT - MOST COMMON)
    let pattern1 = line.match(/^\d+\.\s*\*{0,2}(\d{1,2}:\d{2}\s*(?:AM|PM))\*{0,2}[:\s]+(.+)$/i);
    if (pattern1) {
      timeMatch = pattern1[1];
      activityText = pattern1[2];
      console.log(`  ✅ Pattern 1 (numbered) matched: ${timeMatch}`);
    }
    
    // Pattern 2a: * **Morning (9:00 AM - 12:00 PM):** Activity description here
    // Must end with : or ** before activity text
    if (!timeMatch) {
      let pattern2a = line.match(/^\*\s*\*{0,2}(?:Morning|Afternoon|Evening|Night|Late|Early)[^(]*\((\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*[^)]+\)\*{0,2}:\s*(.+)$/i);
      if (pattern2a) {
        timeMatch = pattern2a[1];
        activityText = pattern2a[2];
        console.log(`  ✅ Pattern 2a (time range with *) matched: ${timeMatch}`);
      }
    }
    
    // Pattern 2b: * **9:30 AM - 12:00 PM:** Activity description here
    // Must have clear : separator after time range
    if (!timeMatch) {
      let pattern2b = line.match(/^\*\s*\*{0,2}(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)\*{0,2}:\s*(.+)$/i);
      if (pattern2b) {
        timeMatch = pattern2b[1];
        activityText = pattern2b[2];
        console.log(`  ✅ Pattern 2b (direct time range with *) matched: ${timeMatch}`);
      }
    }
    
    // Pattern 2c: - **Morning (9:00 AM - 12:00 PM):** Activity
    if (!timeMatch) {
      let pattern2c = line.match(/^-\s*\*{0,2}(?:Morning|Afternoon|Evening|Night|Late|Early)[^(]*\((\d{1,2}:\d{2}\s*(?:AM|PM))[^)]*\)\*{0,2}[:\s-]+(.+)$/i);
      if (pattern2c) {
        timeMatch = pattern2c[1];
        activityText = pattern2c[2];
        console.log(`  ✅ Pattern 2c (time range with -) matched: ${timeMatch}`);
      }
    }
    
    // Pattern 3: * 8:00 AM: Activity or - 8:00 AM: Activity
    if (!timeMatch) {
      let pattern3 = line.match(/^[-*]\s*(\d{1,2}:\d{2}\s*(?:AM|PM))[:\s-]+(.+)$/i);
      if (pattern3) {
        timeMatch = pattern3[1];
        activityText = pattern3[2];
        console.log(`  ✅ Pattern 3 (bullet) matched: ${timeMatch}`);
      }
    }
    
    // Pattern 4: Just time at start: 8:00 AM - Activity (but not a time range)
    if (!timeMatch) {
      let pattern4 = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))[:\s-]+(?!\d{1,2}:\d{2})(.+)$/i);
      if (pattern4) {
        timeMatch = pattern4[1];
        activityText = pattern4[2];
        console.log(`  ✅ Pattern 4 (plain time) matched: ${timeMatch}`);
      }
    }
    
    // If we found a time and activity, add it
    if (timeMatch && activityText && currentDay) {
      let activity = activityText.trim();
      
      // Clean up activity text - remove ALL pricing info
      activity = activity.replace(/\([^)]*INR[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*₹[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*entry fee[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*operating hours[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*rental[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*approx[^)]*\)/gi, '');
      activity = activity.replace(/\s+/g, ' ').trim();
      
      if (activity.length > 0) {
        currentActivities.push({
          time: timeMatch.trim(),
          activity: activity
        });
        lastActivityTime = timeMatch;
        console.log(`    ⏰ ${timeMatch}: ${activity.substring(0, 60)}${activity.length > 60 ? '...' : ''} [Full length: ${activity.length} chars]`);
      }
      continue;
    }
    
    // Capture multi-line activity descriptions (continuation of previous activity)
    if (lastActivityTime && line.match(/^[A-Z]/) && !line.match(/^(Day|Morning|Afternoon|Evening|Transportation|Accommodation|Food|Safety|Total|Estimated)/i)) {
      let continuedText = line.trim();
      continuedText = continuedText.replace(/\([^)]*INR[^)]*\)/gi, '');
      continuedText = continuedText.replace(/\([^)]*₹[^)]*\)/gi, '');
      continuedText = continuedText.replace(/\s+/g, ' ').trim();
      
      if (continuedText.length > 0 && currentActivities.length > 0) {
        const lastActivity = currentActivities[currentActivities.length - 1];
        lastActivity.activity += ' ' + continuedText;
        console.log(`    ➕ Added continuation: ${continuedText.substring(0, 40)}...`);
      }
    }
    
    // Check for recommendation/safety sections
    if (line.match(/\*{0,2}Safety Tips?\*{0,2}[:\s]*/i) || 
        line.match(/\*{0,2}Local Recommendations?\*{0,2}[:\s]*/i) ||
        line.match(/\*{0,2}Note\*{0,2}[:\s]*/i)) {
      console.log('💡 Found recommendation section');
      capturingRecommendations = true;
      continue;
    }
    
    // Capture recommendation lines
    if (capturingRecommendations && line.match(/^[-*]/)) {
      const recText = line.replace(/^[-*]\s*/, '').trim();
      if (recText) {
        currentRecommendation += (currentRecommendation ? ' ' : '') + recText;
      }
    }
  }
  
  // Save the last day (even with minimal activities)
  if (currentDay) {
    // If no activities found, try to parse the collected content
    if (currentActivities.length === 0 && currentDayContent.length > 0) {
      console.log(`⚠️ No activities matched patterns for final day, extracting from content...`);
      currentActivities = extractActivitiesFromContent(currentDayContent);
    }
    
    console.log(`✅ Saving final Day ${currentDay.day}: ${currentDay.location} with ${currentActivities.length} activities`);
    structuredDays.push({
      day: currentDay.day,
      location: currentDay.location,
      image: images[(currentDay.day - 1) % images.length],
      activities: currentActivities.length > 0 ? currentActivities : [
        { time: '9:00 AM', activity: 'Morning exploration and sightseeing' },
        { time: '1:00 PM', activity: 'Lunch and afternoon activities' },
        { time: '6:00 PM', activity: 'Evening leisure and dinner' }
      ],
      recommendation: currentRecommendation.trim() || 'Enjoy your day exploring this beautiful destination!'
    });
  }
  
  console.log(`📊 Final result: Parsed ${structuredDays.length} days from AI response`);
  
  // If we got SOME days but not enough, that's OK - return what we have
  if (structuredDays.length > 0) {
    return structuredDays;
  }
  
  // Only use fallback if we got NOTHING
  console.log('⚠️ Could not parse ANY days, generating fallback');
  return generateFallbackDays(response, totalDays, images);
}

// Fallback function to generate basic structured days
function generateFallbackDays(response, totalDays, images) {
  const fallbackDays = [];
  
  for (let i = 1; i <= totalDays; i++) {
    fallbackDays.push({
      day: i,
      location: `Day ${i} - Jharkhand Exploration`,
      image: images[(i - 1) % images.length],
      activities: [
        { time: '8:00 AM', activity: 'Start your day with breakfast and prepare for exploration' },
        { time: '10:00 AM', activity: 'Visit local attractions and landmarks' },
        { time: '1:00 PM', activity: 'Lunch at a local restaurant' },
        { time: '3:00 PM', activity: 'Continue exploration and sightseeing' },
        { time: '6:00 PM', activity: 'Evening leisure time and dinner' }
      ],
      recommendation: 'Check the detailed itinerary above for specific recommendations.'
    });
  }
  
  return fallbackDays;
}

// Helper function to extract activities from raw text content
function extractActivitiesFromContent(content) {
  const activities = [];
  
  // Pattern 1: Look for numbered list format: 1. **8:00 AM**: Activity
  const numberedPattern = /\d+\.\s*\*{0,2}(\d{1,2}:\d{2}\s*(?:AM|PM))\*{0,2}[:\s]+([^.]+(?:\.[^.0-9]*)?)/gi;
  let match;
  
  while ((match = numberedPattern.exec(content)) !== null) {
    let activity = match[2].trim();
    // Clean up
    activity = activity.replace(/\([^)]*INR[^)]*\)/gi, '');
    activity = activity.replace(/\([^)]*₹[^)]*\)/gi, '');
    activity = activity.replace(/\([^)]*approx[^)]*\)/gi, '');
    activity = activity.replace(/\s+/g, ' ').trim();
    
    if (activity.length > 10) {
      activities.push({
        time: match[1].trim(),
        activity: activity
      });
      console.log(`    🔍 Extracted: ${match[1]} - ${activity.substring(0, 50)}...`);
    }
  }
  
  // Pattern 2: If no numbered list found, try general time patterns
  if (activities.length === 0) {
    const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM))[:\s-]+([^.]+(?:\.[^.]*)?)/gi;
    while ((match = timePattern.exec(content)) !== null) {
      let activity = match[2].trim();
      // Clean up
      activity = activity.replace(/\([^)]*INR[^)]*\)/gi, '');
      activity = activity.replace(/\([^)]*₹[^)]*\)/gi, '');
      activity = activity.replace(/\s+/g, ' ').trim();
      
      if (activity.length > 10) {
        activities.push({
          time: match[1].trim(),
          activity: activity
        });
      }
    }
  }
  
  console.log(`📝 Extracted ${activities.length} activities from content`);
  return activities;
}

// Helper function to generate structured days from AI response (legacy - kept for compatibility)
function generateStructuredDays(response, days) {
  return parseAIResponseIntoDays(response, days);
}

module.exports = router;

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { seat, preferences } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        itinerary: [
          { time: '1:00 PM', event: 'Arrive at stadium' },
          { time: '2:30 PM', event: 'Match starts' }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a personalized Smart Itinerary generator for a fan attending the FIFA World Cup 2026.
    The fan is sitting at: ${seat}.
    Their preferences/diet: ${preferences}.
    
    Generate a 4-step chronological timeline/itinerary for their day at the stadium. Include navigating to the best gate, grabbing food that matches their diet near their seat, and being seated for the anthem.
    
    Return ONLY a JSON array of objects with keys:
    - 'time' (e.g. '3:15 PM')
    - 'event' (e.g. 'Arrive at Gate B')
    - 'description' (1 sentence detail)
    Do not use markdown blocks.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ itinerary: JSON.parse(responseText) });
  } catch (error) {
    console.error("Itinerary error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { arrivalTime, seatNumber, team } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock Fallback
      return NextResponse.json({
        itinerary: [
          { time: arrivalTime, event: `Arrive at the stadium and grab some gear for ${team}.` },
          { time: '15 mins later', event: 'Head to Concourse B for short wait times on food.' },
          { time: '30 mins later', event: `Proceed to seat ${seatNumber} for the pre-match show.` }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a personalized FIFA World Cup 2026 AI Assistant.
A fan is arriving at ${arrivalTime}, their seat is ${seatNumber}, and they support ${team}.
Generate a fun, 3-step personalized itinerary for them before the match starts.
Return ONLY a JSON array of objects with keys: 'time' (string) and 'event' (string). Do not use markdown blocks.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ itinerary: JSON.parse(text) });
  } catch (error) {
    console.error("Itinerary error:", error);
    // Graceful Fallback
    return NextResponse.json({
      itinerary: [
        { time: 'Upon Arrival', event: 'Welcome to the stadium! Experience high traffic mode fallback.' },
        { time: 'Before Kickoff', event: 'Enjoy the atmosphere and find your seat.' }
      ]
    });
  }
}

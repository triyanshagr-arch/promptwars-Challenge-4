import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { lostItems, foundItems } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ matches: [] });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an AI Matcher for a Stadium Lost & Found.
    Compare these two lists of items. A fan reported the 'Lost Items'. Staff logged the 'Found Items'.
    Determine if any Lost item strongly matches a Found item.
    
    Lost Items: ${JSON.stringify(lostItems)}
    Found Items: ${JSON.stringify(foundItems)}
    
    Return ONLY a JSON array of objects. Each object should have:
    - 'lostId': the id of the lost item
    - 'foundId': the id of the found item
    - 'confidence': number between 0 and 100 (only return matches > 60)
    - 'reason': short 1 sentence explanation of why they match
    Do not use markdown blocks.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ matches: JSON.parse(responseText) });
  } catch (error) {
    console.error("Matcher error (fallback):", error);
    return NextResponse.json({ matches: [] });
  }
}

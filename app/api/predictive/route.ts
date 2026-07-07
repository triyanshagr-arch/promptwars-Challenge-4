import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        bottlenecks: [
          { location: 'Gate A', severity: 'High', prediction: 'Expected 45 min wait in 10 minutes.' }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a Predictive Crowd Control AI for the FIFA World Cup 2026.
    Based on the current time and typical stadium flow, predict 3 upcoming bottlenecks or issues that will happen in the next 15 minutes.
    Return ONLY a JSON array of objects. Each object must have:
    - 'location' (e.g. 'North Concourse', 'Gate C')
    - 'severity' ('High', 'Medium', 'Low')
    - 'prediction' (1 sentence explaining what will happen and suggesting a proactive action)
    Do not use markdown blocks.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ bottlenecks: JSON.parse(responseText) });
  } catch (error) {
    console.error("Predictive error (fallback):", error);
    return NextResponse.json({ 
      bottlenecks: [
        { location: 'Gate A (Fallback Mode)', severity: 'High', prediction: 'Expected 45 min wait in 10 minutes.' }
      ]
    });
  }
}

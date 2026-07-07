import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "I'm in mock mode right now, but I can help you find your seat or report an issue!" });
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a helpful, enthusiastic, multilingual Fan Companion AI for the FIFA World Cup 2026. 
    You help fans with navigation, finding food, and reporting issues. 
    Keep your responses short, friendly, and under 3 sentences. 
    If they mention a hazard, spill, or problem, encourage them to use the 'Report Issue' button on their screen.
    
    Fan: ${message}`;
    
    const result = await model.generateContent(prompt);
    
    return NextResponse.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

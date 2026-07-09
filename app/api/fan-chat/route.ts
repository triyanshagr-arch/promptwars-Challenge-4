import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      // Mock Fallback
      return NextResponse.json({
        reply: "I'm your AI Stadium Assistant! (Fallback Mode - I can't connect to Gemini right now, but normally I would answer any question you have about the game, food, or rules!)"
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Construct conversation history for Gemini
    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })).slice(0, -1), // Everything except the last message
      systemInstruction: "You are the official AI Stadium Assistant for the FIFA World Cup 2026. Be highly enthusiastic, helpful, and concise. You can answer questions about football rules, stadium locations, food options, and match stats. Keep your answers under 3 sentences for mobile readability."
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const reply = result.response.text();
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Fan-chat error:", error);
    // Graceful Fallback
    return NextResponse.json({
      reply: "The stadium network is super busy right now! I'm operating in fallback mode. Please check the Explore tab for food and navigation."
    });
  }
}

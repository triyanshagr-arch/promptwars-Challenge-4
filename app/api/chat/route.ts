import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, history, image } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "I'm in mock mode right now, but I can help you find your seat or report an issue!" });
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a helpful, enthusiastic, multilingual Fan Companion AI for the FIFA World Cup 2026. 
    You help fans with navigation, finding food, transit options, and reporting issues. 
    If the fan uploads an image, analyze it and tell them what it is (e.g. "That's a hot dog stand" or "That sign points to Gate C").
    You know the stadium has 4 gates (A, B, C, D) and is accessible via the Red Line Train and North Parking Lot.
    Keep your responses short, friendly, and under 3 sentences. 
    
    Fan: ${message}`;
    
    let result;
    if (image) {
      // If there's an image, we pass it as a part to the model
      const imageParts = [
        {
          inlineData: {
            data: image.split(',')[1] || image, // Remove data:image/jpeg;base64, prefix if present
            mimeType: "image/jpeg"
          }
        }
      ];
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      result = await model.generateContent(prompt);
    }
    
    return NextResponse.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

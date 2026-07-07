import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { announcement } = await request.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        translations: [
          { language: 'Spanish', text: 'Simulación de anuncio...' },
          { language: 'French', text: 'Annonce simulée...' }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an AI translator for the FIFA World Cup 2026.
    Translate the following stadium announcement into Spanish, French, Arabic, and Mandarin.
    Return ONLY a JSON array of objects, where each object has 'language' and 'text' keys. Do not use markdown blocks.
    
    Announcement: "${announcement}"`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json({ translations: JSON.parse(responseText) });
  } catch (error) {
    console.error("Broadcast error (fallback):", error);
    return NextResponse.json({ 
      translations: [
        { language: 'Spanish (Fallback)', text: 'Debido a la alta demanda, estamos usando el sistema de respaldo.' },
        { language: 'French (Fallback)', text: 'En raison de la forte demande, nous utilisons le système de secours.' }
      ]
    });
  }
}

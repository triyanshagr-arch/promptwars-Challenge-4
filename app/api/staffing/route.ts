import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { incidents, bottlenecks } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        suggestions: [
          { action: 'Reallocate Stewards', detail: 'Move 5 stewards from Gate D to Gate B due to high density and wait times.' },
          { action: 'Deploy Security', detail: 'Dispatch 2 security personnel to investigate the active incidents in Sector 4.' }
        ]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are the AI Staffing Manager for a massive World Cup stadium.
Current active incidents: ${JSON.stringify(incidents)}
Predicted bottlenecks: ${JSON.stringify(bottlenecks)}

Provide 2-3 dynamic staffing reallocation suggestions based on this live data to optimize crowd flow and resolve incidents faster. 
Format as a JSON array of objects with 'action' (e.g. 'Reallocate Stewards') and 'detail' (the description of what to do). Just return the raw JSON array, no markdown blocks.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const suggestions = JSON.parse(text);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Staffing error (fallback):", error);
    return NextResponse.json({
      suggestions: [
        { action: 'Reallocate Stewards', detail: 'Move 5 stewards from Gate D to Gate B due to high density and wait times. (Fallback Mode)' },
        { action: 'Deploy Security', detail: 'Dispatch 2 security personnel to investigate the active incidents in Sector 4. (Fallback Mode)' }
      ]
    });
  }
}

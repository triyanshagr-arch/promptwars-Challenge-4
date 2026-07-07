import { NextResponse } from 'next/server';
import { getIncidents, saveIncident, updateIncidentStatus } from '@/lib/data';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET() {
  const incidents = getIncidents();
  return NextResponse.json(incidents);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { location, description, source } = body;
    
    // Generate an action plan using Gemini
    let aiActionPlan = "No AI action plan generated.";
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `You are an AI assistant for stadium operations at the FIFA World Cup 2026. 
        A fan or staff member has reported an issue.
        Location: ${location || 'Unknown'}
        Description: ${description}
        
        Generate a very brief, actionable 2-3 sentence plan for stadium staff to resolve this issue.`;
        
        const result = await model.generateContent(prompt);
        aiActionPlan = result.response.text();
      } catch (e) {
        console.error("Gemini API error:", e);
      }
    }
    
    const newIncident = saveIncident({
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      location: location || 'Unknown',
      description,
      status: 'new',
      aiActionPlan,
      source: source || 'fan_app'
    });
    
    return NextResponse.json(newIncident);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process incident' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const updated = updateIncidentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

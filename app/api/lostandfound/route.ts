import { NextResponse } from 'next/server';

let lostItems: any[] = [];
let foundItems: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  
  if (type === 'lost') return NextResponse.json(lostItems);
  if (type === 'found') return NextResponse.json(foundItems);
  
  return NextResponse.json({ lostItems, foundItems });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, item } = body;
  
  const newItem = {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    ...item
  };

  if (type === 'lost') {
    lostItems.push(newItem);
  } else if (type === 'found') {
    foundItems.push(newItem);
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  return NextResponse.json(newItem);
}

// Optional: for reset/testing
export async function DELETE() {
  lostItems = [];
  foundItems = [];
  return NextResponse.json({ success: true });
}

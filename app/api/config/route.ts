import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'config.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(fileContents);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config file:', error);
    return NextResponse.json(
      { error: 'Error reading config file' },
      { status: 500 }
    );
  }
}

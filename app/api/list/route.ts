import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const list = searchParams.get('list');

  try {
    const filePath = path.join(process.cwd(), 'data', list);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      return NextResponse.json(data);
    } else {
      throw new Error('List not found');
    }
  } catch (error) {
    console.error('Error reading list file:', error);
    return NextResponse.json(
      { error: 'Error reading list file' },
      { status: 404 }
    );
  }
}

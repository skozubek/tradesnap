// src/app/api/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Test data
  const testData = {
    success: true,
    data: {
      items: [
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" }
      ],
      totalCount: 2
    }
  };

  console.log('Test data:', JSON.stringify(testData, null, 2));
  
  return NextResponse.json(testData);
}
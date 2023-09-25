import { scrapeAll } from '@/app/scrapeAndSave/scraper';
import { NextResponse } from 'next/server';

export async function GET () {
  scrapeAll();
  return NextResponse.json({});
}

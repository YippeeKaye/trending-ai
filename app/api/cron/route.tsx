import { NextResponse } from 'next/server';
import { initializeDb } from '@/app/dbFunctions/models';
import { getAllModels, saveNewModels } from '../models/route';

export const dynamic = 'force-dynamic';

export async function GET () {
  await initializeDb();
  const allModels = await getAllModels();
  await saveNewModels(allModels);
  return NextResponse.json({ size: allModels.length });
}

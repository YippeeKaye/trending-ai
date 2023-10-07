import { NextResponse } from 'next/server';

import Replicate from 'replicate';

export const dynamic = 'force-dynamic';

export async function GET () {
  const replicate = new Replicate();

  // paginate and get all models
  const allModels = [];
  for await (const batch of replicate.paginate(replicate.models.list)) {
    allModels.push(...batch);
  }
  return NextResponse.json(allModels);
}

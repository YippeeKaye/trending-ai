import { NextResponse } from 'next/server';

import Replicate, { Model as ReplicateModel } from 'replicate';

export async function GET () {
  const replicate = new Replicate();

  // paginate and get all models
  const allModels = [];
  for await (const batch of replicate.paginate(replicate.models.list)) {
    allModels.push(...batch);
  }
  console.log(allModels.length);
  return NextResponse.json(allModels);
}

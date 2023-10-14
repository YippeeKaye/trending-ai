import { columns } from './columns';
import { DataTable } from './data-table';

export const dynamic = 'force-dynamic';

async function getData (filters: string[] = []) {
  const res = await fetch(
    `${process.env.HOST}/api/models${
      filters.length > 0 ? '?status=trending' : ''
    }`,
    {
      method: 'GET',
      cache: 'no-store'
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  const result = res.json();
  //console.log(result);
  return result;
}

type ModelsProps = {
  trending?: boolean;
};

export default async function Models ({ trending = false }: ModelsProps) {
  let data;
  if (trending) {
    data = await getData(['status=trending']);
  } else {
    data = await getData();
  }

  return (
    <div className='container mx-auto py-7'>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

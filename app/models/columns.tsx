'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Model = {
  id: string;
  name: string;
  description: string;
  runs: number;
  url: string;
};

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className='font-medium text-left'>{name}</div>;
    }
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;

      return <div className='font-medium text-center'>{description}</div>;
    }
  },
  {
    accessorKey: 'runs',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-right'>Runs</div>
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const runs = parseFloat(row.getValue('runs'));
      return <div className='font-medium text-left'>{runs}</div>;
    }
  },
  {
    accessorKey: 'delta',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div className='text-right'>Delta</div>
          <ArrowUpDown className='w-4 h-4 ml-2' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const runs = parseFloat(row.getValue('delta'));

      return <div className='font-medium text-left'>{runs}</div>;
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <div className='text-right'>Status</div>;
    },
    cell: ({ row }) => {
      const runs = parseFloat(row.getValue('delta'));

      return <div className='font-medium text-left'>{runs}</div>;
    }
  },
  {
    accessorKey: 'url',
    header: 'Link',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;

      return <ButtonLink href={url} name={url} />;
    },
    enableColumnFilter: false
  }
];

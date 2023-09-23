import { listModelsSortedByRuns } from "../dbFunctions/models"
import { Model, columns } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<Model[]> {
  return listModelsSortedByRuns()
}

export default async function ModelsPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

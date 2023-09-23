import { listModelsSortedByRuns } from "../dbFunctions/models"
import { Model, columns } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<Model[]> {
  return listModelsSortedByRuns() as any
}

export default async function ModelsPage() {
  const data = await getData()

  return (
    <div className="container py-10 mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

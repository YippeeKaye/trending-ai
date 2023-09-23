
import { Button } from "@/components/ui/button"
import { scrapeAll } from "../scrapeAndSave/scraper"


export default async function AdminPage() {  
    scrapeAll()
    return (
      <div className="container mx-auto py-10">
        <Button />
      </div>
    )
  }
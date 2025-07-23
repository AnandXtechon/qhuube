"use client"
import ProductTable from "./components/product-table";

const Page = () => {

    return (
        <div className="min-h-screen bg-background">
            <div className="px-4">
                <ProductTable />
            </div>
        </div>
    )
}

export default Page;
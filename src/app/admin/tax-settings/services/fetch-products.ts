import axiosInstance from "@/lib/axiosInstance";

// src/services/taxRuleService.ts
export async function fetchProducts() {
    try {
        const res = await axiosInstance.get("/products");
        console.log("Fetched products:", res.data.products);
        return res.data.products;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        throw new Error(err?.response?.data?.detail || "Failed to fetch tax rules");
    }
}

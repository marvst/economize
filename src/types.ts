export interface Product {
    id: string | number,
    description: string,
    price: number,
    unit: string,
    unitQty: number,
    weight: string,
    image: string,
    vendor: string,
    accuracy?: number
}
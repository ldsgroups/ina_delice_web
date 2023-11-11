import type { ETableShape, ETableState } from './types'

export interface IOption {
  label: string
  value: string
}

export interface IError {
  message: string
  detail: string
  code: string
  hint: string
}

export interface IStats {
  value: number
  rate: number
  label?: string
  tooltip?: string
  cbMessage?: string
}

export interface IProduct {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  quantity: number
}

export interface ITable {
  id: string
  name: string
  shape: ETableShape
  state: ETableState
  chairs: number
}

export interface ITableLayout {
  table: ITable
  position: { x: number; y: number }
}

export interface ICategory {
  id: number
  name: string
}

export interface IOrderDetails {
  orderId?: string
  productId?: string
  productName?: string
  quantity: number
  price: number
  total: number
}

export interface IOrder {
  id: number
  name: string
  date: Date
  totalAmount: number
  discount?: number
  couponCode?: string | null
  details?: IOrderDetails[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface IBasket {
  itemId: string
  itemName: string
  quantity: number
  price: number
  total: number
}

export interface ICustomerHistoric {
  name: string
  total_amount: number
  coupon_code: string | null
  created_at: string
}

export interface ProductType {
  id: number
  name: string
  price: number
  profit: number
  image: string
  quantity: number
  categories: {
    id: number
    name: string
  } | null
}

export interface ProductQuery {
  search: string
  category_id?: number
}

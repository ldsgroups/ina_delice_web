export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: number
          image: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          image: string
          is_active?: boolean
          name: string
          updated_at: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          customer_id: number
          discount: number
          id: number
          is_active: boolean
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          customer_id: number
          discount: number
          id?: number
          is_active?: boolean
          updated_at: string
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: number
          discount?: number
          id?: number
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'coupons_customer_id_fkey'
            columns: ['customer_id']
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          id: number
          is_active: boolean
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          phone: string
          updated_at: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Insert: {
          id?: number
          order_id: number
          price: number
          product_id: number
          quantity: number
        }
        Update: {
          id?: number
          order_id?: number
          price?: number
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string
          customer_id: number
          discount: number
          id: number
          last_editor_id: string
          name: string
          note: string | null
          seller_id: string
          status: Database['public']['Enums']['order_status']
          sub_total: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string
          customer_id?: number
          discount?: number
          id?: number
          last_editor_id: string
          name: string
          note?: string | null
          seller_id: string
          status?: Database['public']['Enums']['order_status']
          sub_total: number
          total_amount: number
          updated_at: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string
          customer_id?: number
          discount?: number
          id?: number
          last_editor_id?: string
          name?: string
          note?: string | null
          seller_id?: string
          status?: Database['public']['Enums']['order_status']
          sub_total?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_coupon_code_fkey'
            columns: ['coupon_code']
            referencedRelation: 'coupons'
            referencedColumns: ['code']
          },
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            referencedRelation: 'customers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_last_editor_id_fkey'
            columns: ['last_editor_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'orders_seller_id_fkey'
            columns: ['seller_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          alert_threshold: number
          category_id: number
          created_at: string
          id: number
          image: string
          is_active: boolean
          name: string
          price: number
          profit: number
          quantity: number
          updated_at: string
        }
        Insert: {
          alert_threshold?: number
          category_id: number
          created_at?: string
          id?: number
          image: string
          is_active?: boolean
          name: string
          price: number
          profit: number
          quantity?: number
          updated_at: string
        }
        Update: {
          alert_threshold?: number
          category_id?: number
          created_at?: string
          id?: number
          image?: string
          is_active?: boolean
          name?: string
          price?: number
          profit?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          is_admin: boolean
          is_client: boolean
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          is_admin?: boolean
          is_client?: boolean
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          is_admin?: boolean
          is_client?: boolean
          phone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_statistics: {
        Args: {
          from_date: string
          to_date: string
        }
        Returns: Json
      }
    }
    Enums: {
      order_status: 'pending' | 'paid' | 'delivered' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

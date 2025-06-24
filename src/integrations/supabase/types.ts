export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string | null
          id: string
          post_id: string | null
        }
        Insert: {
          category_id?: string | null
          id?: string
          post_id?: string | null
        }
        Update: {
          category_id?: string | null
          id?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          publish_date: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          newsletter_subscribed: boolean | null
          phone: string | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          newsletter_subscribed?: boolean | null
          phone?: string | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          personalization_data: Json | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          personalization_data?: Json | null
          price: number
          product_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          personalization_data?: Json | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string | null
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          fulfilled_at: string | null
          id: string
          notes: string | null
          payment_id: string | null
          personalization_data: Json | null
          shipping_address: Json | null
          status: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          uploaded_images: string[] | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string | null
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          fulfilled_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          personalization_data?: Json | null
          shipping_address?: Json | null
          status?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          uploaded_images?: string[] | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          fulfilled_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          personalization_data?: Json | null
          shipping_address?: Json | null
          status?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          uploaded_images?: string[] | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          category_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          category_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          category_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          collection_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          collection_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          backorder_allowed: boolean | null
          category: string
          created_at: string | null
          description: string | null
          featured_order: number | null
          featured_until: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          inventory_quantity: number | null
          is_active: boolean | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          name: string
          personalization_options: Json | null
          price: number | null
          seo_description: string | null
          seo_title: string | null
          shipping_time_days: number | null
          shipping_weight: number | null
          sku: string | null
          sort_order: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          backorder_allowed?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          featured_order?: number | null
          featured_until?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          name: string
          personalization_options?: Json | null
          price?: number | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_time_days?: number | null
          shipping_weight?: number | null
          sku?: string | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          backorder_allowed?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          featured_order?: number | null
          featured_until?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inventory_quantity?: number | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          name?: string
          personalization_options?: Json | null
          price?: number | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_time_days?: number | null
          shipping_weight?: number | null
          sku?: string | null
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          minimum_order: number | null
          starts_at: string | null
          type: string
          usage_limit: number | null
          used_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order?: number | null
          starts_at?: string | null
          type: string
          usage_limit?: number | null
          used_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order?: number | null
          starts_at?: string | null
          type?: string
          usage_limit?: number | null
          used_count?: number | null
          value?: number
        }
        Relationships: []
      }
      website_content: {
        Row: {
          about_background_image: string | null
          created_at: string | null
          featured_background_image: string | null
          hero_description: string | null
          hero_main_image: string | null
          hero_secondary_images: string[] | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          testimonials_background_image: string | null
          updated_at: string | null
        }
        Insert: {
          about_background_image?: string | null
          created_at?: string | null
          featured_background_image?: string | null
          hero_description?: string | null
          hero_main_image?: string | null
          hero_secondary_images?: string[] | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          testimonials_background_image?: string | null
          updated_at?: string | null
        }
        Update: {
          about_background_image?: string | null
          created_at?: string | null
          featured_background_image?: string | null
          hero_description?: string | null
          hero_main_image?: string | null
          hero_secondary_images?: string[] | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          testimonials_background_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

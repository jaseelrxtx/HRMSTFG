export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      announcement_banners: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          message: string
          position: number
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message: string
          position?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          message?: string
          position?: number
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_banners_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflows: {
        Row: {
          applicant_role: Database["public"]["Enums"]["app_role"] | null
          approval_chain: Database["public"]["Enums"]["app_role"][]
          created_at: string
          department_id: string | null
          id: string
          is_active: boolean
          leave_type_id: string | null
          name: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          applicant_role?: Database["public"]["Enums"]["app_role"] | null
          approval_chain: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          department_id?: string | null
          id?: string
          is_active?: boolean
          leave_type_id?: string | null
          name: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          applicant_role?: Database["public"]["Enums"]["app_role"] | null
          approval_chain?: Database["public"]["Enums"]["app_role"][]
          created_at?: string
          department_id?: string | null
          id?: string
          is_active?: boolean
          leave_type_id?: string | null
          name?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_workflows_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_workflows_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_workflows_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_communications: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          meeting_date: string | null
          project_id: string | null
          title: string
          type: string
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          meeting_date?: string | null
          project_id?: string | null
          title: string
          type: string
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          meeting_date?: string | null
          project_id?: string | null
          title?: string
          type?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_communications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      compensatory_offs: {
        Row: {
          created_at: string
          employee_id: string
          expires_at: string
          granted_by_id: string
          id: string
          is_used: boolean
          leave_application_id: string | null
          tenant_id: string | null
          worked_date: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          expires_at: string
          granted_by_id: string
          id?: string
          is_used?: boolean
          leave_application_id?: string | null
          tenant_id?: string | null
          worked_date: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          expires_at?: string
          granted_by_id?: string
          id?: string
          is_used?: boolean
          leave_application_id?: string | null
          tenant_id?: string | null
          worked_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "compensatory_offs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compensatory_offs_granted_by_id_fkey"
            columns: ["granted_by_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compensatory_offs_leave_application_id_fkey"
            columns: ["leave_application_id"]
            isOneToOne: false
            referencedRelation: "leave_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compensatory_offs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          category: string
          created_at: string | null
          id: string
          last_modified: string | null
          name: string
          status: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body: string
          category: string
          created_at?: string | null
          id?: string
          last_modified?: string | null
          name: string
          status: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          category?: string
          created_at?: string | null
          id?: string
          last_modified?: string | null
          name?: string
          status?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          about_me: string | null
          blood_group: string | null
          cpp_acknowledged_at: string | null
          created_at: string
          created_by: string | null
          current_address: string | null
          date_of_joining: string
          department_id: string | null
          designation: string | null
          emergency_contact_name: string | null
          emergency_contact_number: string | null
          employee_id: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          gender: Database["public"]["Enums"]["gender"] | null
          handbook_acknowledged_at: string | null
          id: string
          is_active: boolean
          last_modified_by: string | null
          leave_policy_acknowledged_at: string | null
          linkedin_url: string | null
          permanent_address: string | null
          personal_email: string | null
          posh_policy_acknowledged_at: string | null
          probation_end_date: string | null
          reporting_manager_id: string | null
          state: string | null
          tenant_id: string | null
          updated_at: string
          user_id: string | null
          work_location: string | null
          work_mode: string | null
        }
        Insert: {
          about_me?: string | null
          blood_group?: string | null
          cpp_acknowledged_at?: string | null
          created_at?: string
          created_by?: string | null
          current_address?: string | null
          date_of_joining: string
          department_id?: string | null
          designation?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          employee_id: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          gender?: Database["public"]["Enums"]["gender"] | null
          handbook_acknowledged_at?: string | null
          id?: string
          is_active?: boolean
          last_modified_by?: string | null
          leave_policy_acknowledged_at?: string | null
          linkedin_url?: string | null
          permanent_address?: string | null
          personal_email?: string | null
          posh_policy_acknowledged_at?: string | null
          probation_end_date?: string | null
          reporting_manager_id?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
          work_mode?: string | null
        }
        Update: {
          about_me?: string | null
          blood_group?: string | null
          cpp_acknowledged_at?: string | null
          created_at?: string
          created_by?: string | null
          current_address?: string | null
          date_of_joining?: string
          department_id?: string | null
          designation?: string | null
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          employee_id?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          gender?: Database["public"]["Enums"]["gender"] | null
          handbook_acknowledged_at?: string | null
          id?: string
          is_active?: boolean
          last_modified_by?: string | null
          leave_policy_acknowledged_at?: string | null
          linkedin_url?: string | null
          permanent_address?: string | null
          personal_email?: string | null
          posh_policy_acknowledged_at?: string | null
          probation_end_date?: string | null
          reporting_manager_id?: string | null
          state?: string | null
          tenant_id?: string | null
          updated_at?: string
          user_id?: string | null
          work_location?: string | null
          work_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          holiday_type: Database["public"]["Enums"]["holiday_type"] | null
          id: string
          is_national: boolean
          is_optional: boolean
          name: string
          states: string[] | null
          tenant_id: string | null
          year: number
        }
        Insert: {
          created_at?: string
          date: string
          holiday_type?: Database["public"]["Enums"]["holiday_type"] | null
          id?: string
          is_national?: boolean
          is_optional?: boolean
          name: string
          states?: string[] | null
          tenant_id?: string | null
          year: number
        }
        Update: {
          created_at?: string
          date?: string
          holiday_type?: Database["public"]["Enums"]["holiday_type"] | null
          id?: string
          is_national?: boolean
          is_optional?: boolean
          name?: string
          states?: string[] | null
          tenant_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "holidays_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          attachment_url: string | null
          created_at: string
          current_approver_role: Database["public"]["Enums"]["app_role"] | null
          days_count: number
          employee_id: string
          end_date: string
          id: string
          is_lop: boolean
          leave_type_id: string
          lop_days: number | null
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          current_approver_role?: Database["public"]["Enums"]["app_role"] | null
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          is_lop?: boolean
          leave_type_id: string
          lop_days?: number | null
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          current_approver_role?: Database["public"]["Enums"]["app_role"] | null
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          is_lop?: boolean
          leave_type_id?: string
          lop_days?: number | null
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_applications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string
          approver_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          id: string
          leave_application_id: string
          remarks: string | null
          status: Database["public"]["Enums"]["leave_status"]
          tenant_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approver_id: string
          approver_role: Database["public"]["Enums"]["app_role"]
          created_at?: string
          id?: string
          leave_application_id: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["leave_status"]
          tenant_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approver_id?: string
          approver_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          id?: string
          leave_application_id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["leave_status"]
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_approvals_leave_application_id_fkey"
            columns: ["leave_application_id"]
            isOneToOne: false
            referencedRelation: "leave_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_approvals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          adjusted_days: number
          carried_forward_days: number
          created_at: string
          employee_id: string
          entitled_days: number
          id: string
          leave_type_id: string
          tenant_id: string | null
          updated_at: string
          used_days: number
          year: number
        }
        Insert: {
          adjusted_days?: number
          carried_forward_days?: number
          created_at?: string
          employee_id: string
          entitled_days?: number
          id?: string
          leave_type_id: string
          tenant_id?: string | null
          updated_at?: string
          used_days?: number
          year: number
        }
        Update: {
          adjusted_days?: number
          carried_forward_days?: number
          created_at?: string
          employee_id?: string
          entitled_days?: number
          id?: string
          leave_type_id?: string
          tenant_id?: string | null
          updated_at?: string
          used_days?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          accrual_rate: number | null
          accrual_type: Database["public"]["Enums"]["accrual_type"]
          advance_notice_days: number | null
          auto_expiry_days: number | null
          carry_forward: boolean
          category: Database["public"]["Enums"]["leave_category"]
          code: string
          created_at: string
          description: string | null
          encashment: boolean
          entitlement_days: number
          gender_specific: Database["public"]["Enums"]["gender"] | null
          id: string
          is_enabled: boolean
          max_carry_forward_days: number | null
          max_days_per_month: number | null
          max_days_per_year: number | null
          medical_proof_required_after_days: number | null
          name: string
          post_probation_only: boolean
          requires_approval: boolean
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          accrual_rate?: number | null
          accrual_type?: Database["public"]["Enums"]["accrual_type"]
          advance_notice_days?: number | null
          auto_expiry_days?: number | null
          carry_forward?: boolean
          category?: Database["public"]["Enums"]["leave_category"]
          code: string
          created_at?: string
          description?: string | null
          encashment?: boolean
          entitlement_days?: number
          gender_specific?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_enabled?: boolean
          max_carry_forward_days?: number | null
          max_days_per_month?: number | null
          max_days_per_year?: number | null
          medical_proof_required_after_days?: number | null
          name: string
          post_probation_only?: boolean
          requires_approval?: boolean
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          accrual_rate?: number | null
          accrual_type?: Database["public"]["Enums"]["accrual_type"]
          advance_notice_days?: number | null
          auto_expiry_days?: number | null
          carry_forward?: boolean
          category?: Database["public"]["Enums"]["leave_category"]
          code?: string
          created_at?: string
          description?: string | null
          encashment?: boolean
          entitlement_days?: number
          gender_specific?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_enabled?: boolean
          max_carry_forward_days?: number | null
          max_days_per_month?: number | null
          max_days_per_year?: number | null
          medical_proof_required_after_days?: number | null
          name?: string
          post_probation_only?: boolean
          requires_approval?: boolean
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_types_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          leave_approved: boolean
          leave_rejected: boolean
          low_balance_alert: boolean
          new_leave_request: boolean
          probation_ending: boolean
          tenant_id: string | null
          upcoming_holiday: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          leave_approved?: boolean
          leave_rejected?: boolean
          low_balance_alert?: boolean
          new_leave_request?: boolean
          probation_ending?: boolean
          tenant_id?: string | null
          upcoming_holiday?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          leave_approved?: boolean
          leave_rejected?: boolean
          low_balance_alert?: boolean
          new_leave_request?: boolean
          probation_ending?: boolean
          tenant_id?: string | null
          upcoming_holiday?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_id: string | null
          tenant_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_id?: string | null
          tenant_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_id?: string | null
          tenant_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          address: string | null
          cpp_url: string | null
          created_at: string
          email: string | null
          employee_handbook_url: string | null
          fiscal_year_start: string | null
          id: string
          leave_policy_url: string | null
          name: string
          posh_policy_url: string | null
          tenant_id: string | null
          updated_at: string
          working_days: string | null
        }
        Insert: {
          address?: string | null
          cpp_url?: string | null
          created_at?: string
          email?: string | null
          employee_handbook_url?: string | null
          fiscal_year_start?: string | null
          id?: string
          leave_policy_url?: string | null
          name?: string
          posh_policy_url?: string | null
          tenant_id?: string | null
          updated_at?: string
          working_days?: string | null
        }
        Update: {
          address?: string | null
          cpp_url?: string | null
          created_at?: string
          email?: string | null
          employee_handbook_url?: string | null
          fiscal_year_start?: string | null
          id?: string
          leave_policy_url?: string | null
          name?: string
          posh_policy_url?: string | null
          tenant_id?: string | null
          updated_at?: string
          working_days?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          deadline: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_payments: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          project_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_payments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_testimonials: {
        Row: {
          client_name: string
          created_at: string | null
          feedback: string | null
          id: string
          is_public: boolean | null
          project_id: string | null
          rating: number | null
        }
        Insert: {
          client_name: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_public?: boolean | null
          project_id?: string | null
          rating?: number | null
        }
        Update: {
          client_name?: string
          created_at?: string | null
          feedback?: string | null
          id?: string
          is_public?: boolean | null
          project_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string | null
          client_name: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          initial_notes: string | null
          name: string
          project_head_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          initial_notes?: string | null
          name: string
          project_head_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          initial_notes?: string | null
          name?: string
          project_head_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_project_head_id_fkey"
            columns: ["project_head_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      smtp_email_config: {
        Row: {
          enabled: boolean | null
          encryption: string
          from_email: string
          from_name: string
          host: string
          id: string
          password: string
          port: number
          reply_to: string | null
          username: string
        }
        Insert: {
          enabled?: boolean | null
          encryption: string
          from_email: string
          from_name: string
          host: string
          id?: string
          password: string
          port: number
          reply_to?: string | null
          username: string
        }
        Update: {
          enabled?: boolean | null
          encryption?: string
          from_email?: string
          from_name?: string
          host?: string
          id?: string
          password?: string
          port?: number
          reply_to?: string | null
          username?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          features: Json
          id: string
          is_active: boolean
          is_public: boolean
          max_admins: number
          max_departments: number | null
          max_employees: number
          monthly_price: number
          plan_code: string
          plan_name: string
          sort_order: number | null
          storage_limit_gb: number | null
          updated_at: string
          yearly_price: number
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_admins: number
          max_departments?: number | null
          max_employees: number
          monthly_price?: number
          plan_code: string
          plan_name: string
          sort_order?: number | null
          storage_limit_gb?: number | null
          updated_at?: string
          yearly_price?: number
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean
          is_public?: boolean
          max_admins?: number
          max_departments?: number | null
          max_employees?: number
          monthly_price?: number
          plan_code?: string
          plan_name?: string
          sort_order?: number | null
          storage_limit_gb?: number | null
          updated_at?: string
          yearly_price?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string | null
          created_at: string
          currency: string
          current_period_end: string
          current_period_start: string
          ends_at: string | null
          id: string
          last_payment_date: string | null
          metadata: Json | null
          next_payment_due: string | null
          notes: string | null
          payment_method: string | null
          plan_id: string
          starts_at: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          billing_cycle?: string | null
          created_at?: string
          currency?: string
          current_period_end: string
          current_period_start?: string
          ends_at?: string | null
          id?: string
          last_payment_date?: string | null
          metadata?: Json | null
          next_payment_due?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_id: string
          starts_at?: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_cycle?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          ends_at?: string | null
          id?: string
          last_payment_date?: string | null
          metadata?: Json | null
          next_payment_due?: string | null
          notes?: string | null
          payment_method?: string | null
          plan_id?: string
          starts_at?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      super_admins: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          notes: string | null
          permissions: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          permissions?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          permissions?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "super_admins_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "super_admins"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          status: string
          tenant_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          tenant_id: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          tenant_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_invitations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          billing_address: Json | null
          billing_email: string
          billing_name: string | null
          created_at: string
          domain: string | null
          enabled_features: Json
          id: string
          is_active: boolean
          max_admins: number
          max_employees: number
          metadata: Json | null
          name: string
          plan_type: string
          slug: string
          subscription_status: string
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          billing_email: string
          billing_name?: string | null
          created_at?: string
          domain?: string | null
          enabled_features?: Json
          id?: string
          is_active?: boolean
          max_admins?: number
          max_employees?: number
          metadata?: Json | null
          name: string
          plan_type?: string
          slug: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          billing_email?: string
          billing_name?: string | null
          created_at?: string
          domain?: string | null
          enabled_features?: Json
          id?: string
          is_active?: boolean
          max_admins?: number
          max_employees?: number
          metadata?: Json | null
          name?: string
          plan_type?: string
          slug?: string
          subscription_status?: string
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      usage_metrics: {
        Row: {
          active_employees: number | null
          admin_users: number | null
          api_calls: number | null
          id: string
          metadata: Json | null
          period_end: string
          period_start: string
          recorded_at: string
          storage_used_mb: number | null
          tenant_id: string
          total_employees: number | null
        }
        Insert: {
          active_employees?: number | null
          admin_users?: number | null
          api_calls?: number | null
          id?: string
          metadata?: Json | null
          period_end: string
          period_start: string
          recorded_at?: string
          storage_used_mb?: number | null
          tenant_id: string
          total_employees?: number | null
        }
        Update: {
          active_employees?: number | null
          admin_users?: number | null
          api_calls?: number | null
          id?: string
          metadata?: Json | null
          period_end?: string
          period_start?: string
          recorded_at?: string
          storage_used_mb?: number | null
          tenant_id?: string
          total_employees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_yearly_balances: {
        Args: { target_year?: number }
        Returns: undefined
      }
      is_admin_or_hr: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      accrual_type: "yearly" | "monthly" | "per_working_days" | "none"
      app_role: "admin" | "hr" | "finance" | "manager" | "team_member"
      employment_type: "full_time" | "part_time" | "contract"
      gender: "male" | "female" | "other"
      holiday_type: "national" | "company" | "regional"
      leave_category:
        | "regular"
        | "wellness"
        | "special"
        | "statutory"
        | "compensatory"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      accrual_type: ["yearly", "monthly", "per_working_days", "none"],
      app_role: ["admin", "hr", "finance", "manager", "team_member"],
      employment_type: ["full_time", "part_time", "contract"],
      gender: ["male", "female", "other"],
      holiday_type: ["national", "company", "regional"],
      leave_category: [
        "regular",
        "wellness",
        "special",
        "statutory",
        "compensatory",
      ],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
    },
  },
} as const

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Configurando Supabase...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'Não definida')

let supabaseClient

// CORREÇÃO: Exportação no nível superior
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  
  // Client mock para desenvolvimento
  supabaseClient = {
    from: () => ({ 
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ error: null })
    })
  }
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    console.log('✅ Supabase client criado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao criar cliente Supabase:', error)
    // Fallback para evitar quebra da aplicação
    supabaseClient = {
      from: () => ({ 
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        delete: () => Promise.resolve({ error: null })
      })
    }
  }
}

export const supabase = supabaseClient
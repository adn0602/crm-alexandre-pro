import { supabase } from '../lib/supabase'

export const clientService = {
  // Buscar todos os clientes
  async getAllClients(filters = {}) {
    try {
      console.log('🔄 Buscando clientes do Supabase...');
      
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado - retornando dados vazios');
        return [];
      }
      
      let query = supabase.from('clients').select('*');
      
      if (filters.status && filters.status !== 'todos') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar clientes:', error);
        return [];
      }
      
      console.log(`✅ ${data?.length || 0} clientes carregados`);
      
      return (data || []).map(client => ({
        id: client.id,
        nome: client.name,
        telefone: client.phone,
        email: client.email,
        status: client.status
      }));
    } catch (error) {
      console.error('❌ Erro completo ao buscar clientes:', error);
      return [];
    }
  },

  // Buscar cliente por ID
  async getClientById(id) {
    try {
      console.log(`🔄 Buscando cliente ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        return null;
      }

      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('❌ Erro ao buscar cliente:', error);
        return null;
      }
      
      return {
        id: data.id,
        nome: data.name,
        telefone: data.phone,
        email: data.email,
        status: data.status
      };
    } catch (error) {
      console.error('❌ Erro completo ao buscar cliente:', error);
      return null;
    }
  },

  // Criar novo cliente
  async createClient(client) {
    try {
      console.log('🔄 Criando novo cliente...', client);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const clientData = {
        name: client.nome,
        phone: client.telefone,
        email: client.email || null,
        status: client.status
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();
      
      if (error) {
        console.error('❌ Erro ao criar cliente:', error);
        throw error;
      }
      
      const newClient = data[0];
      console.log('✅ Cliente criado com sucesso:', newClient);
      
      return {
        id: newClient.id,
        nome: newClient.name,
        telefone: newClient.phone,
        email: newClient.email,
        status: newClient.status
      };
    } catch (error) {
      console.error('❌ Erro completo ao criar cliente:', error);
      throw error;
    }
  },

  // Atualizar cliente
  async updateClient(id, client) {
    try {
      console.log(`🔄 Atualizando cliente ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const clientData = {
        name: client.nome,
        phone: client.telefone,
        email: client.email || null,
        status: client.status,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Erro ao atualizar cliente:', error);
        throw error;
      }
      
      const updatedClient = data[0];
      console.log('✅ Cliente atualizado com sucesso:', updatedClient);
      
      return {
        id: updatedClient.id,
        nome: updatedClient.name,
        telefone: updatedClient.phone,
        email: updatedClient.email,
        status: updatedClient.status
      };
    } catch (error) {
      console.error('❌ Erro completo ao atualizar cliente:', error);
      throw error;
    }
  },

  // Deletar cliente
  async deleteClient(id) {
    try {
      console.log(`🔄 Deletando cliente ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar cliente:', error);
        throw error;
      }
      
      console.log('✅ Cliente deletado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro completo ao deletar cliente:', error);
      throw error;
    }
  }
};
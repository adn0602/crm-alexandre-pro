import { supabase } from '../lib/supabase'

export const propertyService = {
  // Buscar todos os imóveis
  async getAllProperties(filters = {}) {
    try {
      console.log('🔄 Buscando imóveis do Supabase...');
      
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado - retornando dados vazios');
        return [];
      }
      
      let query = supabase.from('properties').select('*');
      
      // Aplicar filtros
      if (filters.status && filters.status !== 'todos') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.type && filters.type !== 'todos') {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Erro ao buscar imóveis:', error);
        // Retornar array vazio em caso de erro
        return [];
      }
      
      console.log(`✅ ${data?.length || 0} imóveis carregados`);
      
      return (data || []).map(property => ({
        id: property.id,
        titulo: property.title,
        endereco: property.address,
        preco: property.price,
        tipo: property.type,
        status: property.status,
        quartos: property.bedrooms,
        banheiros: property.bathrooms,
        area: property.area,
        descricao: property.description,
        fotos: property.photos || []
      }));
    } catch (error) {
      console.error('❌ Erro completo ao buscar imóveis:', error);
      return [];
    }
  },

  // Buscar imóvel por ID
  async getPropertyById(id) {
    try {
      console.log(`🔄 Buscando imóvel ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        return null;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('❌ Erro ao buscar imóvel:', error);
        return null;
      }
      
      return {
        id: data.id,
        titulo: data.title,
        endereco: data.address,
        preco: data.price,
        tipo: data.type,
        status: data.status,
        quartos: data.bedrooms,
        banheiros: data.bathrooms,
        area: data.area,
        descricao: data.description,
        fotos: data.photos || []
      };
    } catch (error) {
      console.error('❌ Erro completo ao buscar imóvel:', error);
      return null;
    }
  },

  // Criar novo imóvel
  async createProperty(property) {
    try {
      console.log('🔄 Criando novo imóvel...', property);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const propertyData = {
        title: property.titulo,
        address: property.endereco,
        price: parseFloat(property.preco) || 0,
        type: property.tipo,
        status: property.status,
        bedrooms: parseInt(property.quartos) || 0,
        bathrooms: parseInt(property.banheiros) || 0,
        area: parseFloat(property.area) || 0,
        description: property.descricao
      };

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();
      
      if (error) {
        console.error('❌ Erro ao criar imóvel:', error);
        throw error;
      }
      
      const newProperty = data[0];
      console.log('✅ Imóvel criado com sucesso:', newProperty);
      
      return {
        id: newProperty.id,
        titulo: newProperty.title,
        endereco: newProperty.address,
        preco: newProperty.price,
        tipo: newProperty.type,
        status: newProperty.status,
        quartos: newProperty.bedrooms,
        banheiros: newProperty.bathrooms,
        area: newProperty.area,
        descricao: newProperty.description,
        fotos: newProperty.photos || []
      };
    } catch (error) {
      console.error('❌ Erro completo ao criar imóvel:', error);
      throw error;
    }
  },

  // Atualizar imóvel
  async updateProperty(id, property) {
    try {
      console.log(`🔄 Atualizando imóvel ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const propertyData = {
        title: property.titulo,
        address: property.endereco,
        price: parseFloat(property.preco) || 0,
        type: property.tipo,
        status: property.status,
        bedrooms: parseInt(property.quartos) || 0,
        bathrooms: parseInt(property.banheiros) || 0,
        area: parseFloat(property.area) || 0,
        description: property.descricao,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Erro ao atualizar imóvel:', error);
        throw error;
      }
      
      const updatedProperty = data[0];
      console.log('✅ Imóvel atualizado com sucesso:', updatedProperty);
      
      return {
        id: updatedProperty.id,
        titulo: updatedProperty.title,
        endereco: updatedProperty.address,
        preco: updatedProperty.price,
        tipo: updatedProperty.type,
        status: updatedProperty.status,
        quartos: updatedProperty.bedrooms,
        banheiros: updatedProperty.bathrooms,
        area: updatedProperty.area,
        descricao: updatedProperty.description,
        fotos: updatedProperty.photos || []
      };
    } catch (error) {
      console.error('❌ Erro completo ao atualizar imóvel:', error);
      throw error;
    }
  },

  // Deletar imóvel
  async deleteProperty(id) {
    try {
      console.log(`🔄 Deletando imóvel ${id}...`);
      
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Supabase não configurado');
        throw new Error('Supabase não configurado');
      }
      
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('❌ Erro ao deletar imóvel:', error);
        throw error;
      }
      
      console.log('✅ Imóvel deletado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro completo ao deletar imóvel:', error);
      throw error;
    }
  }
};
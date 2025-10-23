// dashboard.jsx - Versão sem Supabase para teste
export const fetchDashboardData = async () => {
  console.log('Buscando dados do dashboard...');
  
  // Dados mock para teste - SEM SUPABASE
  const mockData = {
    metricas: {
      totalClientes: 24,
      totalImoveis: 15,
      tarefasPendentes: 8,
      imoveisVendidos: 6,
      taxaConversao: 25.0,
      faturamento: 60000,
    },
    graficos: {
      funilVendas: [
        { etapa: 'Leads', quantidade: 24 },
        { etapa: 'Contato', quantidade: 17 },
        { etapa: 'Proposta', quantidade: 10 },
        { etapa: 'Negociação', quantidade: 5 },
        { etapa: 'Vendido', quantidade: 6 },
      ],
      performanceMensal: [
        { mes: 'Jan', vendas: 4, leads: 12 },
        { mes: 'Fev', vendas: 3, leads: 8 },
        { mes: 'Mar', vendas: 6, leads: 15 },
        { mes: 'Abr', vendas: 2, leads: 6 },
        { mes: 'Mai', vendas: 5, leads: 10 },
        { mes: 'Jun', vendas: 7, leads: 18 },
      ],
      distribuicaoStatus: [
        { name: 'Novo Lead', value: 8 },
        { name: 'Em Negociação', value: 6 },
        { name: 'Fechado', value: 6 },
        { name: 'Perdido', value: 4 },
      ],
    },
  };

  console.log('Dados mock carregados:', mockData);
  return mockData;
};
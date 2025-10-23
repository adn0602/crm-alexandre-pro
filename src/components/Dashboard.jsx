import React from 'react';
import './Dashboard.css';

const Dashboard = ({ clients }) => {
  // Calcular estatísticas
  const totalClientes = clients.length;
  const clientesComEmail = clients.filter(client => client.email && client.email !== 'EMPTY').length;
  const clientesComTelefone = clients.filter(client => client.telefone && client.telefone.trim() !== '').length;
  const clientesAtivos = clients.filter(client => client.status === 'ativo').length;

  // Dados para gráficos (mock por enquanto)
  const funilVendas = [
    { etapa: 'Leads', quantidade: totalClientes },
    { etapa: 'Contato', quantidade: Math.floor(totalClientes * 0.7) },
    { etapa: 'Proposta', quantidade: Math.floor(totalClientes * 0.4) },
    { etapa: 'Negociação', quantidade: Math.floor(totalClientes * 0.2) },
    { etapa: 'Vendido', quantidade: Math.floor(totalClientes * 0.1) }
  ];

  return (
    <div className="dashboard">
      <h2>Dashboard - Visão Geral</h2>
      
      {/* Cards de Métricas */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <h3>Total de Clientes</h3>
            <span className="metric-value">{totalClientes}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📧</div>
          <div className="metric-info">
            <h3>Com E-mail</h3>
            <span className="metric-value">{clientesComEmail}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📞</div>
          <div className="metric-info">
            <h3>Com Telefone</h3>
            <span className="metric-value">{clientesComTelefone}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>Clientes Ativos</h3>
            <span className="metric-value">{clientesAtivos}</span>
          </div>
        </div>
      </div>

      {/* Gráficos e Estatísticas */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Funil de Vendas</h3>
          <div className="funil-container">
            {funilVendas.map((item, index) => (
              <div key={index} className="funil-item">
                <div className="funil-etapa">{item.etapa}</div>
                <div className="funil-bar">
                  <div 
                    className="funil-fill" 
                    style={{ width: `${(item.quantidade / totalClientes) * 100}%` }}
                  ></div>
                </div>
                <div className="funil-value">{item.quantidade}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Status dos Clientes</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-dot novo"></span>
              <span>Novos Leads</span>
              <span className="status-count">{Math.floor(totalClientes * 0.3)}</span>
            </div>
            <div className="status-item">
              <span className="status-dot contato"></span>
              <span>Em Contato</span>
              <span className="status-count">{Math.floor(totalClientes * 0.4)}</span>
            </div>
            <div className="status-item">
              <span className="status-dot negociacao"></span>
              <span>Em Negociação</span>
              <span className="status-count">{Math.floor(totalClientes * 0.2)}</span>
            </div>
            <div className="status-item">
              <span className="status-dot fechado"></span>
              <span>Fechados</span>
              <span className="status-count">{Math.floor(totalClientes * 0.1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">➕</span>
            <span>Novo Cliente</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📅</span>
            <span>Agendar Visita</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span>Relatório Mensal</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📨</span>
            <span>Enviar E-mail</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
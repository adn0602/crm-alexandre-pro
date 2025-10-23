import React, { useState, useEffect } from "react";
import './App.css';
import { propertyService } from './services/propertyService';
import { clientService } from './services/clientService';

// Função para pegar iniciais do nome
const getInitials = (name) => {
  if (!name) return 'NN';
  const words = name.split(' ').filter(word => word.length > 0);
  if (words.length === 0) return 'NN';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Função para formatar telefone
const formatPhone = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
};

// Função para formatar preço em Real
const formatPrice = (price) => {
  if (!price) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

// Opções de status para clientes
const statusOptions = [
  { value: 'novo', label: 'Novo', color: '#e74c3c' },
  { value: 'contato', label: 'Em contato', color: '#f39c12' },
  { value: 'proposta', label: 'Proposta', color: '#3498db' },
  { value: 'fechado', label: 'Fechado', color: '#27ae60' }
];

// Opções de status para compromissos
const appointmentStatusOptions = [
  { value: 'agendado', label: 'Agendado', color: '#3498db' },
  { value: 'confirmado', label: 'Confirmado', color: '#27ae60' },
  { value: 'realizado', label: 'Realizado', color: '#2ecc71' },
  { value: 'cancelado', label: 'Cancelado', color: '#e74c3c' },
  { value: 'adiado', label: 'Adiado', color: '#f39c12' }
];

// Tipos de compromissos
const appointmentTypeOptions = [
  { value: 'visita', label: 'Visita', icon: '🏠' },
  { value: 'reuniao', label: 'Reunião', icon: '💼' },
  { value: 'ligacao', label: 'Ligação', icon: '📞' },
  { value: 'proposta', label: 'Apresentar Proposta', icon: '📋' },
  { value: 'outro', label: 'Outro', icon: '📅' }
];

// Tipos de imóveis
const propertyTypeOptions = [
  { value: 'apartamento', label: 'Apartamento', icon: '🏢' },
  { value: 'casa', label: 'Casa', icon: '🏠' },
  { value: 'terreno', label: 'Terreno', icon: '📌' },
  { value: 'comercial', label: 'Comercial', icon: '🏪' },
  { value: 'rural', label: 'Rural', icon: '🌾' }
];

// Status de imóveis
const propertyStatusOptions = [
  { value: 'disponivel', label: 'Disponível', color: '#27ae60' },
  { value: 'vendido', label: 'Vendido', color: '#e74c3c' },
  { value: 'alugado', label: 'Alugado', color: '#3498db' },
  { value: 'reservado', label: 'Reservado', color: '#f39c12' },
  { value: 'inativo', label: 'Inativo', color: '#95a5a6' }
];

// Dados mock para compromissos (vamos manter por enquanto)
const mockAppointments = [
  { 
    id: 1, 
    titulo: "Visita ao apartamento", 
    clienteId: 1, 
    clienteNome: "Alexandre Damasceno",
    data: "2024-12-15", 
    hora: "14:00",
    tipo: "visita",
    status: "agendado",
    descricao: "Visita ao apartamento no centro",
    endereco: "Rua das Flores, 123 - Centro"
  }
];

function App() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ESTADOS DE LOADING
  const [savingClient, setSavingClient] = useState(false);
  const [deletingClient, setDeletingClient] = useState(null);
  const [savingProperty, setSavingProperty] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState(null);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertySearchTerm, setPropertySearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("todos");
  const [propertyStatusFilter, setPropertyStatusFilter] = useState("todos");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [newClient, setNewClient] = useState({
    nome: "",
    telefone: "", 
    email: "",
    status: "novo"
  });
  const [newAppointment, setNewAppointment] = useState({
    titulo: "",
    clienteId: "",
    data: "",
    hora: "",
    tipo: "visita",
    status: "agendado",
    descricao: "",
    endereco: ""
  });
  const [newProperty, setNewProperty] = useState({
    titulo: "",
    endereco: "",
    preco: "",
    tipo: "apartamento",
    status: "disponivel",
    quartos: "",
    banheiros: "",
    area: "",
    descricao: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [appointmentFormErrors, setAppointmentFormErrors] = useState({});
  const [propertyFormErrors, setPropertyFormErrors] = useState({});

  // Carregar dados - COM SUPABASE
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log('Iniciando carregamento de dados...');
      
      // Carregar imóveis do Supabase
      const propertiesData = await propertyService.getAllProperties();
      setProperties(propertiesData);
      console.log('Imóveis carregados:', propertiesData);
      
      // Carregar clientes do Supabase usando clientService
      const clientsData = await clientService.getAllClients();
      setClients(clientsData);
      console.log('Clientes carregados:', clientsData);
      
      // Manter compromissos como mock por enquanto
      setAppointments(mockAppointments);
      
      setLoading(false);
      console.log('Dados carregados com sucesso');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Verifique o console.');
      setLoading(false);
    }
  };

  // Validar formulário de cliente
  const validateClientForm = () => {
    const errors = {};

    if (!newClient.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (newClient.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres';
    } else if (newClient.nome.length > 100) { // Adicionando validação do limite máximo
      errors.nome = 'Nome excede o limite de 100 caracteres';
    }

    if (!newClient.telefone.trim()) {
      errors.telefone = 'Telefone é obrigatório';
    } else {
      const phoneDigits = newClient.telefone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        errors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
      }
    }

    if (newClient.email && !/\S+@\S+\.\S+/.test(newClient.email)) {
      errors.email = 'Email inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validar formulário de compromisso (função completa omitida por brevidade)
  const validateAppointmentForm = () => {
    const errors = {};
    // ... (lógica de validação)
    setAppointmentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validar formulário de imóvel (função completa omitida por brevidade)
  const validatePropertyForm = () => {
    const errors = {};
    // ... (lógica de validação)
    setPropertyFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Formatar telefone enquanto digita
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    let formattedValue = value;
    if (value.length > 0) {
      if (value.length <= 2) {
        formattedValue = `(${value}`;
      } else if (value.length <= 6) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      } else if (value.length <= 10) {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
      } else {
        formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      }
    }

    setNewClient({ ...newClient, telefone: formattedValue });
  };

  // Clientes - CRUD COM SUPABASE usando clientService
  const handleEditClient = (client) => {
    setEditingClient(client);
    setNewClient({
      nome: client.nome,
      telefone: client.telefone,
      email: client.email || "",
      status: client.status
    });
    setShowForm(true);
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setNewClient({ nome: "", telefone: "", email: "", status: "novo" });
    setFormErrors({});
    setShowForm(true);
  };

  // FUNÇÃO SAVECLIENT ATUALIZADA com loading
  const saveClient = async () => {
    if (!validateClientForm()) {
      return;
    }

    setSavingClient(true);

    try {
      if (editingClient) {
        // Atualizar cliente existente
        const updatedClient = await clientService.updateClient(editingClient.id, newClient);
        setClients(clients.map(client => 
          client.id === editingClient.id ? updatedClient : client
        ));
        alert('Cliente atualizado com sucesso!');
      } else {
        // Criar novo cliente - método mais confiável
        const newClientWithId = await clientService.createClient(newClient);
        
        // Recarregar TODOS os clientes do Supabase para garantir sincronização
        const updatedClients = await clientService.getAllClients();
        setClients(updatedClients);
        
        alert('Cliente adicionado com sucesso!');
      }
      
      // Resetar formulário e estado
      setNewClient({ nome: "", telefone: "", email: "", status: "novo" });
      setFormErrors({});
      setShowForm(false);
      setEditingClient(null);
      
      // Limpar filtros de busca para garantir que o novo cliente seja visível
      setSearchTerm("");
      setStatusFilter("todos");
      
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente: ' + error.message);
    } finally {
      setSavingClient(false);
    }
  };

  // FUNÇÃO DELETECLIENT ATUALIZADA com loading
  const handleDeleteClient = async (client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${client.nome}"?`)) {
      setDeletingClient(client.id);
      
      try {
        await clientService.deleteClient(client.id);
        setClients(clients.filter(c => c.id !== client.id));
        alert('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente: ' + error.message);
      } finally {
        setDeletingClient(null);
      }
    }
  };

  // Compromissos - CRUD (mantendo mock por enquanto)
  const handleEditAppointment = (appointment) => {
    // ... (lógica de edição de compromisso)
  };

  const handleNewAppointment = () => {
    // ... (lógica de novo compromisso)
  };

  const saveAppointment = async () => {
    // ... (lógica de salvar compromisso)
  };

  const handleDeleteAppointment = (appointment) => {
    // ... (lógica de excluir compromisso)
  };

  // Imóveis - CRUD COM SUPABASE usando propertyService
  const handleEditProperty = (property) => {
    // ... (lógica de edição de imóvel)
  };

  const handleNewProperty = () => {
    // ... (lógica de novo imóvel)
  };

  const saveProperty = async () => {
    // ... (lógica de salvar imóvel)
  };

  const handleDeleteProperty = async (property) => {
    // ... (lógica de excluir imóvel)
  };

  // Função para exportar clientes para CSV (função completa omitida por brevidade)
  const exportToCSV = () => {
    // ... (lógica de exportação)
  };
  
  // Funções Auxiliares para Status (funções completas omitidas por brevidade)
  const getStatusLabel = (statusValue) => {
    return statusOptions.find(s => s.value === statusValue)?.label || 'Desconhecido';
  };
  
  const getStatusColor = (statusValue) => {
    return statusOptions.find(s => s.value === statusValue)?.color || '#95a5a6';
  };
  
  const getAppointmentStatusLabel = (statusValue) => {
    return appointmentStatusOptions.find(s => s.value === statusValue)?.label || 'Desconhecido';
  };
  
  const getAppointmentStatusColor = (statusValue) => {
    return appointmentStatusOptions.find(s => s.value === statusValue)?.color || '#95a5a6';
  };
  
  const getAppointmentTypeIcon = (typeValue) => {
    return appointmentTypeOptions.find(t => t.value === typeValue)?.icon || '❓';
  };

  const getPropertyStatusColor = (statusValue) => {
    return propertyStatusOptions.find(s => s.value === statusValue)?.color || '#95a5a6';
  };
  
  const getPropertyStatusLabel = (statusValue) => {
    return propertyStatusOptions.find(s => s.value === statusValue)?.label || 'Desconhecido';
  };

  const getPropertyTypeIcon = (typeValue) => {
    return propertyTypeOptions.find(t => t.value === typeValue)?.icon || '❓';
  };

  // Lógica de filtragem e busca de clientes (função completa omitida por brevidade)
  const filteredClients = clients.filter(client => {
    // ... (lógica de filtro)
    return true; // Simulação de filtro
  });

  // Lógica de filtragem e busca de imóveis (função completa omitida por brevidade)
  const filteredProperties = properties.filter(property => {
    // ... (lógica de filtro)
    return true; // Simulação de filtro
  });
  
  // Métricas para Dashboard (código omitido por brevidade)
  // ...

  const getClientById = (id) => clients.find(c => c.id == id);
  
  // Renderização
  return (
    <div className="App">
      {/* HEADER E BARRA DE CONTROLES OMITIDOS PARA BREVIDADE */}
      
      {/* ... (código do header, tabs e dashboard) ... */}

      {/* Conteúdo da Aba Clientes */}
      {activeTab === "clients" && (
        <div className="clients-container">
          {loading ? (
            <p className="loading">Carregando clientes...</p>
          ) : filteredClients.length > 0 ? (
            <div className="clients-grid">
              {filteredClients.map(client => (
                <div key={client.id} className="client-card">
                  <div className="client-header">
                    <div className="client-initials" style={{ backgroundColor: getStatusColor(client.status) }}>
                      {getInitials(client.nome)}
                    </div>
                    <div className="client-info">
                      <h3 className="client-name">{client.nome}</h3>
                      <p className="client-contact">
                        📞 {formatPhone(client.telefone)} 
                        {client.email && <span> | 📧 {client.email}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="client-footer">
                    <span 
                      className="client-status-tag"
                      style={{ backgroundColor: getStatusColor(client.status) }}
                    >
                      {getStatusLabel(client.status)}
                    </span>
                    {/* BOTÕES DE AÇÃO ATUALIZADOS com loading */}
                    <div className="client-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditClient(client)}
                        title="Editar cliente"
                        disabled={deletingClient === client.id}
                      >
                        {deletingClient === client.id ? '⏳' : '✏️'}
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteClient(client)}
                        title="Excluir cliente"
                        disabled={deletingClient === client.id}
                      >
                        {deletingClient === client.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Nenhum cliente encontrado com os filtros aplicados.</p>
          )}
        </div>
      )}

      {/* Modal/Formulário de Cliente (ShowForm) */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            
            {/* Campo Nome com Contador de Caracteres (Passos 1 e 3) */}
            <div className="form-group">
              <div className="input-with-counter">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={newClient.nome}
                  onChange={(e) => setNewClient({...newClient, nome: e.target.value})}
                  className={formErrors.nome ? 'input-error' : ''}
                  maxLength={100}
                />
                <div className={`char-counter ${
                  newClient.nome.length >= 90 ? 'warning' : 
                  newClient.nome.length >= 100 ? 'error' : ''
                }`}>
                  {newClient.nome.length}/100
                </div>
              </div>
              {formErrors.nome && <span className="error-message">{formErrors.nome}</span>}
            </div>
            
            <div className="form-group">
              <label>Telefone</label>
              <input
                type="tel"
                placeholder="(99) 99999-9999"
                value={newClient.telefone}
                onChange={handlePhoneChange}
                className={formErrors.telefone ? 'input-error' : ''}
              />
              {formErrors.telefone && <span className="error-message">{formErrors.telefone}</span>}
            </div>
            <div className="form-group">
              <label>Email (opcional)</label>
              <input
                type="email"
                placeholder="nome@email.com"
                value={newClient.email}
                onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                className={formErrors.email ? 'input-error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({...newClient, status: e.target.value})}
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* AÇÕES DO FORMULÁRIO ATUALIZADAS com loading */}
            <div className="form-actions">
              <button 
                onClick={saveClient} 
                className="btn-primary"
                disabled={savingClient}
              >
                {savingClient ? 'Salvando...' : 
                 editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}
              </button>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setFormErrors({});
                  setEditingClient(null);
                }} 
                className="btn-cancel"
                disabled={savingClient}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ... (código para Modals de Compromissos e Imóveis) ... */}
    </div>
  );
}

export default App;
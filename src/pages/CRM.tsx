import React, { useState, useEffect } from 'react';
import { useAuth, ProtectedRoute } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/crm/Sidebar';
import { Dashboard } from '@/components/crm/Dashboard';
import { CustomerList } from '@/components/crm/CustomerList';
import { CustomerEditor } from '@/components/crm/CustomerEditor';
import { ArticleList } from '@/components/crm/ArticleList';
import { ArticleEditor } from '@/components/crm/ArticleEditor';
import { InvoiceList } from '@/components/crm/InvoiceList';
import { InvoiceEditor } from '@/components/crm/InvoiceEditor';
import { OfferList } from '@/components/crm/OfferList';
import { OfferEditor } from '@/components/crm/OfferEditor';
import { RentalList } from '@/components/crm/RentalList';
import { RentalEditor } from '@/components/crm/RentalEditor';
import { ToDoBoard } from '@/components/crm/ToDoBoard';
import type { 
  Customer, 
  Invoice, 
  Offer, 
  RentalContract, 
  Article, 
  ToDo,
  ViewState,
  ToDoStatus
} from '@/types';
import {
  fetchCustomers,
  fetchArticles,
  fetchInvoices,
  fetchOffers,
  fetchRentals,
  fetchTodos,
  saveCustomer,
  saveArticle,
  saveInvoice,
  saveOffer,
  saveRental,
  saveTodo,
  deleteCustomer,
  deleteArticle,
  deleteInvoice,
  deleteOffer,
  deleteRental,
  deleteTodo,
} from '@/services/dataService';

const CRMContent: React.FC = () => {
  const { logout, user } = useAuth();
  
  // View state
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editingRental, setEditingRental] = useState<RentalContract | null>(null);

  // Data state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [rentals, setRentals] = useState<RentalContract[]>([]);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load all data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          customersData,
          articlesData,
          invoicesData,
          offersData,
          rentalsData,
          todosData,
        ] = await Promise.all([
          fetchCustomers(),
          fetchArticles(),
          fetchInvoices(),
          fetchOffers(),
          fetchRentals(),
          fetchTodos(),
        ]);
        
        setCustomers(customersData);
        setArticles(articlesData);
        setInvoices(invoicesData);
        setOffers(offersData);
        setRentals(rentalsData);
        setTodos(todosData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Navigation handler
  const handleChangeView = (view: ViewState) => {
    setCurrentView(view);
    setEditingCustomer(null);
    setEditingArticle(null);
    setEditingInvoice(null);
    setEditingOffer(null);
    setEditingRental(null);
  };

  // AI Generation placeholder
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    // TODO: Implement AI generation
    setTimeout(() => setIsGenerating(false), 1000);
  };

  // Customer handlers
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setCurrentView('customer-editor');
  };

  const handleSaveCustomer = (customer: Customer) => {
    saveCustomer(customer).then(success => {
      if (success) {
        setCustomers(prev => {
          const exists = prev.find(c => c.id === customer.id);
          if (exists) {
            return prev.map(c => c.id === customer.id ? customer : c);
          }
          return [customer, ...prev];
        });
        setCurrentView('customers');
        setEditingCustomer(null);
      }
    });
  };

  const handleDeleteCustomer = (id: string) => {
    deleteCustomer(id).then(success => {
      if (success) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        if (currentView === 'customer-editor') {
          setCurrentView('customers');
        }
      }
    });
  };

  // Article handlers
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setCurrentView('article-editor');
  };

  const handleSaveArticle = (article: Article) => {
    saveArticle(article).then(success => {
      if (success) {
        setArticles(prev => {
          const exists = prev.find(a => a.id === article.id);
          if (exists) {
            return prev.map(a => a.id === article.id ? article : a);
          }
          return [article, ...prev];
        });
        setCurrentView('articles');
        setEditingArticle(null);
      }
    });
  };

  const handleDeleteArticle = (id: string) => {
    deleteArticle(id).then(success => {
      if (success) {
        setArticles(prev => prev.filter(a => a.id !== id));
        if (currentView === 'article-editor') {
          setCurrentView('articles');
        }
      }
    });
  };

  // Invoice handlers
  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('invoice-editor');
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    saveInvoice(invoice).then(success => {
      if (success) {
        setInvoices(prev => {
          const exists = prev.find(i => i.id === invoice.id);
          if (exists) {
            return prev.map(i => i.id === invoice.id ? invoice : i);
          }
          return [invoice, ...prev];
        });
        setCurrentView('invoices');
        setEditingInvoice(null);
      }
    });
  };

  const handleDeleteInvoice = (id: string) => {
    deleteInvoice(id).then(success => {
      if (success) {
        setInvoices(prev => prev.filter(i => i.id !== id));
        if (currentView === 'invoice-editor') {
          setCurrentView('invoices');
        }
      }
    });
  };

  const handleDuplicateInvoice = async (invoice: Invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      invoiceNumber: `RE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Entwurf',
    };
    
    const success = await saveInvoice(newInvoice);
    if (success) {
      setInvoices(prev => [newInvoice, ...prev]);
    }
  };

  // Offer handlers
  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setCurrentView('offer-editor');
  };

  const handleSaveOffer = (offer: Offer) => {
    saveOffer(offer).then(success => {
      if (success) {
        setOffers(prev => {
          const exists = prev.find(o => o.id === offer.id);
          if (exists) {
            return prev.map(o => o.id === offer.id ? offer : o);
          }
          return [offer, ...prev];
        });
        setCurrentView('offers');
        setEditingOffer(null);
      }
    });
  };

  const handleDeleteOffer = (id: string) => {
    deleteOffer(id).then(success => {
      if (success) {
        setOffers(prev => prev.filter(o => o.id !== id));
        if (currentView === 'offer-editor') {
          setCurrentView('offers');
        }
      }
    });
  };

  const handleDuplicateOffer = async (offer: Offer) => {
    const newOffer: Offer = {
      ...offer,
      id: crypto.randomUUID(),
      offerNumber: `AN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Entwurf',
    };
    
    const success = await saveOffer(newOffer);
    if (success) {
      setOffers(prev => [newOffer, ...prev]);
    }
  };

  // Rental handlers
  const handleEditRental = (rental: RentalContract) => {
    setEditingRental(rental);
    setCurrentView('rental-editor');
  };

  const handleSaveRental = (rental: RentalContract) => {
    saveRental(rental).then(success => {
      if (success) {
        setRentals(prev => {
          const exists = prev.find(r => r.id === rental.id);
          if (exists) {
            return prev.map(r => r.id === rental.id ? rental : r);
          }
          return [rental, ...prev];
        });
        setCurrentView('rentals');
        setEditingRental(null);
      }
    });
  };

  const handleDeleteRental = (id: string) => {
    deleteRental(id).then(success => {
      if (success) {
        setRentals(prev => prev.filter(r => r.id !== id));
        if (currentView === 'rental-editor') {
          setCurrentView('rentals');
        }
      }
    });
  };

  const handleUpdatePaymentStatus = (rentalId: string, monthKey: string, status: 'Paid' | 'Open') => {
    const rental = rentals.find(r => r.id === rentalId);
    if (rental) {
      const updatedRental: RentalContract = {
        ...rental,
        payments: {
          ...rental.payments,
          [monthKey]: status,
        },
      };
      saveRental(updatedRental).then(success => {
        if (success) {
          setRentals(prev => prev.map(r => r.id === rentalId ? updatedRental : r));
        }
      });
    }
  };

  // Todo handlers
  const handleAddToDo = (status: ToDoStatus) => {
    const newTodo: ToDo = {
      id: crypto.randomUUID(),
      title: 'Neue Aufgabe',
      description: '',
      status,
      priority: 'medium',
    };
    saveTodo(newTodo).then(success => {
      if (success) {
        setTodos(prev => [newTodo, ...prev]);
      }
    });
  };

  const handleUpdateToDo = (id: string, updates: Partial<ToDo>) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, ...updates };
      saveTodo(updatedTodo).then(success => {
        if (success) {
          setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
        }
      });
    }
  };

  const handleDeleteToDo = (id: string) => {
    deleteTodo(id).then(success => {
      if (success) {
        setTodos(prev => prev.filter(t => t.id !== id));
      }
    });
  };

  const handleMoveToDo = (id: string, newStatus: ToDoStatus) => {
    handleUpdateToDo(id, { status: newStatus });
  };

  // Render current view
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            customers={customers}
            invoices={invoices}
            offers={offers}
            rentals={rentals}
            onLogout={logout}
          />
        );

      case 'customers':
        return (
          <CustomerList
            customers={customers}
            onAddCustomer={() => {
              setEditingCustomer(null);
              setCurrentView('customer-editor');
            }}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );

      case 'customer-editor':
        return (
          <CustomerEditor
            customer={editingCustomer}
            invoices={invoices.filter(i => editingCustomer && i.customerId === editingCustomer.id)}
            offers={offers.filter(o => editingCustomer && o.customerId === editingCustomer.id)}
            rentals={rentals.filter(r => editingCustomer && r.customerId === editingCustomer.id)}
            onSave={handleSaveCustomer}
            onDelete={handleDeleteCustomer}
            onCancel={() => setCurrentView('customers')}
          />
        );

      case 'articles':
        return (
          <ArticleList
            articles={articles}
            onAddArticle={() => {
              setEditingArticle(null);
              setCurrentView('article-editor');
            }}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        );

      case 'article-editor':
        return (
          <ArticleEditor
            article={editingArticle}
            onSave={handleSaveArticle}
            onDelete={handleDeleteArticle}
            onCancel={() => setCurrentView('articles')}
          />
        );

      case 'invoices':
        return (
          <InvoiceList
            invoices={invoices}
            customers={customers}
            onAddInvoice={() => {
              setEditingInvoice(null);
              setCurrentView('invoice-editor');
            }}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onDuplicateInvoice={handleDuplicateInvoice}
          />
        );

      case 'invoice-editor':
        return (
          <InvoiceEditor
            key={editingInvoice?.id || 'new'}
            invoice={editingInvoice}
            customers={customers}
            articles={articles}
            onSave={handleSaveInvoice}
            onDelete={handleDeleteInvoice}
            onCancel={() => setCurrentView('invoices')}
          />
        );

      case 'offers':
        return (
          <OfferList
            offers={offers}
            customers={customers}
            onAddOffer={() => {
              setEditingOffer(null);
              setCurrentView('offer-editor');
            }}
            onEditOffer={handleEditOffer}
            onDeleteOffer={handleDeleteOffer}
            onDuplicateOffer={handleDuplicateOffer}
          />
        );

      case 'offer-editor':
        return (
          <OfferEditor
            key={editingOffer?.id || 'new'}
            offer={editingOffer}
            customers={customers}
            articles={articles}
            onSave={handleSaveOffer}
            onDelete={handleDeleteOffer}
            onCancel={() => setCurrentView('offers')}
          />
        );

      case 'rentals':
        return (
          <RentalList
            rentals={rentals}
            customers={customers}
            onAddRental={() => {
              setEditingRental(null);
              setCurrentView('rental-editor');
            }}
            onEditRental={handleEditRental}
            onDeleteRental={handleDeleteRental}
            onUpdatePaymentStatus={handleUpdatePaymentStatus}
          />
        );

      case 'rental-editor':
        return (
          <RentalEditor
            rental={editingRental}
            customers={customers}
            onSave={handleSaveRental}
            onDelete={handleDeleteRental}
            onCancel={() => setCurrentView('rentals')}
          />
        );

      case 'todos':
        return (
          <ToDoBoard
            todos={todos}
            onAddToDo={handleAddToDo}
            onUpdateToDo={handleUpdateToDo}
            onDeleteToDo={handleDeleteToDo}
            onMoveToDo={handleMoveToDo}
          />
        );

      default:
        return <Dashboard customers={customers} invoices={invoices} offers={offers} rentals={rentals} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar
        currentView={currentView}
        onChangeView={handleChangeView}
        userEmail={user?.email}
        onLogout={logout}
      />
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {renderContent()}
      </main>
    </div>
  );
};

const CRMPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <CRMContent />
    </ProtectedRoute>
  );
};

export default CRMPage;

import { supabase } from '@/lib/supabaseClient';
import type { Customer, Invoice, Offer, RentalContract, Article, ToDo, Project } from '@/types';

// Helper to get current user ID
const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// ==================== CUSTOMERS ====================
export const fetchCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    customerNumber: row.customer_number,
    name: row.name,
    email: row.email || '',
    phone: row.phone || '',
    company: row.company || '',
    address: row.address || '',
    notes: row.notes || '',
    status: row.status,
  }));
};

export const saveCustomer = async (customer: Customer): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('customers').upsert({
    id: customer.id,
    customer_number: customer.customerNumber,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    address: customer.address,
    notes: customer.notes,
    status: customer.status,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving customer:', error);
    return false;
  }
  return true;
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
  return true;
};

// ==================== ARTICLES ====================
export const fetchArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description || '',
    price: row.price || 0,
    unit: row.unit || 'Stück',
    isActive: row.is_active ?? true,
  }));
};

export const saveArticle = async (article: Article): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('articles').upsert({
    id: article.id,
    sku: article.sku,
    name: article.name,
    description: article.description,
    price: article.price,
    unit: article.unit,
    is_active: article.isActive,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving article:', error);
    return false;
  }
  return true;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting article:', error);
    return false;
  }
  return true;
};

// ==================== INVOICES ====================
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    invoiceNumber: row.invoice_number,
    customerId: row.customer_id,
    date: row.date,
    dueDate: row.due_date,
    status: row.status,
    positions: row.positions || [],
    notes: row.notes || '',
    totalNet: row.total_net || 0,
    taxRate: row.tax_rate || 19,
    totalGross: row.total_gross || 0,
  }));
};

export const saveInvoice = async (invoice: Invoice): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('invoices').upsert({
    id: invoice.id,
    invoice_number: invoice.invoiceNumber,
    customer_id: invoice.customerId || null,
    date: invoice.date,
    due_date: invoice.dueDate,
    status: invoice.status,
    positions: invoice.positions,
    notes: invoice.notes,
    total_net: invoice.totalNet,
    tax_rate: invoice.taxRate,
    total_gross: invoice.totalGross,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving invoice:', error);
    return false;
  }
  return true;
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
  return true;
};

// ==================== OFFERS ====================
export const fetchOffers = async (): Promise<Offer[]> => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching offers:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    offerNumber: row.offer_number,
    customerId: row.customer_id,
    customerNameSnapshot: row.customer_name_snapshot || '',
    customerEmailSnapshot: row.customer_email_snapshot || '',
    customerAddressSnapshot: row.customer_address_snapshot || '',
    project: row.project || '',
    yourReference: row.your_reference || '',
    inquiryDate: row.inquiry_date,
    processor: row.processor || '',
    processorPhone: row.processor_phone || '',
    date: row.date,
    validUntil: row.valid_until,
    status: row.status,
    positions: row.positions || [],
    notes: row.notes || '',
    totalNet: row.total_net || 0,
    taxRate: row.tax_rate || 19,
    totalGross: row.total_gross || 0,
  }));
};

export const saveOffer = async (offer: Offer): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('offers').upsert({
    id: offer.id,
    offer_number: offer.offerNumber,
    customer_id: offer.customerId || null,
    customer_name_snapshot: offer.customerNameSnapshot,
    customer_email_snapshot: offer.customerEmailSnapshot,
    customer_address_snapshot: offer.customerAddressSnapshot,
    project: offer.project,
    your_reference: offer.yourReference,
    inquiry_date: offer.inquiryDate,
    processor: offer.processor,
    processor_phone: offer.processorPhone,
    date: offer.date,
    valid_until: offer.validUntil,
    status: offer.status,
    positions: offer.positions,
    notes: offer.notes,
    total_net: offer.totalNet,
    tax_rate: offer.taxRate,
    total_gross: offer.totalGross,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving offer:', error);
    return false;
  }
  return true;
};

export const deleteOffer = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting offer:', error);
    return false;
  }
  return true;
};

// ==================== RENTALS ====================
export const fetchRentals = async (): Promise<RentalContract[]> => {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rentals:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    contractNumber: row.contract_number,
    customerId: row.customer_id,
    startDate: row.start_date,
    endDate: row.end_date,
    monthlyPrice: row.monthly_price || 0,
    description: row.description || '',
    payments: row.payments || {},
  }));
};

export const saveRental = async (rental: RentalContract): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('rentals').upsert({
    id: rental.id,
    contract_number: rental.contractNumber,
    customer_id: rental.customerId || null,
    start_date: rental.startDate,
    end_date: rental.endDate,
    monthly_price: rental.monthlyPrice,
    description: rental.description,
    payments: rental.payments,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving rental:', error);
    return false;
  }
  return true;
};

export const deleteRental = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('rentals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting rental:', error);
    return false;
  }
  return true;
};

// ==================== TODOS ====================
export const fetchTodos = async (): Promise<ToDo[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching todos:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
  }));
};

export const saveTodo = async (todo: ToDo): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('todos').upsert({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    status: todo.status,
    priority: todo.priority,
    due_date: todo.dueDate,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving todo:', error);
    return false;
  }
  return true;
};

export const deleteTodo = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting todo:', error);
    return false;
  }
  return true;
};

// ==================== PROJECTS ====================
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []).map(row => ({
    id: row.id,
    projectNumber: row.project_number,
    name: row.name,
    description: row.description || '',
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
    checklist: row.checklist || [],
  }));
};

export const saveProject = async (project: Project): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }

  const { error } = await supabase.from('projects').upsert({
    id: project.id,
    project_number: project.projectNumber,
    name: project.name,
    description: project.description,
    start_date: project.startDate,
    end_date: project.endDate,
    status: project.status,
    checklist: project.checklist,
    user_id: userId,
  });

  if (error) {
    console.error('Error saving project:', error);
    return false;
  }
  return true;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.error('No user logged in');
    return false;
  }
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
};

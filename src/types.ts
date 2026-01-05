export enum CustomerStatus {
  Active = 'Aktiv',
  Lead = 'Interessent',
  Inactive = 'Inaktiv',
  Churned = 'Ehemalig'
}

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  notes: string;
  status: CustomerStatus;
}

export interface Article {
  id: string;
  sku: string; // Artikelnummer
  name: string;
  description: string;
  price: number;
  unit: string; // Stück, Stunde, etc.
  isActive: boolean;
}

export type InvoiceStatus = 'Entwurf' | 'Offen' | 'Bezahlt' | 'Überfällig' | 'Storniert';
export type OfferStatus = 'Entwurf' | 'Versendet' | 'Angenommen' | 'Abgelehnt';
export type PaymentStatus = 'Paid' | 'Open';

export interface Position {
  id: string;
  articleId?: string; // Optional, falls manuell eingetragen
  description: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

// Alias for backwards compatibility if needed, though we use Position generally now
export type InvoicePosition = Position;

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  date: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  positions: Position[];
  notes: string;
  totalNet: number;
  taxRate: number; // z.B. 19
  totalGross: number;
}

export interface Offer {
  id: string;
  offerNumber: string;
  customerId: string;
  
  // Snapshot data (editable fields from screenshot)
  customerNameSnapshot: string;
  customerEmailSnapshot: string;
  customerAddressSnapshot: string;

  // Offer specific meta
  project: string;
  yourReference: string; // Ihr Zeichen
  inquiryDate: string; // Ihre Anfrage vom
  processor: string; // Bearbeiter
  processorPhone: string; // Telefon Bearbeiter
  
  date: string; // Angebotsdatum
  validUntil: string; // Gültig bis
  status: OfferStatus;
  positions: Position[];
  notes: string;
  totalNet: number;
  taxRate: number;
  totalGross: number;
}

export interface RentalContract {
  id: string;
  contractNumber: string;
  customerId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // null means unlimited/unbefristet
  monthlyPrice: number;
  description: string; // z.B. "Büromiete" oder "Wartungsvertrag"
  
  // Stores payment status per month key "YYYY-MM"
  // If a key exists and is true/Paid, it's paid. If missing or Open, it's not.
  payments: Record<string, PaymentStatus>;
}

export type ToDoStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type ToDoPriority = 'low' | 'medium' | 'high';

export interface ToDo {
  id: string;
  title: string;
  description: string;
  status: ToDoStatus;
  priority: ToDoPriority;
  dueDate?: string;
}

export type ViewState = 'dashboard' | 'customers' | 'customer-editor' | 'articles' | 'article-editor' | 'invoices' | 'invoice-editor' | 'offers' | 'offer-editor' | 'rentals' | 'rental-editor' | 'todos' | 'projects' | 'project-editor' | 'settings';

export type ProjectStatus = 'Geplant' | 'In Arbeit' | 'Abgeschlossen' | 'Pausiert' | 'Abgebrochen';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD or null
  status: ProjectStatus;
  checklist: ChecklistItem[];
}

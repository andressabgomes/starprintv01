import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, MapPin, Phone, User, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientFormData {
  code: string;
  company_name: string;
  trade_name: string;
  document_type: string;
  document_number: string;
  client_type: string;
  segment: string;
  size: string;
  status: string;
  website: string;
  notes: string;
  addresses: AddressFormData[];
  contacts: ContactFormData[];
  persons: PersonFormData[];
}

interface AddressFormData {
  address_type: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
}

interface ContactFormData {
  contact_type: string;
  contact_value: string;
  description: string;
  is_primary: boolean;
  is_whatsapp: boolean;
}

interface PersonFormData {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  is_primary: boolean;
  is_decision_maker: boolean;
}

interface AddClientModalProps {
  onClientAdded: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClientAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    code: '',
    company_name: '',
    trade_name: '',
    document_type: 'CNPJ',
    document_number: '',
    client_type: 'regular',
    segment: '',
    size: 'medium',
    status: 'active',
    website: '',
    notes: '',
    addresses: [],
    contacts: [],
    persons: []
  });

  const [newAddress, setNewAddress] = useState<AddressFormData>({
    address_type: 'main',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    is_primary: false
  });

  const [newContact, setNewContact] = useState<ContactFormData>({
    contact_type: 'phone',
    contact_value: '',
    description: '',
    is_primary: false,
    is_whatsapp: false
  });

  const [newPerson, setNewPerson] = useState<PersonFormData>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    mobile: '',
    is_primary: false,
    is_decision_maker: false
  });

  const generateClientCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `CLI${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{
          code: formData.code || generateClientCode(),
          company_name: formData.company_name,
          trade_name: formData.trade_name,
          document_type: formData.document_type,
          document_number: formData.document_number,
          client_type: formData.client_type,
          segment: formData.segment,
          size: formData.size,
          status: formData.status,
          website: formData.website,
          notes: formData.notes
        }])
        .select()
        .single();

      if (clientError) throw clientError;

      const clientId = clientData.id;

      // Insert addresses
      if (formData.addresses.length > 0) {
        const { error: addressError } = await supabase
          .from('client_addresses')
          .insert(formData.addresses.map(addr => ({ ...addr, client_id: clientId })));

        if (addressError) throw addressError;
      }

      // Insert contacts
      if (formData.contacts.length > 0) {
        const { error: contactError } = await supabase
          .from('client_contacts')
          .insert(formData.contacts.map(contact => ({ ...contact, client_id: clientId })));

        if (contactError) throw contactError;
      }

      // Insert persons
      if (formData.persons.length > 0) {
        const { error: personError } = await supabase
          .from('client_persons')
          .insert(formData.persons.map(person => ({ ...person, client_id: clientId })));

        if (personError) throw personError;
      }

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });

      setOpen(false);
      resetForm();
      onClientAdded();
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      company_name: '',
      trade_name: '',
      document_type: 'CNPJ',
      document_number: '',
      client_type: 'regular',
      segment: '',
      size: 'medium',
      status: 'active',
      website: '',
      notes: '',
      addresses: [],
      contacts: [],
      persons: []
    });
  };

  const addAddress = () => {
    if (newAddress.street && newAddress.city) {
      setFormData(prev => ({
        ...prev,
        addresses: [...prev.addresses, { ...newAddress }]
      }));
      setNewAddress({
        address_type: 'main',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        is_primary: false
      });
    }
  };

  const addContact = () => {
    if (newContact.contact_value) {
      setFormData(prev => ({
        ...prev,
        contacts: [...prev.contacts, { ...newContact }]
      }));
      setNewContact({
        contact_type: 'phone',
        contact_value: '',
        description: '',
        is_primary: false,
        is_whatsapp: false
      });
    }
  };

  const addPerson = () => {
    if (newPerson.name) {
      setFormData(prev => ({
        ...prev,
        persons: [...prev.persons, { ...newPerson }]
      }));
      setNewPerson({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        mobile: '',
        is_primary: false,
        is_decision_maker: false
      });
    }
  };

  const removeAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  const removePerson = (index: number) => {
    setFormData(prev => ({
      ...prev,
      persons: prev.persons.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          data-add-client
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto shadow-soft border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-title tracking-title">
            <Plus className="h-5 w-5" />
            Cadastrar Novo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Cliente</Label>
              <Input
                id="code"
                placeholder="Deixe vazio para gerar automaticamente"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_name">Razão Social *</Label>
              <Input
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trade_name">Nome Fantasia</Label>
              <Input
                id="trade_name"
                value={formData.trade_name}
                onChange={(e) => setFormData(prev => ({ ...prev, trade_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document_type">Tipo de Documento</Label>
              <Select value={formData.document_type} onValueChange={(value) => setFormData(prev => ({ ...prev, document_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="IE">IE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document_number">Número do Documento *</Label>
              <Input
                id="document_number"
                required
                value={formData.document_number}
                onChange={(e) => setFormData(prev => ({ ...prev, document_number: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_type">Tipo de Cliente</Label>
              <Select value={formData.client_type} onValueChange={(value) => setFormData(prev => ({ ...prev, client_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strategic">Estratégico</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input
                id="segment"
                value={formData.segment}
                onChange={(e) => setFormData(prev => ({ ...prev, segment: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Porte da Empresa</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro</SelectItem>
                  <SelectItem value="small">Pequena</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Endereços */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </h3>
            
            {formData.addresses.map((address, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{address.address_type === 'main' ? 'Principal' : address.address_type}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm">
                  {address.street}, {address.number}
                  {address.complement && `, ${address.complement}`}
                </p>
                <p className="text-sm">
                  {address.neighborhood} - {address.city}/{address.state}
                </p>
                <p className="text-sm">CEP: {address.zip_code}</p>
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Tipo de Endereço</Label>
                <Select value={newAddress.address_type} onValueChange={(value) => setNewAddress(prev => ({ ...prev, address_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Principal</SelectItem>
                    <SelectItem value="billing">Cobrança</SelectItem>
                    <SelectItem value="delivery">Entrega</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rua</Label>
                <Input
                  value={newAddress.street}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  value={newAddress.number}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, number: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input
                  value={newAddress.complement}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, complement: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Bairro</Label>
                <Input
                  value={newAddress.neighborhood}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input
                  value={newAddress.zip_code}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, zip_code: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_primary_address"
                  checked={newAddress.is_primary}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, is_primary: e.target.checked }))}
                  aria-label="Endereço Principal"
                />
                <Label htmlFor="is_primary_address">Endereço Principal</Label>
              </div>
              <div className="md:col-span-2">
                <Button type="button" onClick={addAddress} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contatos
            </h3>
            
            {formData.contacts.map((contact, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{contact.contact_type}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-mono">{contact.contact_value}</p>
                {contact.description && <p className="text-sm text-muted-foreground">{contact.description}</p>}
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Tipo de Contato</Label>
                <Select value={newContact.contact_type} onValueChange={(value) => setNewContact(prev => ({ ...prev, contact_type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Telefone</SelectItem>
                    <SelectItem value="mobile">Celular</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="fax">Fax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor do Contato</Label>
                <Input
                  value={newContact.contact_value}
                  onChange={(e) => setNewContact(prev => ({ ...prev, contact_value: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={newContact.description}
                  onChange={(e) => setNewContact(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
                             <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="is_primary_contact"
                     checked={newContact.is_primary}
                     onChange={(e) => setNewContact(prev => ({ ...prev, is_primary: e.target.checked }))}
                     aria-label="Contato Primário"
                   />
                   <Label htmlFor="is_primary_contact">Primário</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="is_whatsapp"
                     checked={newContact.is_whatsapp}
                     onChange={(e) => setNewContact(prev => ({ ...prev, is_whatsapp: e.target.checked }))}
                     aria-label="WhatsApp"
                   />
                   <Label htmlFor="is_whatsapp">WhatsApp</Label>
                 </div>
               </div>
              <div className="md:col-span-2">
                <Button type="button" onClick={addContact} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </div>
            </div>
          </div>

          {/* Pessoas de Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-5 w-5" />
              Pessoas de Contato
            </h3>
            
            {formData.persons.map((person, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{person.name}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {person.role && <p className="text-sm"><strong>Cargo:</strong> {person.role}</p>}
                {person.department && <p className="text-sm"><strong>Departamento:</strong> {person.department}</p>}
                {person.email && <p className="text-sm"><strong>Email:</strong> {person.email}</p>}
                {person.phone && <p className="text-sm"><strong>Telefone:</strong> {person.phone}</p>}
                {person.mobile && <p className="text-sm"><strong>Celular:</strong> {person.mobile}</p>}
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={newPerson.name}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={newPerson.role}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input
                  value={newPerson.department}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newPerson.email}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={newPerson.phone}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Celular</Label>
                <Input
                  value={newPerson.mobile}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, mobile: e.target.value }))}
                />
              </div>
                             <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="is_primary_person"
                     checked={newPerson.is_primary}
                     onChange={(e) => setNewPerson(prev => ({ ...prev, is_primary: e.target.checked }))}
                     aria-label="Contato Principal"
                   />
                   <Label htmlFor="is_primary_person">Contato Principal</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="is_decision_maker"
                     checked={newPerson.is_decision_maker}
                     onChange={(e) => setNewPerson(prev => ({ ...prev, is_decision_maker: e.target.checked }))}
                     aria-label="Tomador de Decisão"
                   />
                   <Label htmlFor="is_decision_maker">Tomador de Decisão</Label>
                 </div>
               </div>
              <div className="md:col-span-2">
                <Button type="button" onClick={addPerson} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pessoa
                </Button>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;

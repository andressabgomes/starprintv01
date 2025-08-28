import React, { useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  X, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Building2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import { 
  ClientFormData, 
  AddressFormData, 
  ContactFormData, 
  PersonFormData,
  ClientSchema,
  ClientAddressSchema,
  ClientContactSchema,
  ClientPersonSchema,
  ClientType,
  ClientStatus,
  ClientSize,
  RiskLevel
} from '@/types/clients';

interface AddClientModalProps {
  onClientAdded?: () => void;
  trigger?: React.ReactNode;
}

const defaultFormData: ClientFormData = {
  code: '',
  company_name: '',
  trade_name: '',
  document_type: 'CNPJ',
  document_number: '',
  client_type: ClientType.REGULAR,
  segment: '',
  size: ClientSize.MEDIUM,
  status: ClientStatus.ACTIVE,
  website: '',
  notes: '',
  addresses: [],
  contacts: [],
  persons: []
};

const defaultAddress: AddressFormData = {
  address_type: 'main',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zip_code: '',
  is_primary: false
};

const defaultContact: ContactFormData = {
  contact_type: 'phone',
  contact_value: '',
  description: '',
  is_primary: false,
  is_whatsapp: false
};

const defaultPerson: PersonFormData = {
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  mobile: '',
  is_primary: false,
  is_decision_maker: false
};

export const AddClientModal: React.FC<AddClientModalProps> = ({ 
  onClientAdded, 
  trigger 
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { createClient, isCreating } = useClients();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<ClientFormData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: defaultFormData,
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Gerar código automático
  const generateClientCode = useCallback(() => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    const code = `CLI${timestamp}${random}`;
    setValue('code', code);
  }, [setValue]);

  // Adicionar endereço
  const addAddress = useCallback(() => {
    const currentAddresses = watchedValues.addresses || [];
    const newAddress = { ...defaultAddress };
    
    setValue('addresses', [...currentAddresses, newAddress]);
  }, [setValue, watchedValues.addresses]);

  // Remover endereço
  const removeAddress = useCallback((index: number) => {
    const currentAddresses = watchedValues.addresses || [];
    setValue('addresses', currentAddresses.filter((_, i) => i !== index));
  }, [setValue, watchedValues.addresses]);

  // Adicionar contato
  const addContact = useCallback(() => {
    const currentContacts = watchedValues.contacts || [];
    const newContact = { ...defaultContact };
    
    setValue('contacts', [...currentContacts, newContact]);
  }, [setValue, watchedValues.contacts]);

  // Remover contato
  const removeContact = useCallback((index: number) => {
    const currentContacts = watchedValues.contacts || [];
    setValue('contacts', currentContacts.filter((_, i) => i !== index));
  }, [setValue, watchedValues.contacts]);

  // Adicionar pessoa
  const addPerson = useCallback(() => {
    const currentPersons = watchedValues.persons || [];
    const newPerson = { ...defaultPerson };
    
    setValue('persons', [...currentPersons, newPerson]);
  }, [setValue, watchedValues.persons]);

  // Remover pessoa
  const removePerson = useCallback((index: number) => {
    const currentPersons = watchedValues.persons || [];
    setValue('persons', currentPersons.filter((_, i) => i !== index));
  }, [setValue, watchedValues.persons]);

  // Atualizar endereço
  const updateAddress = useCallback((index: number, field: keyof AddressFormData, value: any) => {
    const currentAddresses = watchedValues.addresses || [];
    const updatedAddresses = [...currentAddresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setValue('addresses', updatedAddresses);
  }, [setValue, watchedValues.addresses]);

  // Atualizar contato
  const updateContact = useCallback((index: number, field: keyof ContactFormData, value: any) => {
    const currentContacts = watchedValues.contacts || [];
    const updatedContacts = [...currentContacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setValue('contacts', updatedContacts);
  }, [setValue, watchedValues.contacts]);

  // Atualizar pessoa
  const updatePerson = useCallback((index: number, field: keyof PersonFormData, value: any) => {
    const currentPersons = watchedValues.persons || [];
    const updatedPersons = [...currentPersons];
    updatedPersons[index] = { ...updatedPersons[index], [field]: value };
    setValue('persons', updatedPersons);
  }, [setValue, watchedValues.persons]);

  // Validar endereço
  const validateAddress = useCallback((address: AddressFormData) => {
    try {
      ClientAddressSchema.parse(address);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      return { isValid: false, errors: error.errors };
    }
  }, []);

  // Validar contato
  const validateContact = useCallback((contact: ContactFormData) => {
    try {
      ClientContactSchema.parse(contact);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      return { isValid: false, errors: error.errors };
    }
  }, []);

  // Validar pessoa
  const validatePerson = useCallback((person: PersonFormData) => {
    try {
      ClientPersonSchema.parse(person);
      return { isValid: true, errors: [] };
    } catch (error: any) {
      return { isValid: false, errors: error.errors };
    }
  }, []);

  // Computed values
  const addresses = watchedValues.addresses || [];
  const contacts = watchedValues.contacts || [];
  const persons = watchedValues.persons || [];

  const hasValidAddresses = useMemo(() => {
    return addresses.every(addr => validateAddress(addr).isValid);
  }, [addresses, validateAddress]);

  const hasValidContacts = useMemo(() => {
    return contacts.every(contact => validateContact(contact).isValid);
  }, [contacts, validateContact]);

  const hasValidPersons = useMemo(() => {
    return persons.every(person => validatePerson(person).isValid);
  }, [persons, validatePerson]);

  const canSubmit = useMemo(() => {
    return isValid && hasValidAddresses && hasValidContacts && hasValidPersons;
  }, [isValid, hasValidAddresses, hasValidContacts, hasValidPersons]);

  // Submit handler
  const onSubmit = useCallback(async (data: ClientFormData) => {
    try {
      await createClient(data);
      setOpen(false);
      reset(defaultFormData);
      onClientAdded?.();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  }, [createClient, reset, onClientAdded]);

  // Reset form when modal closes
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset(defaultFormData);
      setActiveTab('basic');
    }
  }, [reset]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Cadastrar Novo Cliente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="addresses">Endereços</TabsTrigger>
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="persons">Pessoas</TabsTrigger>
            </TabsList>

            {/* Informações Básicas */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código do Cliente</Label>
                  <div className="flex gap-2">
                    <Controller
                      name="code"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Deixe vazio para gerar automaticamente"
                          className={errors.code ? 'border-destructive' : ''}
                        />
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateClientCode}
                      className="shrink-0"
                    >
                      Gerar
                    </Button>
                  </div>
                  {errors.code && (
                    <p className="text-sm text-destructive">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_type">Tipo de Documento</Label>
                  <Controller
                    name="document_type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                          <SelectItem value="CPF">CPF</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">Razão Social *</Label>
                  <Controller
                    name="company_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Nome da empresa"
                        className={errors.company_name ? 'border-destructive' : ''}
                      />
                    )}
                  />
                  {errors.company_name && (
                    <p className="text-sm text-destructive">{errors.company_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_number">Número do Documento *</Label>
                  <Controller
                    name="document_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="00.000.000/0000-00"
                        className={errors.document_number ? 'border-destructive' : ''}
                      />
                    )}
                  />
                  {errors.document_number && (
                    <p className="text-sm text-destructive">{errors.document_number.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trade_name">Nome Fantasia</Label>
                  <Controller
                    name="trade_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Nome fantasia (opcional)"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_type">Tipo de Cliente</Label>
                  <Controller
                    name="client_type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ClientType.STRATEGIC}>Estratégico</SelectItem>
                          <SelectItem value={ClientType.REGULAR}>Regular</SelectItem>
                          <SelectItem value={ClientType.PROSPECT}>Prospect</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment">Segmento</Label>
                  <Controller
                    name="segment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Ex: Industrial, Comércio, Serviços"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Porte</Label>
                  <Controller
                    name="size"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ClientSize.MICRO}>Micro</SelectItem>
                          <SelectItem value={ClientSize.SMALL}>Pequeno</SelectItem>
                          <SelectItem value={ClientSize.MEDIUM}>Médio</SelectItem>
                          <SelectItem value={ClientSize.LARGE}>Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ClientStatus.ACTIVE}>Ativo</SelectItem>
                          <SelectItem value={ClientStatus.INACTIVE}>Inativo</SelectItem>
                          <SelectItem value={ClientStatus.SUSPENDED}>Suspenso</SelectItem>
                          <SelectItem value={ClientStatus.PROSPECT}>Prospect</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://exemplo.com"
                        type="url"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Informações adicionais sobre o cliente"
                      rows={3}
                    />
                  )}
                />
              </div>
            </TabsContent>

            {/* Endereços */}
            <TabsContent value="addresses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Endereços</h3>
                <Button type="button" onClick={addAddress} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>

              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum endereço adicionado</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            Endereço {index + 1}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {validateAddress(address).isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAddress(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tipo de Endereço</Label>
                            <Select
                              value={address.address_type}
                              onValueChange={(value) => updateAddress(index, 'address_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="main">Principal</SelectItem>
                                <SelectItem value="billing">Cobrança</SelectItem>
                                <SelectItem value="delivery">Entrega</SelectItem>
                                <SelectItem value="other">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Rua *</Label>
                            <Input
                              value={address.street}
                              onChange={(e) => updateAddress(index, 'street', e.target.value)}
                              placeholder="Nome da rua"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Número *</Label>
                            <Input
                              value={address.number}
                              onChange={(e) => updateAddress(index, 'number', e.target.value)}
                              placeholder="123"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Complemento</Label>
                            <Input
                              value={address.complement}
                              onChange={(e) => updateAddress(index, 'complement', e.target.value)}
                              placeholder="Apto 101"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Bairro *</Label>
                            <Input
                              value={address.neighborhood}
                              onChange={(e) => updateAddress(index, 'neighborhood', e.target.value)}
                              placeholder="Nome do bairro"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Cidade *</Label>
                            <Input
                              value={address.city}
                              onChange={(e) => updateAddress(index, 'city', e.target.value)}
                              placeholder="Nome da cidade"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Estado *</Label>
                            <Input
                              value={address.state}
                              onChange={(e) => updateAddress(index, 'state', e.target.value)}
                              placeholder="CE"
                              maxLength={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>CEP *</Label>
                            <Input
                              value={address.zip_code}
                              onChange={(e) => updateAddress(index, 'zip_code', e.target.value)}
                              placeholder="60000-000"
                            />
                          </div>

                          <div className="flex items-center space-x-2 pt-6">
                            <input
                              type="checkbox"
                              id={`primary-address-${index}`}
                              checked={address.is_primary}
                              onChange={(e) => updateAddress(index, 'is_primary', e.target.checked)}
                            />
                            <Label htmlFor={`primary-address-${index}`}>Endereço Principal</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Contatos */}
            <TabsContent value="contacts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contatos</h3>
                <Button type="button" onClick={addContact} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </div>

              {contacts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum contato adicionado</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            Contato {index + 1}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {validateContact(contact).isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeContact(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tipo de Contato</Label>
                            <Select
                              value={contact.contact_type}
                              onValueChange={(value) => updateContact(index, 'contact_type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="phone">Telefone</SelectItem>
                                <SelectItem value="mobile">Celular</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Valor *</Label>
                            <Input
                              value={contact.contact_value}
                              onChange={(e) => updateContact(index, 'contact_value', e.target.value)}
                              placeholder={
                                contact.contact_type === 'email' ? 'email@exemplo.com' :
                                contact.contact_type === 'whatsapp' ? '(85) 99999-9999' :
                                '(85) 3333-3333'
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Descrição</Label>
                            <Input
                              value={contact.description}
                              onChange={(e) => updateContact(index, 'description', e.target.value)}
                              placeholder="Ex: Contato principal, WhatsApp comercial"
                            />
                          </div>

                          <div className="flex items-center space-x-4 pt-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`primary-contact-${index}`}
                                checked={contact.is_primary}
                                onChange={(e) => updateContact(index, 'is_primary', e.target.checked)}
                              />
                              <Label htmlFor={`primary-contact-${index}`}>Contato Principal</Label>
                            </div>
                            {contact.contact_type === 'mobile' && (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`whatsapp-${index}`}
                                  checked={contact.is_whatsapp}
                                  onChange={(e) => updateContact(index, 'is_whatsapp', e.target.checked)}
                                />
                                <Label htmlFor={`whatsapp-${index}`}>WhatsApp</Label>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pessoas */}
            <TabsContent value="persons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Pessoas de Contato</h3>
                <Button type="button" onClick={addPerson} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Pessoa
                </Button>
              </div>

              {persons.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma pessoa adicionada</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {persons.map((person, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            Pessoa {index + 1}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {validatePerson(person).isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePerson(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                              value={person.name}
                              onChange={(e) => updatePerson(index, 'name', e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Cargo</Label>
                            <Input
                              value={person.role}
                              onChange={(e) => updatePerson(index, 'role', e.target.value)}
                              placeholder="Ex: Gerente de TI"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Departamento</Label>
                            <Input
                              value={person.department}
                              onChange={(e) => updatePerson(index, 'department', e.target.value)}
                              placeholder="Ex: Tecnologia da Informação"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              value={person.email}
                              onChange={(e) => updatePerson(index, 'email', e.target.value)}
                              placeholder="email@exemplo.com"
                              type="email"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Telefone</Label>
                            <Input
                              value={person.phone}
                              onChange={(e) => updatePerson(index, 'phone', e.target.value)}
                              placeholder="(85) 3333-3333"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Celular</Label>
                            <Input
                              value={person.mobile}
                              onChange={(e) => updatePerson(index, 'mobile', e.target.value)}
                              placeholder="(85) 99999-9999"
                            />
                          </div>

                          <div className="flex items-center space-x-4 pt-6">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`primary-person-${index}`}
                                checked={person.is_primary}
                                onChange={(e) => updatePerson(index, 'is_primary', e.target.checked)}
                              />
                              <Label htmlFor={`primary-person-${index}`}>Contato Principal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`decision-maker-${index}`}
                                checked={person.is_decision_maker}
                                onChange={(e) => updatePerson(index, 'is_decision_maker', e.target.checked)}
                              />
                              <Label htmlFor={`decision-maker-${index}`}>Tomador de Decisão</Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Botões de Ação */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!canSubmit && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Complete todos os campos obrigatórios
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || isCreating}
                className="min-w-[120px]"
              >
                {isCreating ? 'Cadastrando...' : 'Cadastrar Cliente'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

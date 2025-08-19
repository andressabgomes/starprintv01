import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, X, MapPin, Phone, User, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  code: string;
  company_name: string;
  trade_name: string;
  document_type: string;
  document_number: string;
  client_type: string;
  segment: string;
  size: string;
  status: string;
  website?: string;
  notes?: string;
  created_at: string;
  addresses?: ClientAddress[];
  contacts?: ClientContact[];
  persons?: ClientPerson[];
}

interface ClientAddress {
  id: string;
  address_type: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
}

interface ClientContact {
  id: string;
  contact_type: string;
  contact_value: string;
  description?: string;
  is_primary: boolean;
  is_whatsapp: boolean;
}

interface ClientPerson {
  id: string;
  name: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  is_decision_maker: boolean;
}

interface EditClientModalProps {
  client: Client;
  onClientUpdated: () => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onClientUpdated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Client>(client);

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update client
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          code: formData.code,
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
        })
        .eq('id', client.id);

      if (clientError) throw clientError;

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });

      setOpen(false);
      onClientUpdated();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Edit className="h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Cliente - {client.company_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código do Cliente</Label>
              <Input
                id="code"
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
                value={formData.trade_name || ''}
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
                value={formData.segment || ''}
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
                value={formData.website || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Endereços */}
          {formData.addresses && formData.addresses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereços
              </h3>
              
              {formData.addresses.map((address, index) => (
                <div key={address.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {address.address_type === 'main' ? 'Principal' : 
                       address.address_type === 'billing' ? 'Cobrança' : 
                       address.address_type === 'delivery' ? 'Entrega' : 'Outro'}
                    </Badge>
                    {address.is_primary && (
                      <Badge className="text-xs bg-green-100 text-green-800">
                        Primário
                      </Badge>
                    )}
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
            </div>
          )}

          {/* Contatos */}
          {formData.contacts && formData.contacts.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contatos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData.contacts.map((contact) => (
                  <div key={contact.id} className="p-3 bg-muted rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {contact.contact_type === 'phone' ? 'Telefone' : 
                         contact.contact_type === 'mobile' ? 'Celular' : 
                         contact.contact_type === 'email' ? 'Email' : 
                         contact.contact_type === 'whatsapp' ? 'WhatsApp' : 'Fax'}
                      </Badge>
                      {contact.is_primary && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Primário
                        </Badge>
                      )}
                      {contact.is_whatsapp && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          WhatsApp
                        </Badge>
                      )}
                    </div>
                    <p className="font-mono">{contact.contact_value}</p>
                    {contact.description && (
                      <p className="text-muted-foreground">{contact.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pessoas de Contato */}
          {formData.persons && formData.persons.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Pessoas de Contato
              </h3>
              
              <div className="space-y-2">
                {formData.persons.map((person) => (
                  <div key={person.id} className="p-3 bg-muted rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{person.name}</h4>
                      {person.is_primary && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Contato Principal
                        </Badge>
                      )}
                      {person.is_decision_maker && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          Tomador de Decisão
                        </Badge>
                      )}
                    </div>
                    {person.role && <p><strong>Cargo:</strong> {person.role}</p>}
                    {person.department && <p><strong>Departamento:</strong> {person.department}</p>}
                    {person.email && <p><strong>Email:</strong> {person.email}</p>}
                    {person.phone && <p><strong>Telefone:</strong> {person.phone}</p>}
                    {person.mobile && <p><strong>Celular:</strong> {person.mobile}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              {loading ? 'Atualizando...' : 'Atualizar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;

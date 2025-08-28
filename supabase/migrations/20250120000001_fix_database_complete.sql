-- Migração completa para garantir que o banco de dados esteja totalmente funcional
-- Esta migração corrige todos os problemas e garante que os cadastros funcionem perfeitamente

-- 1. Primeiro, vamos garantir que a função update_updated_at_column existe e está correta
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Garantir que todas as tabelas existem com a estrutura correta
-- Tabela de clientes principais
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trade_name TEXT,
  document_type VARCHAR(20) NOT NULL CHECK (document_type IN ('CNPJ', 'CPF')),
  document_number VARCHAR(20) NOT NULL UNIQUE,
  state_registration VARCHAR(50),
  municipal_registration VARCHAR(50),
  client_type VARCHAR(20) NOT NULL DEFAULT 'regular' CHECK (client_type IN ('strategic', 'regular', 'prospect')),
  segment VARCHAR(100),
  size VARCHAR(20) CHECK (size IN ('micro', 'small', 'medium', 'large')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'prospect')),
  website TEXT,
  notes TEXT,
  -- Campos de métricas adicionais
  last_contact TIMESTAMP WITH TIME ZONE,
  revenue_potential DECIMAL(15,2),
  satisfaction_score INTEGER CHECK (satisfaction_score >= 0 AND satisfaction_score <= 10),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
  next_action TEXT,
  priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de endereços dos clientes
CREATE TABLE IF NOT EXISTS public.client_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  address_type VARCHAR(20) NOT NULL DEFAULT 'main' CHECK (address_type IN ('main', 'billing', 'delivery', 'other')),
  street TEXT NOT NULL,
  number VARCHAR(20),
  complement TEXT,
  neighborhood TEXT,
  city TEXT NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) NOT NULL DEFAULT 'Brasil',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de contatos dos clientes
CREATE TABLE IF NOT EXISTS public.client_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('phone', 'mobile', 'email', 'whatsapp')),
  contact_value TEXT NOT NULL,
  description TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_whatsapp BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de pessoas de contato
CREATE TABLE IF NOT EXISTS public.client_persons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_decision_maker BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tickets (se não existir)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  type VARCHAR(20) NOT NULL DEFAULT 'support' CHECK (type IN ('support', 'bug', 'feature', 'question')),
  client_id UUID,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de clientes estratégicos (se não existir)
CREATE TABLE IF NOT EXISTS public.strategic_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  responsible_team_member TEXT,
  client_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Adicionar colunas que podem estar faltando
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS last_contact TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS revenue_potential DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS satisfaction_score INTEGER CHECK (satisfaction_score >= 0 AND satisfaction_score <= 10),
ADD COLUMN IF NOT EXISTS risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS next_action TEXT,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low'));

-- 4. Corrigir foreign keys - remover constraints problemáticas primeiro
ALTER TABLE public.client_addresses DROP CONSTRAINT IF EXISTS client_addresses_client_id_fkey;
ALTER TABLE public.client_contacts DROP CONSTRAINT IF EXISTS client_contacts_client_id_fkey;
ALTER TABLE public.client_persons DROP CONSTRAINT IF EXISTS client_persons_client_id_fkey;
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_client_id_fkey;
ALTER TABLE public.strategic_clients DROP CONSTRAINT IF EXISTS strategic_clients_client_id_fkey;

-- 5. Adicionar foreign keys corretas
ALTER TABLE public.client_addresses 
ADD CONSTRAINT client_addresses_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.client_contacts 
ADD CONSTRAINT client_contacts_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.client_persons 
ADD CONSTRAINT client_persons_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.tickets 
ADD CONSTRAINT tickets_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.strategic_clients 
ADD CONSTRAINT strategic_clients_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;

-- 6. Habilitar RLS em todas as tabelas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategic_clients ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas de segurança (permitindo todas as operações para desenvolvimento)
DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;
DROP POLICY IF EXISTS "Allow all operations on client_addresses" ON public.client_addresses;
DROP POLICY IF EXISTS "Allow all operations on client_contacts" ON public.client_contacts;
DROP POLICY IF EXISTS "Allow all operations on client_persons" ON public.client_persons;
DROP POLICY IF EXISTS "Allow all operations on tickets" ON public.tickets;
DROP POLICY IF EXISTS "Allow all operations on strategic_clients" ON public.strategic_clients;

CREATE POLICY "Allow all operations on clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_addresses" ON public.client_addresses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_contacts" ON public.client_contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on client_persons" ON public.client_persons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on strategic_clients" ON public.strategic_clients FOR ALL USING (true) WITH CHECK (true);

-- 8. Criar triggers para atualização automática de timestamps
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
DROP TRIGGER IF EXISTS update_client_addresses_updated_at ON public.client_addresses;
DROP TRIGGER IF EXISTS update_client_contacts_updated_at ON public.client_contacts;
DROP TRIGGER IF EXISTS update_client_persons_updated_at ON public.client_persons;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON public.tickets;
DROP TRIGGER IF EXISTS update_strategic_clients_updated_at ON public.strategic_clients;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_addresses_updated_at
  BEFORE UPDATE ON public.client_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_contacts_updated_at
  BEFORE UPDATE ON public.client_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_persons_updated_at
  BEFORE UPDATE ON public.client_persons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_strategic_clients_updated_at
  BEFORE UPDATE ON public.strategic_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clients_document_number ON public.clients(document_number);
CREATE INDEX IF NOT EXISTS idx_clients_code ON public.clients(code);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_client_type ON public.clients(client_type);
CREATE INDEX IF NOT EXISTS idx_client_addresses_client_id ON public.client_addresses(client_id);
CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON public.client_contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_client_persons_client_id ON public.client_persons(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_strategic_clients_client_id ON public.strategic_clients(client_id);

-- 10. Inserir dados de exemplo se não existirem
INSERT INTO public.clients (code, company_name, trade_name, document_type, document_number, client_type, segment, size, status, revenue_potential, satisfaction_score, priority) VALUES
('CLI001', 'TechCorp Soluções Ltda', 'TechCorp', 'CNPJ', '12.345.678/0001-90', 'strategic', 'Tecnologia', 'medium', 'active', 50000.00, 9, 'high'),
('CLI002', 'Inovação Digital Ltda', 'Inovação Digital', 'CNPJ', '98.765.432/0001-10', 'strategic', 'Marketing Digital', 'small', 'active', 30000.00, 8, 'medium'),
('CLI003', 'Empresa Global Tech SA', 'Global Tech', 'CNPJ', '11.222.333/0001-44', 'strategic', 'Consultoria', 'large', 'active', 100000.00, 10, 'high'),
('CLI004', 'Comercial Santos & Cia', 'Santos Comercial', 'CNPJ', '55.666.777/0001-88', 'regular', 'Comércio', 'small', 'active', 15000.00, 7, 'low'),
('CLI005', 'Indústria Moderna Ltda', 'Moderna', 'CNPJ', '77.888.999/0001-22', 'regular', 'Industrial', 'medium', 'active', 75000.00, 8, 'medium')
ON CONFLICT (code) DO NOTHING;

-- 11. Inserir endereços de exemplo
INSERT INTO public.client_addresses (client_id, address_type, street, number, neighborhood, city, state, zip_code, is_primary)
SELECT 
  c.id,
  'main',
  'Rua das Empresas',
  '123',
  'Centro',
  'São Paulo',
  'SP',
  '01234-567',
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- 12. Inserir contatos de exemplo
INSERT INTO public.client_contacts (client_id, contact_type, contact_value, is_primary)
SELECT 
  c.id,
  'email',
  'contato@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- 13. Inserir pessoas de contato de exemplo
INSERT INTO public.client_persons (client_id, name, role, email, is_primary, is_decision_maker)
SELECT 
  c.id,
  'João Silva',
  'Gerente de TI',
  'joao@' || lower(replace(c.trade_name, ' ', '')) || '.com.br',
  true,
  true
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002', 'CLI003')
ON CONFLICT DO NOTHING;

-- 14. Inserir tickets de exemplo
INSERT INTO public.tickets (title, description, status, priority, type, client_id, assigned_to)
SELECT 
  'Suporte Técnico - ' || c.trade_name,
  'Solicitação de suporte técnico para ' || c.trade_name,
  'open',
  'medium',
  'support',
  c.id,
  'Ana Silva'
FROM public.clients c
WHERE c.code IN ('CLI001', 'CLI002')
ON CONFLICT DO NOTHING;

-- 15. Atualizar strategic_clients
INSERT INTO public.strategic_clients (code, name, responsible_team_member, client_id)
SELECT 
  c.code,
  c.company_name,
  'Equipe StarPrint',
  c.id
FROM public.clients c
WHERE c.client_type = 'strategic'
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  client_id = EXCLUDED.client_id;

-- 16. Verificar e corrigir dados inconsistentes
UPDATE public.tickets 
SET client_id = NULL 
WHERE client_id IS NOT NULL 
AND client_id NOT IN (SELECT id FROM public.clients);

UPDATE public.client_addresses 
SET client_id = NULL 
WHERE client_id IS NOT NULL 
AND client_id NOT IN (SELECT id FROM public.clients);

UPDATE public.client_contacts 
SET client_id = NULL 
WHERE client_id IS NOT NULL 
AND client_id NOT IN (SELECT id FROM public.clients);

UPDATE public.client_persons 
SET client_id = NULL 
WHERE client_id IS NOT NULL 
AND client_id NOT IN (SELECT id FROM public.clients);

-- 17. Garantir que não há dados órfãos
DELETE FROM public.client_addresses WHERE client_id IS NULL;
DELETE FROM public.client_contacts WHERE client_id IS NULL;
DELETE FROM public.client_persons WHERE client_id IS NULL;

-- 18. Criar view para facilitar consultas
CREATE OR REPLACE VIEW public.clients_complete AS
SELECT 
  c.*,
  COUNT(DISTINCT ca.id) as address_count,
  COUNT(DISTINCT cc.id) as contact_count,
  COUNT(DISTINCT cp.id) as person_count,
  COUNT(DISTINCT t.id) as ticket_count
FROM public.clients c
LEFT JOIN public.client_addresses ca ON c.id = ca.client_id
LEFT JOIN public.client_contacts cc ON c.id = cc.client_id
LEFT JOIN public.client_persons cp ON c.id = cp.client_id
LEFT JOIN public.tickets t ON c.id = t.client_id
GROUP BY c.id;

-- 19. Criar função para gerar código único de cliente
CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE
  new_code VARCHAR(50);
  counter INTEGER := 1;
BEGIN
  LOOP
    new_code := 'CLI' || LPAD(counter::TEXT, 6, '0');
    
    -- Verificar se o código já existe
    IF NOT EXISTS (SELECT 1 FROM public.clients WHERE code = new_code) THEN
      RETURN new_code;
    END IF;
    
    counter := counter + 1;
    
    -- Evitar loop infinito
    IF counter > 999999 THEN
      RAISE EXCEPTION 'Não foi possível gerar um código único para o cliente';
    END IF;
  END LOOP;
END;
$$;

-- 20. Comentários para documentação
COMMENT ON TABLE public.clients IS 'Tabela principal de clientes do sistema';
COMMENT ON TABLE public.client_addresses IS 'Endereços dos clientes';
COMMENT ON TABLE public.client_contacts IS 'Contatos dos clientes';
COMMENT ON TABLE public.client_persons IS 'Pessoas de contato dos clientes';
COMMENT ON TABLE public.tickets IS 'Tickets de atendimento';
COMMENT ON TABLE public.strategic_clients IS 'Clientes estratégicos com tratamento especial';

-- 21. Verificar se tudo está funcionando
DO $$
BEGIN
  -- Verificar se as tabelas existem
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    RAISE EXCEPTION 'Tabela clients não foi criada corretamente';
  END IF;
  
  -- Verificar se há pelo menos um cliente
  IF NOT EXISTS (SELECT 1 FROM public.clients LIMIT 1) THEN
    RAISE EXCEPTION 'Nenhum cliente encontrado na tabela';
  END IF;
  
  -- Verificar se as foreign keys estão funcionando
  IF EXISTS (
    SELECT 1 FROM public.client_addresses ca
    LEFT JOIN public.clients c ON ca.client_id = c.id
    WHERE c.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Existem endereços com client_id inválido';
  END IF;
  
  RAISE NOTICE 'Banco de dados verificado e funcionando corretamente!';
END $$;

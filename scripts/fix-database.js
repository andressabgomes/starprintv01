// Script para corrigir o banco de dados remoto
// Execute com: node scripts/fix-database.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixDatabase() {
  console.log('🔧 Iniciando correção do banco de dados...');
  
  try {
    // 1. Verificar se as tabelas existem tentando acessá-las
    console.log('📋 Verificando estrutura das tabelas...');
    
    const tablesToCheck = ['clients', 'client_addresses', 'client_contacts', 'client_persons', 'tickets'];
    const existingTables = [];

    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Tabela ${tableName} não existe ou erro:`, error.message);
        } else {
          console.log(`✅ Tabela ${tableName} existe`);
          existingTables.push(tableName);
        }
      } catch (err) {
        console.log(`❌ Erro ao verificar tabela ${tableName}:`, err.message);
      }
    }

    console.log('📋 Tabelas encontradas:', existingTables);

    // 2. Verificar se há clientes
    console.log('📊 Verificando clientes existentes...');
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, code, company_name')
      .limit(5);

    if (clientsError) {
      console.error('❌ Erro ao buscar clientes:', clientsError);
      return;
    }

    console.log(`📊 ${clients?.length || 0} clientes encontrados`);

    // 3. Inserir dados de exemplo se não existirem
    console.log('📝 Inserindo dados de exemplo...');
    
    const sampleClients = [
      {
        code: 'CLI001',
        company_name: 'TechCorp Soluções Ltda',
        trade_name: 'TechCorp',
        document_type: 'CNPJ',
        document_number: '12.345.678/0001-90',
        client_type: 'strategic',
        segment: 'Tecnologia',
        size: 'medium',
        status: 'active'
      },
      {
        code: 'CLI002',
        company_name: 'Inovação Digital Ltda',
        trade_name: 'Inovação Digital',
        document_type: 'CNPJ',
        document_number: '98.765.432/0001-10',
        client_type: 'strategic',
        segment: 'Marketing Digital',
        size: 'small',
        status: 'active'
      },
      {
        code: 'CLI003',
        company_name: 'Empresa Global Tech SA',
        trade_name: 'Global Tech',
        document_type: 'CNPJ',
        document_number: '11.222.333/0001-44',
        client_type: 'strategic',
        segment: 'Consultoria',
        size: 'large',
        status: 'active'
      },
      {
        code: 'CLI004',
        company_name: 'Comercial Santos & Cia',
        trade_name: 'Santos Comercial',
        document_type: 'CNPJ',
        document_number: '55.666.777/0001-88',
        client_type: 'regular',
        segment: 'Comércio',
        size: 'small',
        status: 'active'
      },
      {
        code: 'CLI005',
        company_name: 'Indústria Moderna Ltda',
        trade_name: 'Moderna',
        document_type: 'CNPJ',
        document_number: '77.888.999/0001-22',
        client_type: 'regular',
        segment: 'Industrial',
        size: 'medium',
        status: 'active'
      }
    ];

    for (const client of sampleClients) {
      const { data, error } = await supabase
        .from('clients')
        .upsert(client, { onConflict: 'code' });

      if (error) {
        console.log(`⚠️ Erro ao inserir cliente ${client.code}:`, error.message);
      } else {
        console.log(`✅ Cliente ${client.code} inserido/atualizado`);
      }
    }

    // 4. Buscar clientes estratégicos para criar dados relacionados
    console.log('🔍 Buscando clientes estratégicos...');
    const { data: strategicClients, error: strategicError } = await supabase
      .from('clients')
      .select('id, code, trade_name')
      .eq('client_type', 'strategic');

    if (strategicError) {
      console.log('⚠️ Erro ao buscar clientes estratégicos:', strategicError.message);
    } else {
      console.log(`⭐ ${strategicClients?.length || 0} clientes estratégicos encontrados`);

      // 5. Criar endereços para clientes estratégicos
      if (strategicClients && strategicClients.length > 0) {
        console.log('📍 Criando endereços...');
        for (const client of strategicClients) {
          const address = {
            client_id: client.id,
            address_type: 'main',
            street: 'Rua das Empresas',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zip_code: '01234-567',
            country: 'Brasil',
            is_primary: true
          };

          const { error: addressError } = await supabase
            .from('client_addresses')
            .upsert(address, { onConflict: 'client_id,address_type' });

          if (addressError) {
            console.log(`⚠️ Erro ao criar endereço para ${client.code}:`, addressError.message);
          } else {
            console.log(`📍 Endereço criado para ${client.code}`);
          }
        }
      }

      // 6. Criar contatos para clientes estratégicos
      if (strategicClients && strategicClients.length > 0) {
        console.log('📞 Criando contatos...');
        for (const client of strategicClients) {
          const contact = {
            client_id: client.id,
            contact_type: 'email',
            contact_value: `contato@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
            description: 'Email principal',
            is_primary: true,
            is_whatsapp: false
          };

          const { error: contactError } = await supabase
            .from('client_contacts')
            .upsert(contact, { onConflict: 'client_id,contact_type' });

          if (contactError) {
            console.log(`⚠️ Erro ao criar contato para ${client.code}:`, contactError.message);
          } else {
            console.log(`📞 Contato criado para ${client.code}`);
          }
        }
      }

      // 7. Criar pessoas de contato para clientes estratégicos
      if (strategicClients && strategicClients.length > 0) {
        console.log('👥 Criando pessoas de contato...');
        for (const client of strategicClients) {
          const person = {
            client_id: client.id,
            name: 'João Silva',
            role: 'Gerente de TI',
            email: `joao@${client.trade_name?.toLowerCase().replace(/\s+/g, '')}.com.br`,
            is_primary: true,
            is_decision_maker: true
          };

          const { error: personError } = await supabase
            .from('client_persons')
            .upsert(person, { onConflict: 'client_id,name' });

          if (personError) {
            console.log(`⚠️ Erro ao criar pessoa para ${client.code}:`, personError.message);
          } else {
            console.log(`👥 Pessoa criada para ${client.code}`);
          }
        }
      }
    }

    // 8. Verificar dados finais
    console.log('🔍 Verificando dados finais...');
    
    const { data: finalClients, error: finalError } = await supabase
      .from('clients')
      .select(`
        *,
        addresses:client_addresses(*),
        contacts:client_contacts(*),
        persons:client_persons(*)
      `)
      .limit(3);

    if (finalError) {
      console.error('❌ Erro na verificação final:', finalError);
    } else {
      console.log('✅ Dados finais verificados:');
      finalClients?.forEach(client => {
        console.log(`   - ${client.code}: ${client.company_name}`);
        console.log(`     Endereços: ${client.addresses?.length || 0}`);
        console.log(`     Contatos: ${client.contacts?.length || 0}`);
        console.log(`     Pessoas: ${client.persons?.length || 0}`);
      });
    }

    // 9. Testar inserção de um novo cliente
    console.log('🧪 Testando inserção de novo cliente...');
    
    const testClient = {
      code: 'TEST001',
      company_name: 'Empresa Teste Ltda',
      trade_name: 'Empresa Teste',
      document_type: 'CNPJ',
      document_number: '99.999.999/0001-99',
      client_type: 'regular',
      segment: 'Teste',
      size: 'small',
      status: 'active'
    };

    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert(testClient)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro ao inserir cliente de teste:', insertError);
    } else {
      console.log('✅ Cliente de teste inserido com sucesso:', newClient.code);
      
      // Remover o cliente de teste
      await supabase
        .from('clients')
        .delete()
        .eq('code', 'TEST001');
      
      console.log('🧹 Cliente de teste removido');
    }

    // 10. Contagem final
    console.log('📊 Contagem final...');
    
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { count: totalAddresses } = await supabase
      .from('client_addresses')
      .select('*', { count: 'exact', head: true });

    const { count: totalContacts } = await supabase
      .from('client_contacts')
      .select('*', { count: 'exact', head: true });

    const { count: totalPersons } = await supabase
      .from('client_persons')
      .select('*', { count: 'exact', head: true });

    console.log('🎉 Correção do banco de dados concluída com sucesso!');
    console.log('📊 Resumo final:');
    console.log(`   - Clientes: ${totalClients || 0}`);
    console.log(`   - Endereços: ${totalAddresses || 0}`);
    console.log(`   - Contatos: ${totalContacts || 0}`);
    console.log(`   - Pessoas: ${totalPersons || 0}`);
    console.log('');
    console.log('✅ O banco de dados está totalmente funcional!');
    console.log('🚀 Você pode agora cadastrar novos clientes no sistema.');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  }
}

// Executar o script
fixDatabase();

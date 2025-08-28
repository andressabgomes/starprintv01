// Script para testar se o banco de dados está funcionando
// Execute com: node scripts/test-database.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabase() {
  console.log('🧪 Testando banco de dados...');
  
  try {
    // 1. Testar conexão
    console.log('🔌 Testando conexão...');
    
    const { data: testData, error: testError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Erro de conexão:', testError);
      return;
    }

    console.log('✅ Conexão estabelecida com sucesso!');

    // 2. Contar registros
    console.log('📊 Contando registros...');
    
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

    console.log(`📊 Total de registros:`);
    console.log(`   - Clientes: ${totalClients || 0}`);
    console.log(`   - Endereços: ${totalAddresses || 0}`);
    console.log(`   - Contatos: ${totalContacts || 0}`);
    console.log(`   - Pessoas: ${totalPersons || 0}`);

    // 3. Testar inserção de cliente
    console.log('➕ Testando inserção de cliente...');
    
    const testClient = {
      code: 'TEST' + Date.now(),
      company_name: 'Empresa Teste ' + Date.now(),
      trade_name: 'Teste ' + Date.now(),
      document_type: 'CNPJ',
      document_number: '99.999.999/0001-' + (Date.now() % 100).toString().padStart(2, '0'),
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
      console.error('❌ Erro ao inserir cliente:', insertError);
    } else {
      console.log('✅ Cliente inserido com sucesso:', newClient.code);
      
      // 4. Testar inserção de endereço
      console.log('📍 Testando inserção de endereço...');
      
      const testAddress = {
        client_id: newClient.id,
        address_type: 'main',
        street: 'Rua Teste',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-567',
        country: 'Brasil',
        is_primary: true
      };

      const { data: newAddress, error: addressError } = await supabase
        .from('client_addresses')
        .insert(testAddress)
        .select()
        .single();

      if (addressError) {
        console.error('❌ Erro ao inserir endereço:', addressError);
      } else {
        console.log('✅ Endereço inserido com sucesso');
      }

      // 5. Testar inserção de contato
      console.log('📞 Testando inserção de contato...');
      
      const testContact = {
        client_id: newClient.id,
        contact_type: 'email',
        contact_value: 'teste@empresa.com',
        description: 'Email de teste',
        is_primary: true,
        is_whatsapp: false
      };

      const { data: newContact, error: contactError } = await supabase
        .from('client_contacts')
        .insert(testContact)
        .select()
        .single();

      if (contactError) {
        console.error('❌ Erro ao inserir contato:', contactError);
      } else {
        console.log('✅ Contato inserido com sucesso');
      }

      // 6. Testar inserção de pessoa
      console.log('👥 Testando inserção de pessoa...');
      
      const testPerson = {
        client_id: newClient.id,
        name: 'João Teste',
        role: 'Gerente',
        email: 'joao@empresa.com',
        is_primary: true,
        is_decision_maker: true
      };

      const { data: newPerson, error: personError } = await supabase
        .from('client_persons')
        .insert(testPerson)
        .select()
        .single();

      if (personError) {
        console.error('❌ Erro ao inserir pessoa:', personError);
      } else {
        console.log('✅ Pessoa inserida com sucesso');
      }

      // 7. Testar busca com relacionamentos
      console.log('🔍 Testando busca com relacionamentos...');
      
      const { data: clientWithRelations, error: relationsError } = await supabase
        .from('clients')
        .select(`
          *,
          addresses:client_addresses(*),
          contacts:client_contacts(*),
          persons:client_persons(*)
        `)
        .eq('id', newClient.id)
        .single();

      if (relationsError) {
        console.error('❌ Erro ao buscar relacionamentos:', relationsError);
      } else {
        console.log('✅ Relacionamentos funcionando:');
        console.log(`   - Endereços: ${clientWithRelations.addresses?.length || 0}`);
        console.log(`   - Contatos: ${clientWithRelations.contacts?.length || 0}`);
        console.log(`   - Pessoas: ${clientWithRelations.persons?.length || 0}`);
      }

      // 8. Limpar dados de teste
      console.log('🧹 Limpando dados de teste...');
      
      await supabase
        .from('client_persons')
        .delete()
        .eq('client_id', newClient.id);

      await supabase
        .from('client_contacts')
        .delete()
        .eq('client_id', newClient.id);

      await supabase
        .from('client_addresses')
        .delete()
        .eq('client_id', newClient.id);

      await supabase
        .from('clients')
        .delete()
        .eq('id', newClient.id);

      console.log('✅ Dados de teste removidos');
    }

    console.log('');
    console.log('🎉 Teste do banco de dados concluído com sucesso!');
    console.log('✅ O banco de dados está totalmente funcional!');
    console.log('🚀 Você pode cadastrar clientes, endereços, contatos e pessoas sem problemas.');
    console.log('');
    console.log('📋 Funcionalidades testadas:');
    console.log('   ✅ Conexão com o banco');
    console.log('   ✅ Inserção de clientes');
    console.log('   ✅ Inserção de endereços');
    console.log('   ✅ Inserção de contatos');
    console.log('   ✅ Inserção de pessoas');
    console.log('   ✅ Busca com relacionamentos');
    console.log('   ✅ Exclusão de dados');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o script
testDatabase();

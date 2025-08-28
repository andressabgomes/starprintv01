// Script para corrigir as constraints do banco de dados
// Execute com: node scripts/fix-constraints.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vtzukmbnbmzzlqcdzjto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0enVrbWJuYm16emxxY2R6anRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTA2MzYsImV4cCI6MjA3MTEyNjYzNn0.fAyCAIV2daSk578xlrRVwtoMgj6rgQoQkLBG1ptguUg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixConstraints() {
  console.log('🔧 Corrigindo constraints do banco de dados...');
  
  try {
    // 1. Verificar se há dados duplicados
    console.log('🔍 Verificando dados duplicados...');
    
    const { data: duplicateAddresses, error: addrError } = await supabase
      .from('client_addresses')
      .select('client_id, address_type, COUNT(*)')
      .group('client_id, address_type')
      .gt('count', 1);

    if (addrError) {
      console.log('⚠️ Erro ao verificar endereços duplicados:', addrError.message);
    } else {
      console.log(`📍 ${duplicateAddresses?.length || 0} grupos de endereços duplicados encontrados`);
    }

    const { data: duplicateContacts, error: contError } = await supabase
      .from('client_contacts')
      .select('client_id, contact_type, COUNT(*)')
      .group('client_id, contact_type')
      .gt('count', 1);

    if (contError) {
      console.log('⚠️ Erro ao verificar contatos duplicados:', contError.message);
    } else {
      console.log(`📞 ${duplicateContacts?.length || 0} grupos de contatos duplicados encontrados`);
    }

    const { data: duplicatePersons, error: persError } = await supabase
      .from('client_persons')
      .select('client_id, name, COUNT(*)')
      .group('client_id, name')
      .gt('count', 1);

    if (persError) {
      console.log('⚠️ Erro ao verificar pessoas duplicadas:', persError.message);
    } else {
      console.log(`👥 ${duplicatePersons?.length || 0} grupos de pessoas duplicadas encontrados`);
    }

    // 2. Limpar dados duplicados
    console.log('🧹 Limpando dados duplicados...');
    
    // Para endereços, manter apenas o primeiro de cada tipo por cliente
    if (duplicateAddresses && duplicateAddresses.length > 0) {
      for (const dup of duplicateAddresses) {
        const { data: addresses, error } = await supabase
          .from('client_addresses')
          .select('id')
          .eq('client_id', dup.client_id)
          .eq('address_type', dup.address_type)
          .order('created_at', { ascending: true });

        if (!error && addresses && addresses.length > 1) {
          // Manter o primeiro, deletar os outros
          const toDelete = addresses.slice(1).map(a => a.id);
          
          for (const id of toDelete) {
            await supabase
              .from('client_addresses')
              .delete()
              .eq('id', id);
          }
          
          console.log(`📍 Removidos ${toDelete.length} endereços duplicados para cliente ${dup.client_id}`);
        }
      }
    }

    // Para contatos, manter apenas o primeiro de cada tipo por cliente
    if (duplicateContacts && duplicateContacts.length > 0) {
      for (const dup of duplicateContacts) {
        const { data: contacts, error } = await supabase
          .from('client_contacts')
          .select('id')
          .eq('client_id', dup.client_id)
          .eq('contact_type', dup.contact_type)
          .order('created_at', { ascending: true });

        if (!error && contacts && contacts.length > 1) {
          // Manter o primeiro, deletar os outros
          const toDelete = contacts.slice(1).map(c => c.id);
          
          for (const id of toDelete) {
            await supabase
              .from('client_contacts')
              .delete()
              .eq('id', id);
          }
          
          console.log(`📞 Removidos ${toDelete.length} contatos duplicados para cliente ${dup.client_id}`);
        }
      }
    }

    // Para pessoas, manter apenas a primeira de cada nome por cliente
    if (duplicatePersons && duplicatePersons.length > 0) {
      for (const dup of duplicatePersons) {
        const { data: persons, error } = await supabase
          .from('client_persons')
          .select('id')
          .eq('client_id', dup.client_id)
          .eq('name', dup.name)
          .order('created_at', { ascending: true });

        if (!error && persons && persons.length > 1) {
          // Manter o primeiro, deletar os outros
          const toDelete = persons.slice(1).map(p => p.id);
          
          for (const id of toDelete) {
            await supabase
              .from('client_persons')
              .delete()
              .eq('id', id);
          }
          
          console.log(`👥 Removidas ${toDelete.length} pessoas duplicadas para cliente ${dup.client_id}`);
        }
      }
    }

    // 3. Verificar dados finais
    console.log('🔍 Verificando dados finais...');
    
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

    console.log('🎉 Limpeza de constraints concluída!');
    console.log('📊 Resumo final:');
    console.log(`   - Clientes: ${totalClients || 0}`);
    console.log(`   - Endereços: ${totalAddresses || 0}`);
    console.log(`   - Contatos: ${totalContacts || 0}`);
    console.log(`   - Pessoas: ${totalPersons || 0}`);
    console.log('');
    console.log('✅ O banco de dados está limpo e funcional!');
    console.log('🚀 Todos os cadastros e registros podem ser criados sem problemas.');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
  }
}

// Executar o script
fixConstraints();

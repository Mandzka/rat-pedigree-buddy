# Pet Care Manager

Sistema completo de gestão para profissionais de pet care (pet sitter, dog walker, treinamento e hospedagem).

## Funcionalidades

### ✅ Gestão de Clientes
- Cadastro completo de clientes com contato e endereço
- Busca rápida de clientes
- Edição e exclusão de clientes

### ✅ Gestão de Pets
- Cadastro detalhado de pets (cães, gatos, outros)
- Informações completas: raça, peso, cor, microchip
- Histórico de vacinações e medicamentos
- Alergias e instruções especiais
- Observações de temperamento

### ✅ Agendamento de Serviços
- **Pet Sitting**: Serviços de cuidado em casa
- **Dog Walking**: Passeios com cães
- **Treinamento**: Sessões de adestramento
- **Hospedagem**: Estadia completa dos pets
- Agendamento com data, horário e duração
- Controle de status (Agendado, Em Andamento, Concluído, Cancelado)
- Gestão de preços

### ✅ Dashboard
- Visão geral com estatísticas
- Lista de próximos serviços agendados
- Filtros e busca avançada

## Configuração

### 1. Banco de Dados Supabase

Execute o script SQL no Supabase SQL Editor:

```bash
# O arquivo pet-care-schema.sql contém todas as tabelas necessárias
```

Ou copie o conteúdo de `pet-care-schema.sql` e execute no SQL Editor do Supabase.

### 2. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
```

### 3. Instalação

```bash
npm install
```

### 4. Executar

```bash
npm run dev
```

## Estrutura do Banco de Dados

### Tabela `clients`
- Informações de clientes (nome, telefone, email, endereço)

### Tabela `pets`
- Informações completas dos pets vinculados aos clientes
- Histórico médico e comportamental

### Tabela `services`
- Agendamentos de todos os tipos de serviços
- Status e histórico completo

## Funcionalidades Principais

### Dashboard
- Total de clientes cadastrados
- Total de pets cadastrados
- Serviços agendados
- Lista dos próximos 5 serviços

### Gestão de Clientes
1. Clique em "Adicionar Cliente"
2. Preencha os dados obrigatórios (nome e telefone)
3. Adicione informações adicionais conforme necessário
4. Edite ou exclua clientes a qualquer momento

### Gestão de Pets
1. Selecione um cliente existente
2. Clique em "Adicionar Pet"
3. Preencha todas as informações relevantes
4. Mantenha um registro completo de vacinações e cuidados

### Agendamento de Serviços
1. Selecione o cliente e os pets envolvidos
2. Escolha o tipo de serviço
3. Defina data, horário e localização
4. Adicione observações e preço
5. Acompanhe o status do serviço

## Armazenamento Local

O sistema funciona com localStorage como fallback caso o Supabase não esteja configurado, permitindo uso imediato mesmo sem banco de dados.

## Próximas Melhorias Sugeridas

- [ ] Calendário visual de agendamentos
- [ ] Relatórios financeiros
- [ ] Notificações de serviços próximos
- [ ] Upload de fotos dos pets
- [ ] Histórico completo de serviços por pet
- [ ] Sistema de pagamentos
- [ ] Exportação de dados (PDF/Excel)

## Tecnologias Utilizadas

- React 18
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- date-fns (formatação de datas)
- Radix UI (componentes)

## Autor

Sistema desenvolvido para facilitar a gestão de clientes e serviços de pet care.


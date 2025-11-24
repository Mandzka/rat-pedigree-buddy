# Rat Pedigree Buddy - Configuração do Supabase

Este projeto usa Supabase como banco de dados para armazenar informações sobre ratos e ninhadas.

## Configuração do Supabase

### 1. Criar um projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados do projeto:
   - Name: `rat-pedigree-buddy`
   - Database Password: (escolha uma senha forte)
   - Region: escolha a região mais próxima

### 2. Configurar o banco de dados

1. No painel do Supabase, vá para "SQL Editor"
2. Copie o conteúdo do arquivo `supabase-schema.sql`
3. Cole no editor SQL e execute

### 3. Configurar variáveis de ambiente

1. Copie o arquivo `env.example` para `.env.local`
2. Preencha as variáveis com os dados do seu projeto Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
```

Para encontrar essas informações:
- **URL**: Vá em Settings > API > Project URL
- **Chave Pública**: Vá em Settings > API > Project API keys > anon public

### 4. Instalar dependências

```bash
npm install @supabase/supabase-js
```

### 5. Testar a conexão

O projeto já está configurado para usar o Supabase. Quando você executar a aplicação, ela tentará conectar ao banco de dados automaticamente.

## Estrutura do Banco de Dados

### Tabela `rats`
Armazena informações sobre cada rato:
- Dados básicos (nome, data de nascimento, sexo, etc.)
- Características físicas (cor, pelagem, olhos, etc.)
- Informações genéticas (genótipo, genes portadores, etc.)
- Temperamento e notas
- Relacionamentos familiares (pais, ninhada)

### Tabela `litters`
Armazena informações sobre ninhadas:
- Dados dos pais
- Data de nascimento
- Número de filhotes
- Observações comportamentais e de saúde

## Funcionalidades Implementadas

✅ **Genótipos Automáticos**: Baseados nos fenótipos selecionados
✅ **Exclusão de Ratos**: Com confirmação de segurança
✅ **Gestão de Ninhadas**: Criação e visualização de ninhadas
✅ **Filtragem por Ninhada**: Busca por nome da ninhada
✅ **Fichas Automáticas**: Criação em lote para filhotes
✅ **Banco de Dados Supabase**: Persistência de dados

## Próximos Passos

1. Configure o Supabase seguindo as instruções acima
2. Execute o projeto: `npm run dev`
3. Comece adicionando ratos e ninhadas!

## Suporte

Se encontrar problemas:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o schema SQL foi executado corretamente
3. Verifique os logs do console para erros de conexão

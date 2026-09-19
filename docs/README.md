# 📚 DIO Explorer — Documentação Completa

> Projeto final da **Formação Bob** na DIO.  
> Um ecossistema completo com API REST, Servidor MCP e Skills para o Bob — tudo integrado para explorar trilhas, emitir certificados e gerar desafios de código.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura](#2-arquitetura)
3. [API REST — DIO Explorer](#3-api-rest--dio-explorer)
   - [GET /trilha/:tecnologia](#31-get-trilhatecnologia)
   - [POST /certificado](#32-post-certificado)
   - [GET /desafio/:tecnologia/:nivel](#33-get-desafiotecnologianivel)
4. [Servidor MCP](#4-servidor-mcp)
   - [buscar_trilha](#41-ferramenta-buscar_trilha)
   - [gerar_certificado](#42-ferramenta-gerar_certificado)
   - [gerar_desafio](#43-ferramenta-gerar_desafio)
5. [Slash Commands (Bob)](#5-slash-commands-bob)
   - [/trilha](#51-trilha)
   - [/certificado](#52-certificado)
   - [/desafio](#53-desafio)
6. [Skills (Bob)](#6-skills-bob)
7. [Catálogo de Trilhas](#7-catálogo-de-trilhas)
8. [Como Rodar o Projeto](#8-como-rodar-o-projeto)
9. [Testes](#9-testes)
10. [Prompts Usados na Construção](#10-prompts-usados-na-construção)
11. [Dicas de Uso](#11-dicas-de-uso)
12. [Insights para Futuros Profissionais](#12-insights-para-futuros-profissionais)

---

## 1. Visão Geral do Projeto

O **DIO Explorer** é um projeto full-stack de aprendizado desenvolvido como projeto final da Formação Bob na Digital Innovation One (DIO). Ele foi construído em **três camadas complementares**:

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **API REST** | Node.js + Express | Backend HTTP com os três endpoints principais |
| **Servidor MCP** | TypeScript + MCP SDK | Integração nativa com o assistente Bob via protocolo MCP |
| **Skills + Commands** | Markdown (Bob) | Automações e formatação de respostas dentro do Bob |

O projeto simula um catálogo de trilhas da DIO com **13 trilhas** cobrindo as principais tecnologias do mercado.

---

## 2. Arquitetura

```
projeto-final-dio-formacao-bob/
│
├── .bob/
│   ├── mcp.json                  ← Registro do servidor MCP no Bob
│   └── skills/
│       ├── trilha/SKILL.md       ← Skill: plano de estudos direto do JSON
│       ├── certificado/SKILL.md  ← Skill: certificado em markdown
│       └── desafio/SKILL.md      ← Skill: desafio criativo por tecnologia
│
└── dio-explorer/
    ├── src/
    │   ├── server.js             ← Ponto de entrada da API Express
    │   └── routes/
    │       ├── trilha.js         ← GET /trilha/:tecnologia
    │       ├── certificado.js    ← POST /certificado
    │       └── desafio.js        ← GET /desafio/:tecnologia/:nivel
    ├── mcp/
    │   ├── src/
    │   │   ├── index.ts          ← Bootstrap do MCP server + registro de tools
    │   │   └── logic.ts          ← Lógica de negócio (compartilhada, sem transporte)
    │   └── build/                ← JS compilado (executado pelo Bob)
    ├── data/
    │   └── trilhas-dio.json      ← Banco de dados das 13 trilhas
    ├── commands/
    │   ├── trilha.md             ← Slash command /trilha
    │   ├── certificado.md        ← Slash command /certificado
    │   └── desafio.md            ← Slash command /desafio
    └── docs/
        └── README.md             ← Este arquivo
```

**Fluxo de dados:**

```
Usuário no Bob
     │
     ├─── /trilha react         → Slash Command → curl → API REST → JSON → Markdown formatado
     ├─── skill: trilha react   → Skill → lê trilhas-dio.json → Markdown gerado pelo modelo
     └─── buscar_trilha react   → MCP Tool → logic.ts → JSON estruturado
```

---

## 3. API REST — DIO Explorer

### Iniciar o servidor

```bash
cd dio-explorer
npm install
npm start          # produção — porta 3000
npm run dev        # desenvolvimento com nodemon
```

A API ficará disponível em `http://localhost:3000`.

---

### 3.1 GET /trilha/:tecnologia

Retorna o plano de estudos completo de uma trilha. A busca é **parcial e case-insensitive**.

**Request:**
```
GET http://localhost:3000/trilha/react
```

**Response 200:**
```json
{
  "trilha": "Formação React Developer",
  "tecnologia": "React",
  "nivel": "Intermediário",
  "xp_total": 18500,
  "numero_de_modulos": 10,
  "plano_de_estudos": {
    "fase_1_fundamentos": [
      {
        "numero": 1,
        "titulo": "React — Revisão e Setup do Projeto",
        "objetivo": "Dominar revisão e setup do projeto utilizando React.",
        "tempo_estimado": "6–8h"
      }
    ],
    "fase_2_pratica": [...],
    "fase_3_avancado": [...]
  },
  "badges_disponiveis": ["React Fundamentals", "Hooks Expert", "Redux Master"],
  "lives_ao_vivo": [
    {
      "titulo": "Criando componentes reutilizáveis",
      "data": "20/07/2025",
      "instrutor": "Fernanda Costa"
    }
  ],
  "dicas_de_estudo": [
    "Pratique diariamente com pequenos projetos usando React para fixar os conceitos.",
    "Leia a documentação oficial de React — ela é a fonte mais confiável e atualizada.",
    "Participe de comunidades e fóruns sobre React para tirar dúvidas e aprender com outros devs."
  ]
}
```

**Response 404 (trilha não encontrada):**
```json
{
  "erro": "Nenhuma trilha encontrada para \"cobol\".",
  "tecnologias_disponiveis": ["JavaScript", "React", "Python", "Java", ...]
}
```

**Distribuição das fases:**
- Fase 1 (Fundamentos): primeiros 30% dos módulos
- Fase 2 (Prática): módulos de 31% a 65%
- Fase 3 (Avançado): módulos de 66% a 100%

---

### 3.2 POST /certificado

Gera um certificado fictício de conclusão. Se a trilha não existir no catálogo, emite um certificado genérico com aviso.

**Request:**
```
POST http://localhost:3000/certificado
Content-Type: application/json

{
  "nome": "João da Silva",
  "trilha": "java"
}
```

**Response 200 (trilha encontrada):**
```json
{
  "certificado": {
    "titulo": "CERTIFICADO DE CONCLUSÃO",
    "emissor": "Digital Innovation One — DIO",
    "nome_usuario": "João da Silva",
    "trilha": "Formação Java Developer",
    "data_conclusao": "14/07/2025",
    "nivel": "Intermediário",
    "xp_conquistado": 22000,
    "numero_de_modulos": 12,
    "badges_conquistadas": ["Java Básico", "Spring Boot Expert", "JPA Master"],
    "competencias_desenvolvidas": [
      "Desenvolvimento de soluções utilizando Java",
      "Aplicação de boas práticas e padrões de projeto com Java",
      "Criação e consumo de APIs integradas com Java",
      "Versionamento de código e colaboração em equipe",
      "Testes automatizados e qualidade de código em projetos Java"
    ],
    "id_certificado": "DIO-2025004-XKQZ"
  }
}
```

**Response 200 (trilha NÃO encontrada — certificado genérico):**
```json
{
  "aviso": "Trilha \"cobol\" não localizada no catálogo. Certificado gerado com valores genéricos.",
  "certificado": {
    "titulo": "CERTIFICADO DE CONCLUSÃO",
    "emissor": "Digital Innovation One — DIO",
    "nome_usuario": "João da Silva",
    "trilha": "cobol",
    "nivel": "N/A",
    "xp_conquistado": 0,
    "badges_conquistadas": [],
    "competencias_desenvolvidas": ["Lógica de programação e resolução de problemas", ...],
    "id_certificado": "DIO-2025000-ABCD"
  }
}
```

**Response 400 (campos ausentes):**
```json
{
  "erro": "Os campos \"nome\" e \"trilha\" são obrigatórios no body da requisição."
}
```

**Lógica do ID do certificado:**
- Formato: `DIO-{ano}{id_trilha_3_digitos}-{4_letras_aleatórias}`
- Exemplo: `DIO-2025004-XKQZ` → ano 2025, trilha ID 4 (Java), sufixo aleatório XKQZ

---

### 3.3 GET /desafio/:tecnologia/:nivel

Gera um desafio de código aleatório. O nível aceita variações com e sem acento, maiúsculo ou minúsculo.

**Request:**
```
GET http://localhost:3000/desafio/python/intermediario
```

**Response 200:**
```json
{
  "titulo": "⚔️ Desafio DIO: Anagrama Detector",
  "tecnologia": "python",
  "nivel": "Intermediário",
  "xp_recompensa": 950,
  "tempo_estimado": "1–3 horas",
  "descricao": "Uma plataforma de jogos de palavras precisa de uma função que determine se duas strings são anagramas...",
  "objetivo": [
    "Receber duas strings",
    "Verificar se são anagramas uma da outra",
    "Retornar true ou false"
  ],
  "entrada": "Duas strings.",
  "saida_esperada": [
    { "entrada": "\"listen\", \"silent\"", "saida": "true" },
    { "entrada": "\"hello\", \"world\"", "saida": "false" }
  ],
  "dicas": [
    "Ordene os caracteres de cada string e compare.",
    "Use um mapa de frequências para cada string."
  ],
  "criterios_de_avaliacao": [
    "Algoritmo correto e eficiente",
    "Tratamento adequado de maiúsculas/minúsculas",
    "Complexidade de tempo razoável (O(n log n) ou melhor)"
  ]
}
```

**Níveis válidos (aceita com ou sem acento):**
| Entrada | Normalizado |
|---------|------------|
| `basico` ou `básico` | `Básico` |
| `intermediario` ou `intermediário` | `Intermediário` |
| `avancado` ou `avançado` | `Avançado` |

**Response 400 (nível inválido):**
```json
{
  "erro": "Nível \"expert\" inválido.",
  "niveis_validos": ["basico", "intermediario", "avancado"]
}
```

---

## 4. Servidor MCP

O servidor MCP expõe as mesmas três funcionalidades da API REST como **ferramentas nativas do Bob**, sem precisar que a API esteja rodando. Ele usa **transporte stdio** e é registrado em `.bob/mcp.json`.

### Registrar o servidor no Bob

O arquivo `.bob/mcp.json` já está configurado:

```json
{
  "mcpServers": {
    "dio-explorer": {
      "command": "node",
      "args": [
        "/caminho/absoluto/para/dio-explorer/mcp/build/index.js"
      ]
    }
  }
}
```

### Compilar o TypeScript

```bash
cd dio-explorer/mcp
npm install
npm run build      # gera build/index.js e build/logic.js
```

---

### 4.1 Ferramenta: `buscar_trilha`

**Parâmetros:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tecnologia` | string | Nome parcial da tecnologia (ex: `"react"`, `"python"`) |

**Como usar no Bob:**
```
Busque a trilha de Node.js para mim.
```
O Bob invoca `buscar_trilha` com `tecnologia: "Node.js"` e retorna o plano de estudos formatado.

---

### 4.2 Ferramenta: `gerar_certificado`

**Parâmetros:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | string | Nome completo do usuário |
| `trilha` | string | Nome parcial da trilha ou tecnologia |

**Como usar no Bob:**
```
Gere um certificado para "Maria Fernanda" na trilha de Machine Learning.
```

---

### 4.3 Ferramenta: `gerar_desafio`

**Parâmetros:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tecnologia` | string | Linguagem ou tecnologia (ex: `"TypeScript"`, `"Java"`) |
| `nivel` | string | `"basico"`, `"intermediario"` ou `"avancado"` |

**Como usar no Bob:**
```
Me dê um desafio avançado de TypeScript.
```

---

## 5. Slash Commands (Bob)

Os slash commands ficam em `dio-explorer/commands/` e são registrados em `.bob/commands`. Eles executam `curl` para consumir a API REST e formatam a resposta como markdown.

> ⚠️ **Pré-requisito:** A API REST precisa estar rodando em `http://localhost:3000` para os slash commands funcionarem.

---

### 5.1 `/trilha`

**Uso:** `/trilha <tecnologia>`

**Exemplos:**
```
/trilha javascript
/trilha python
/trilha docker
/trilha aws
```

**O que faz:**
1. Executa `curl -s http://localhost:3000/trilha/<tecnologia>`
2. Se retornar erro 404, exibe mensagem amigável com lista de tecnologias disponíveis
3. Se retornar 200, formata o JSON como plano de estudos completo em markdown com emojis, fases e dicas

---

### 5.2 `/certificado`

**Uso:** `/certificado <nome-do-usuario> <trilha>`

**Exemplos:**
```
/certificado "Ana Lima" react
/certificado "Carlos Dev" java
/certificado "Maria Silva" "machine learning"
```

**O que faz:**
1. Executa `curl -s -X POST http://localhost:3000/certificado` com body JSON
2. Se houver campo `aviso`, exibe-o antes do certificado
3. Formata o certificado como documento markdown com tabela de dados, badges e competências

---

### 5.3 `/desafio`

**Uso:** `/desafio <tecnologia> <nivel>`

**Exemplos:**
```
/desafio python basico
/desafio javascript intermediario
/desafio java avancado
/desafio typescript avancado
```

**O que faz:**
1. Executa `curl -s http://localhost:3000/desafio/<tecnologia>/<nivel>`
2. Se nível inválido, informa os valores aceitos
3. Formata o desafio com título, XP, tempo estimado, descrição, objetivos, exemplos de I/O, dicas e critérios de avaliação

---

## 6. Skills (Bob)

As skills ficam em `.bob/skills/` e funcionam **sem precisar da API rodando** — elas leem o JSON diretamente e usam o modelo do Bob para gerar as respostas.

| Skill | Ativação | Diferencial vs. Slash Command |
|-------|----------|-------------------------------|
| `trilha` | `use_skill: trilha` | Lê o JSON diretamente, usa LLM para inventar módulos mais criativos |
| `certificado` | `use_skill: certificado` | Lê o JSON diretamente, sem dependência de servidor HTTP |
| `desafio` | `use_skill: desafio` | Gera desafios completamente únicos a cada chamada (não usa banco fixo) |

**Diferença principal:** os slash commands consomem a API e retornam dados determinísticos. As skills usam o modelo de linguagem para gerar respostas mais ricas e variadas, mas dependem do JSON local para dados reais.

---

## 7. Catálogo de Trilhas

| ID | Nome | Tecnologia | Nível | Módulos | XP Total |
|----|------|-----------|-------|---------|---------|
| 1 | Formação JavaScript Developer | JavaScript | Básico | 8 | 12.400 |
| 2 | Formação React Developer | React | Intermediário | 10 | 18.500 |
| 3 | Formação Python Developer | Python | Básico | 9 | 14.200 |
| 4 | Formação Java Developer | Java | Intermediário | 12 | 22.000 |
| 5 | Formação Machine Learning Specialist | Python / Scikit-Learn | Avançado | 15 | 35.000 |
| 6 | Formação Node.js Developer | Node.js | Intermediário | 11 | 19.800 |
| 7 | Formação Angular Developer | Angular | Intermediário | 10 | 17.600 |
| 8 | Formação Vue.js Developer | Vue.js | Básico | 8 | 13.500 |
| 9 | Formação DevOps Engineer | Docker / Kubernetes / CI-CD | Avançado | 14 | 30.000 |
| 10 | Formação Cloud AWS | Amazon Web Services | Intermediário | 13 | 26.500 |
| 11 | Formação Cloud Azure | Microsoft Azure | Intermediário | 12 | 24.800 |
| 12 | Formação Data Science com Python | Python / Pandas / NumPy | Intermediário | 14 | 28.000 |
| 13 | Formação SQL e Banco de Dados | SQL / PostgreSQL / MySQL | Básico | — | — |

**Palavras-chave de busca aceitas (exemplos):**
- `javascript`, `js` → Formação JavaScript Developer
- `react` → Formação React Developer
- `python` → Formação Python Developer OU Python / Scikit-Learn OU Python / Pandas
- `java` → Formação Java Developer *(também pode retornar JavaScript — use "java" sem "script" para ser específico)*
- `node` → Formação Node.js Developer
- `docker` ou `kubernetes` ou `devops` → Formação DevOps Engineer
- `aws` ou `amazon` → Formação Cloud AWS
- `azure` ou `microsoft` → Formação Cloud Azure
- `pandas` ou `numpy` ou `data science` → Formação Data Science com Python
- `sql` ou `postgres` → Formação SQL e Banco de Dados

---

## 8. Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm 9+

### Passo a passo completo

```bash
# 1. Clone ou acesse o projeto
cd projeto-final-dio-formacao-bob/dio-explorer

# 2. Instale as dependências da API
npm install

# 3. Inicie a API REST
npm start
# Saída esperada: DIO Explorer API running on port 3000

# 4. Em outro terminal: compile o MCP server
cd mcp
npm install
npm run build
# Saída: compila src/index.ts e src/logic.ts → build/

# 5. Verifique se o .bob/mcp.json aponta para o caminho correto
# e reinicie o Bob para carregar o servidor MCP
```

### Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta onde a API REST escuta |

```bash
PORT=8080 npm start    # Inicia na porta 8080
```

---

## 9. Testes

O projeto possui testes de integração com **Jest** e **Supertest** cobrindo os três endpoints.

```bash
cd dio-explorer
npm test              # roda os testes com cobertura
npm run test:watch    # modo watch (re-roda ao salvar)
```

**Arquivos de teste:**
- `src/tests/trilha.test.js` — testa GET /trilha/:tecnologia
- `src/tests/certificado.test.js` — testa POST /certificado
- `src/tests/desafio.test.js` — testa GET /desafio/:tecnologia/:nivel

**Relatório de cobertura:** gerado em `coverage/lcov-report/index.html`.

---

## 10. Prompts Usados na Construção

Esta seção documenta os prompts utilizados no diálogo com o Bob para construir cada parte do projeto. É uma referência valiosa para entender como aproveitar ao máximo um assistente de IA no desenvolvimento.

---

### 10.1 Criação da estrutura base e do JSON de dados

```
Cria a estrutura de pastas para um projeto Node.js chamado "dio-explorer" 
com as pastas src/routes, data, docs, commands e mcp. Inclui um arquivo 
trilhas-dio.json com pelo menos 10 trilhas da DIO com campos: id, nome, 
tecnologia, nivel, numero_de_modulos, xp_total, badges_disponiveis, 
lives_ao_vivo (array com titulo, data, instrutor).
```

---

### 10.2 Criação da API REST

```
Cria uma API REST com Express.js para o projeto dio-explorer com três endpoints:
- GET /trilha/:tecnologia — busca parcial case-insensitive, retorna plano de estudos 
  com módulos divididos em 3 fases (fundamentos, prática, avançado)
- POST /certificado — recebe { nome, trilha } e retorna certificado fictício com dados 
  reais da trilha. Se trilha não encontrada, retorna certificado genérico com aviso.
- GET /desafio/:tecnologia/:nivel — retorna desafio aleatório. Nível aceita basico, 
  intermediario e avancado com ou sem acento, case-insensitive.
Cada rota deve ficar em arquivo separado em src/routes/.
```

---

### 10.3 Criação dos Slash Commands do Bob

```
Cria três slash commands para o Bob em dio-explorer/commands/:
- trilha.md: executa curl para GET /trilha/$1 e formata o JSON como plano de estudos 
  em markdown com emojis, fases e badges
- certificado.md: executa curl POST para /certificado com nome=$1 e trilha=$2, 
  formata como certificado em markdown com tabela de dados
- desafio.md: executa curl para GET /desafio/$1/$2, formata como card de desafio 
  com XP, tempo, objetivos, exemplos e critérios
```

---

### 10.4 Criação das Skills do Bob

```
Cria três skills para o Bob em .bob/skills/ que funcionem sem a API rodando, 
lendo o JSON diretamente:
- trilha/SKILL.md: busca trilha no JSON e gera plano de estudos com o modelo
- certificado/SKILL.md: busca trilha no JSON e gera certificado formatado em markdown
- desafio/SKILL.md: gera desafio criativo e único por tecnologia e nível, 
  variando o tema a cada execução. disable-model-invocation: true
```

---

### 10.5 Criação do Servidor MCP

```
Cria um servidor MCP em TypeScript em dio-explorer/mcp/src/ usando 
@modelcontextprotocol/sdk e zod. Registra três tools:
- buscar_trilha(tecnologia): retorna plano de estudos
- gerar_certificado(nome, trilha): retorna certificado  
- gerar_desafio(tecnologia, nivel): retorna desafio
A lógica de negócio deve ficar em logic.ts separada do index.ts. 
Transporte: stdio. Registra o server em .bob/mcp.json.
```

---

### 10.6 Criação dos Testes

```
Cria testes de integração com Jest e Supertest para os três endpoints da API:
- trilha: testa busca por tecnologia existente, busca parcial, tecnologia inexistente
- certificado: testa com trilha encontrada, trilha não encontrada (genérico), 
  campos ausentes (400)
- desafio: testa nível válido (sem acento), nível com acento, nível inválido (400)
Configura cobertura de código em package.json.
```

---

### 10.7 Criação desta documentação

```
Cria a documentação para todo o projeto desenvolvido até aqui, com todos os prompts 
usados, modos de uso, dicas de uso e insights para futuros profissionais que vão 
aprender com nossa API. Em português.
```

---

## 11. Dicas de Uso

### 🔁 Quando usar API vs MCP vs Skill?

| Situação | Recomendação |
|----------|-------------|
| API REST offline, quero resultado rápido | Use a **Skill** do Bob |
| Quero dados precisos e formatados automaticamente | Use o **Slash Command** (API deve estar rodando) |
| Quero que o Bob use as ferramentas naturalmente na conversa | Use o **MCP** (Bob invoca automaticamente) |
| Quero integrar com outro sistema/app | Consuma a **API REST** diretamente |

---

### 💡 Truques com os Slash Commands

**Busca parcial funciona:**
```
/trilha py          → encontra Python
/trilha node        → encontra Node.js
/trilha docker      → encontra DevOps (Docker/K8s)
/trilha sql         → encontra SQL/PostgreSQL/MySQL
```

**Nome com espaços no /certificado:**
```
/certificado "Ana Carolina Souza" react
/certificado "João Pedro" "machine learning"
```

---

### ⚡ Usando o MCP no Bob

Como o MCP server está registrado, você pode conversar naturalmente com o Bob:

```
"Qual é a trilha de React? Me mostre o plano de estudos."
"Gere um certificado para 'Lucas Alves' na trilha de Java."
"Preciso de um desafio avançado de Python para treinar hoje."
"Quais trilhas estão disponíveis no DIO Explorer?"
```

O Bob identificará automaticamente qual ferramenta usar.

---

### 🧪 Testando a API com curl

```bash
# Buscar trilha
curl http://localhost:3000/trilha/react | python3 -m json.tool

# Gerar certificado
curl -s -X POST http://localhost:3000/certificado \
  -H "Content-Type: application/json" \
  -d '{"nome": "Seu Nome", "trilha": "python"}' | python3 -m json.tool

# Gerar desafio (tente diferentes tecnologias e níveis)
curl http://localhost:3000/desafio/javascript/avancado | python3 -m json.tool
curl http://localhost:3000/desafio/typescript/intermediario | python3 -m json.tool
```

---

## 12. Insights para Futuros Profissionais

Esta seção reúne aprendizados e boas práticas identificados ao longo da construção do projeto, especialmente voltados para quem está aprendendo desenvolvimento de APIs e integração com IA.

---

### 🏗️ Separação de responsabilidades (Single Responsibility)

O projeto separou intencionalmente a **lógica de negócio** (`logic.ts`) do **transporte** (`index.ts`) no servidor MCP. Isso permite:
- Reusar `buscarTrilha()`, `gerarCertificado()` e `gerarDesafio()` em qualquer contexto
- Testar a lógica isoladamente, sem precisar subir o servidor MCP
- Migrar de stdio para HTTP facilmente no futuro

> **Lição:** A lógica de negócio nunca deve depender do mecanismo de entrega. Separe sempre.

---

### 🔍 Busca tolerante a erros (fuzzy-friendly)

A busca por tecnologia usa `.includes()` case-insensitive em vez de match exato. Isso melhora drasticamente a experiência do usuário:
- `"py"` encontra `"Python"`, `"Python / Pandas"`, `"Python / Scikit-Learn"`
- `"node"` encontra `"Node.js"`
- `"docker"` encontra `"Docker / Kubernetes / CI-CD"`

> **Lição:** Em ferramentas de busca para usuários, prefira busca parcial a match exato. A experiência do usuário agradece.

---

### 🌐 Normalização de entrada (graceful input handling)

O endpoint `/desafio` aceita `basico`, `básico`, `Básico`, `BASICO` — todos funcionam. O mesmo padrão foi replicado no MCP server via `normalizarNivel()`.

> **Lição:** Sempre normalize entradas antes de processá-las. Nunca assuma que o usuário digitará exatamente o formato esperado.

---

### 📦 Dados determinísticos vs. geração criativa

O projeto demonstra dois padrões distintos:
- **API REST e Slash Commands:** retornam dados determinísticos de um banco fixo — ideal para integrações e testes
- **Skills do Bob:** usam LLM para gerar conteúdo único a cada chamada — ideal para experiências ricas

> **Lição:** Escolha a abordagem certa para cada caso. Dados determinísticos são previsíveis e testáveis. Geração por LLM é criativa, mas não auditável.

---

### 🛡️ Respostas de erro claras e acionáveis

O projeto não retorna apenas `{ "erro": "Not found" }`. Ele inclui o que o usuário *pode* fazer:
```json
{
  "erro": "Nenhuma trilha encontrada para \"cobol\".",
  "tecnologias_disponiveis": ["JavaScript", "React", "Python", ...]
}
```

> **Lição:** Mensagens de erro devem ser guias, não obstáculos. Sempre inclua o que o usuário pode fazer a seguir.

---

### 🧩 Protocolo MCP como contrato de ferramentas

O MCP (Model Context Protocol) funciona como uma camada de contrato entre ferramentas e modelos de linguagem. Ao registrar uma tool, você define:
- **Nome** — como o modelo invoca a ferramenta
- **Descrição** — o modelo usa isso para decidir quando invocar
- **Schema** (via Zod) — garante que os parâmetros chegam validados

> **Lição:** Escreva descrições de tools MCP como se estivesse documentando uma função pública. O modelo lê essas descrições para decidir quando e como usar a ferramenta.

---

### 🧪 Testes de integração > testes unitários para APIs

Para APIs REST, testes de integração com Supertest são mais valiosos que testes unitários isolados porque:
- Testam o comportamento real do endpoint (rota + lógica + resposta)
- Capturam regressões de formato de resposta (campos faltando, tipos errados)
- São mais fáceis de entender: dado `X`, espero `Y`

> **Lição:** Para APIs, priorize testes de integração. Eles testam o que o cliente vai realmente receber.

---

### 🔄 O ciclo de desenvolvimento com Bob

Este projeto foi desenvolvido inteiramente com Bob como par programador. O ciclo eficiente foi:

1. **Descrever o objetivo** de forma clara e com exemplos
2. **Revisar o código gerado** — não aceitar cegamente
3. **Testar imediatamente** após cada geração
4. **Iterar com feedback** específico ("o campo X precisa ser Y")
5. **Documentar os prompts** para reproducibilidade

> **Lição:** Trate o assistente de IA como um desenvolvedor sênior em pair programming — você valida, testa e direciona. Ele executa, sugere e explica.

---

*Documentação gerada com Bob — IBM Bob | Projeto Final Formação Bob · DIO*

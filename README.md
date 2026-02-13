# Teste Técnico - Front End Junior (Next.js & FastAPI)

Este projeto é uma plataforma de inteligência financeira que permite o upload de planilhas Excel, realiza o tratamento dos dados em tempo real via uma API Python e exibe os indicadores em um Dashboard moderno e responsivo.

## Arquitetura e Decisões de Projeto

### 1. Backend: ETL Dinâmico com FastAPI & Pandas
Em vez de tratar os dados manualmente no Excel, desenvolvi um pipeline de **ETL (Extract, Transform, Load)** automatizado:
- **Decisão:** Optei pelo **Pandas** porque ele é a ferramenta padrão ouro para manipulação de dados. No código, implementei funções de limpeza flexíveis (`converter_data_flexivel` e `limpar_moeda`) para garantir que o sistema não quebre com diferentes formatos de data ou moedas (R$).
- **Lógica de Correção:** Implementei uma verificação inteligente que detecta se as colunas de 'Produto' e 'Código' estão invertidas, corrigindo o erro automaticamente antes de enviar para o frontend.

### 2. Frontend: Modularização com Next.js (App Router)
A estrutura do frontend foi pensada para ser escalável e fácil de manter:
- **Componentização:** Dividi a interface em componentes específicos (ex: `CategoryChart`, `RevenueChart`, `TransactionTable`). Isso permite que cada parte do dashboard seja testada e atualizada isoladamente.
- **Utils e Formatters:** Criei uma pasta `utils` para centralizar a lógica de formatação de números e datas no frontend, mantendo os componentes de UI limpos e focados apenas na visualização.
- **State Management:** O upload é centralizado no `HeaderUpload.jsx`, que distribui os dados processados para as seções de KPI e gráficos.

---

## Estrutura do Código (Frontend)

Conforme a organização do diretório `app/`:

```text
├── components/
│   ├── CategoryChart.jsx    # Gráfico de distribuição por categoria
│   ├── FilterBar.jsx        # Filtros de data e categorias
│   ├── HeaderUpload.jsx     # Header com lógica de upload de arquivos
│   ├── KpiSection.jsx       # Cards com métricas principais (Total, Médias)
│   ├── RevenueChart.jsx     # Gráfico de evolução de receita
│   └── TransactionTable.jsx # Listagem detalhada dos dados processados
├── utils/
│   └── formatters.ts        # Função auxiliar de formatação
├── layout.tsx               # Estrutura base da aplicação
└── page.tsx                 # Página principal do Dashboard
```

## Tecnologias
Backend: FastAPI (Python), Pandas, Uvicorn.

Frontend: Next.js 14, TypeScript, Tailwind CSS, Recharts (ou biblioteca de gráficos utilizada).

Comunicação: API REST para processamento de arquivos via buffer de memória.

#  Como Executar o Projeto
## Passo 1: Clonar o Repositório
## Clone o repositório e acesse
git clone https://github.com/dieguitozz/Teste-Front-End-Junior.git

cd Teste-Front-End-Junior 

## Passo 2: Backend
Navegue até a pasta do backend

cd backend

(Opcional, mas recomendado) Crie um ambiente virtual
python -m venv venv

## Ative o ambiente virtual
Windows:
venv\Scripts\activate

Mac/Linux:
source venv/bin/activate

## Instale as dependências
pip install fastapi pandas uvicorn python-multipart openpyxl

## Inicie o servidor
uvicorn main:app --reload

O backend estará disponível em:
http://127.0.0.1:8000

## Passo 3: Frontend

Volte para a raiz do projeto
cd ..

Navegue até a pasta do frontend
cd frontend

## Instale as dependências
npm install

## Inicie o projeto
npm run dev

O frontend estará disponível em:
http://localhost:3000






# Ações Tomadas
O Processo: 
Desenvolver este projeto foi um exercício de paciência e investigação. Minha meta era transformar uma planilha "suja" em um dashboard limpo, e o caminho foi mais ou menos assim:

A Escolha da Automação: Decidi de cara não usar Excel manual. Pensei: "Se eu quero algo que escale e não dependa de mim clicando em células, preciso de Python". Escolhi FastAPI pela velocidade e Pandas pela robustez no tratamento de dados.

O Desafio dos Dados "Invisíveis": No início, bati a cabeça porque alguns dados simplesmente não eram lidos. Descobri que o problema era o formato de salvamento e caracteres ocultos nas strings. Foi aí que criei as funções de limpeza para "higienizar" cada entrada antes de processar.

A "Pegadinha" das Colunas Trocadas: Um momento marcante foi notar que, em algumas linhas, o gráfico exibia o Código do Produto onde deveria estar o Nome. Percebi que a planilha original tinha itens invertidos. Em vez de arrumar na mão, programei uma lógica (mask) que detecta essa inversão e corrige o dado automaticamente.

Arquitetura Modular: No frontend, usei Next.js com a estrutura de App Router. Separei tudo em componentes: o upload fica em um canto, os gráficos em outro e a tabela em outro. Isso deixou o código limpo e fácil de mexer depois.

Por que tomei essas decisões?
Segurança nos dados: Automatizar a limpeza evitou que erros de digitação na planilha quebrassem o dashboard.

Performance: O processamento em Python é muito mais rápido para grandes volumes do que funções de frontend.

Experiência do Usuário (UX): Foquei em um design moderno e "clean" para que os KPIs fossem batidos o olho e entendidos na hora.

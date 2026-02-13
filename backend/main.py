from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def limpar_moeda(valor):
    if pd.isna(valor):
        return 0.0

    if isinstance(valor, (int, float)):
        return float(valor)

    valor_str = str(valor).strip()
    valor_str = re.sub(r"[^\d,.\-]", "", valor_str)

    if "," in valor_str:
        valor_str = valor_str.replace(".", "").replace(",", ".")

    try:
        return float(valor_str)
    except ValueError:
        return 0.0

@app.post("/upload")
async def processar_excel(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Apenas arquivos Excel são permitidos.")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        df.columns = df.columns.str.strip()
        if 'Data' in df.columns:
            df['Data'] = pd.to_datetime(df['Data'], errors='coerce')
            df = df.dropna(subset=['Data'])
            df['Data_Formatada'] = df['Data'].dt.strftime('%d/%m/%Y')
            df['Mes_Ano'] = df['Data'].dt.strftime('%Y-%m') 


        if 'Categoria' in df.columns:
            df['Categoria'] = df['Categoria'].astype(str).str.title().str.strip()
            df['Categoria'] = df['Categoria'].replace('Servicos', 'Serviços')
            df['Categoria'] = df['Categoria']

        if 'Receita' in df.columns:
            df['Receita_Real'] = df['Receita'].apply(limpar_moeda)
        
        if 'Produto' in df.columns:
            df['Produto'] = df['Produto'].fillna("Produto Desconhecido")
        
        if 'Quantidade' in df.columns:
            df['Quantidade'] = pd.to_numeric(df['Quantidade'], errors='coerce').fillna(0)

        df = df[df['Receita_Real'] > 0]

        return {
            "mensagem": "Sucesso",
            "total_registros": len(df),
            "dados": df.to_dict(orient="records")
        }

    except Exception as e:
        print(f"Erro: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar o arquivo.")

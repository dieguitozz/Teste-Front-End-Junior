from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def limpar_moeda(valor):
    if pd.isna(valor) or valor == "":
        return 0.0
    if isinstance(valor, (int, float)):
        return float(valor)
    valor_str = str(valor).strip()
    try:
        if 'R$' in valor_str:
            limpo = valor_str.replace('R$', '').strip().replace('.', '').replace(',', '.')
            return float(limpo)
        else:
            return float(valor_str)
    except ValueError:
        return 0.0

def converter_data_flexivel(data):
    if pd.isna(data):
        return pd.NaT
    data_str = str(data).strip()
    try:
        return pd.to_datetime(data_str, format='%Y-%m-%d')
    except:
        pass
    try:
        return pd.to_datetime(data_str, format='%d-%m-%Y')
    except:
        pass
    try:
        return pd.to_datetime(data_str, format='%d/%m/%Y')
    except:
        return pd.NaT

@app.post("/upload")
async def processar_planilha(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Apenas arquivos Excel são permitidos.")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        df.columns = df.columns.str.strip()

        if 'Data' in df.columns:
            df['Data'] = df['Data'].apply(converter_data_flexivel)
            df = df.dropna(subset=['Data'])
            df['Data_Formatada'] = df['Data'].dt.strftime('%d/%m/%Y')
            df['Mes_Ano'] = df['Data'].dt.strftime('%Y-%m') 

        if 'Categoria' in df.columns:
            df['Categoria'] = df['Categoria'].astype(str).str.title().str.strip()
            df['Categoria'] = df['Categoria'].replace({'Servicos': 'Serviços', 'Assinatu': 'Assinatura'})

        if 'Receita' in df.columns:
            df['Receita_Real'] = df['Receita'].apply(limpar_moeda)
        
        if 'Produto' in df.columns:
            df['Produto'] = df['Produto'].fillna("Produto Desconhecido").astype(str)
            
            if 'Codigo_Produto' in df.columns:
                df['Codigo_Produto'] = df['Codigo_Produto'].astype(str)
                
                mask_invertido = df['Produto'].str.contains('-', na=False) & ~df['Codigo_Produto'].str.contains('-', na=False)
                
                df.loc[mask_invertido, ['Produto', 'Codigo_Produto']] = df.loc[mask_invertido, ['Codigo_Produto', 'Produto']].values

        if 'Quantidade' in df.columns:
            df['Quantidade'] = pd.to_numeric(df['Quantidade'], errors='coerce').fillna(0)

        df = df[df['Receita_Real'] > 0]
        df = df.sort_values(by='Data')

        return {
            "mensagem": "Sucesso",
            "total_registros": len(df),
            "dados": df.to_dict(orient="records")
        }

    except Exception as e:
        print(f"Erro: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar o arquivo.")
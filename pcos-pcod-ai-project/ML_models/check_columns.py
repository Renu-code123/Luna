import pandas as pd
import glob
import os

dataset_path = '../Dataset/'
datasets = glob.glob(os.path.join(dataset_path, '*.csv'))
datasets += glob.glob(os.path.join(dataset_path, '*.xlsx'))

for d in datasets:
    try:
        if d.endswith('.csv'):
            df = pd.read_csv(d, nrows=1)
        else:
            df = pd.read_excel(d, nrows=1)
        print(f"File: {os.path.basename(d)}")
        print(f"Columns: {df.columns.tolist()}")
        print("-" * 30)
    except Exception as e:
        print(f"Error reading {d}: {e}")

import sys
import pandas as pd

sourceCSv = pd.read_csv(sys.argv[1])

keep_col = ['Nume produs', 'Pret final', 'Categorie', 'Subcategorie', 'URL', 'URL img', 'Brand', 'In stoc', 'Pret original', 'Promotie']
targetCsv = sourceCSv[keep_col]

targetCsv.to_csv(sys.argv[1], index=False)
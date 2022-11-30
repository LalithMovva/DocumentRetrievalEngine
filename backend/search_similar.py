#import required packages
from transformers import AutoTokenizer, AutoModel
import torch
import requests
from datasets import Dataset
from bs4 import BeautifulSoup
from flask import Flask, request, render_template, jsonify, send_file
from flask_cors import CORS
import os
import pickle
from io import BytesIO

app = Flask(__name__)
CORS(app)

tokenizer = AutoTokenizer.from_pretrained('allenai/specter')
model = AutoModel.from_pretrained('allenai/specter')

#global tokenizer
#global model
text_list_map = {}
dataset1 = Dataset.from_dict({})
pdfs_list = []
#folder_dir = ""


# folder_dir = "/Users/lalithmovva/Downloads/docus"

# text_list = []
# for docu in os.listdir(folder_dir):
#   GROBID_URL = 'https://cloud.science-miner.com/grobid/' 
#   url = '%s/api/processFulltextDocument' % GROBID_URL
#   xml = requests.post(url, files={'input': open(folder_dir+'/'+docu, 'rb')}).text
#   soup = BeautifulSoup(xml, 'xml')

#   names_abs = soup.find_all('abstract')

# #for name in names_abs:
# #    print(name.text)
#   abs = names_abs[0].text
#   names_title = soup.find_all('title')
#   tit = names_title[0].text
#   text_list.append(tit+'[SEP]'+abs)

# my_dict = {'text': text_list}
# dataset1 = Dataset.from_dict(my_dict)

# ds_with_embeddings1 = dataset1.map(
#     lambda example: {'embeddings':convert_text_to_embeddings(example['text'])}, batched=True, batch_size=64)
# ds_with_embeddings1.add_faiss_index(column='embeddings')
# ds_with_embeddings1.save_faiss_index('embeddings', 'saved_index.faiss')

# import pickle
# with open('saved_dictionary.pkl', 'wb') as f:
#     pickle.dump(my_dict, f)


#load dataset and faiss index
#def load_dataset():
    #pdfs_list = []
folder_dir = "./docus"
for pdf in os.listdir(folder_dir):
  pdfs_list.append(folder_dir+'/'+pdf)

with open('saved_dictionary.pkl', 'rb') as handle:
  text_list_map = pickle.load(handle)
    #text_list_map = {'text': text_list}
dataset1 = Dataset.from_dict(text_list_map)
dataset1.load_faiss_index('embeddings', 'saved_index.faiss')

#initialize model so that the model need not to load everytime
#def initialize_model():
  

#convert pdf file to required text(title + abstract)
def pdf_to_text(file_path):
  GROBID_URL = 'https://cloud.science-miner.com/grobid/' 
  url = '%s/api/processFulltextDocument' % GROBID_URL
  xml = requests.post(url, files={'input': open(file_path, 'rb')}).text
  #xml = requests.post(url, files={'input': file}).text

  soup = BeautifulSoup(xml, 'xml')

  names_title = soup.find_all('title')
  title = names_title[0].text

  names_abs = soup.find_all('abstract')
  abstract = names_abs[0].text

  return title+'[SEP]'+abstract

#convert the text to embeddings 
def convert_text_to_embeddings(text):
  inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=512)
  result = model(**inputs)

  embeddings = result.last_hidden_state[:, 0, :]
  return embeddings

#search the similar file when a text is given as input
def search(text):
  prompt1 = convert_text_to_embeddings(text)
  scores1, retrieved_examples1 = dataset1.get_nearest_examples('embeddings', prompt1.detach().numpy(), k=3)
  return pdfs_list[text_list_map['text'].index(retrieved_examples1['text'][0])]

#find the similar document when the file_path is given as input
@app.route('/api/uploadfile', methods=['GET', 'POST'])
def find_document():
  intxt = request.files['File']
    #print("Hi2")
    #print(intxt.filename)
  file_bytes = intxt.read()
  file_content = BytesIO(file_bytes).readlines()
    #print(file_content)
  file = open('temporary.pdf', 'wb')
  for line in file_content:
      file.write(line)
  file.close()
  text = pdf_to_text('temporary.pdf')
  os.remove('temporary.pdf')
  result = search(text)
  return send_file(result, mimetype="application/pdf")

#initialize_model()
#load_dataset()

if __name__ == "__main__":
    
    app.run(host ='0.0.0.0', port=8080, debug=True)
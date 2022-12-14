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
from pathlib import Path
from botocore.exceptions import ClientError
import logging

app = Flask(__name__)
CORS(app) 

tokenizer = AutoTokenizer.from_pretrained('allenai/specter')
model = AutoModel.from_pretrained('allenai/specter')

import boto3
s3 = boto3.client('s3',
                    aws_access_key_id='',
                    aws_secret_access_key= '',
                    aws_session_token=''
                     )
BUCKET_NAME='document-retreival-dcsc'

#convert the text to embeddings 
def convert_text_to_embeddings(text):
  inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt", max_length=512)
  result = model(**inputs)

  embeddings = result.last_hidden_state[:, 0, :]
  return embeddings

#global tokenizer
#global model
text_list_map = {}
dataset1 = Dataset.from_dict({})
pdfs_list = []
#folder_dir = ""



my_file = Path("saved_index.faiss")
if not my_file.is_file():
  folder_dir = "./docus"
  files_list = []
  text_list = []
  for docu in os.listdir(folder_dir):
    GROBID_URL = 'http://localhost:8070' 
    url = '%s/api/processFulltextDocument' % GROBID_URL
    xml = requests.post(url, files={'input': open(folder_dir+'/'+docu, 'rb')}).text
    soup = BeautifulSoup(xml, 'xml')
    files_list.append(docu)
    names_abs = soup.find_all('abstract')
    # print(xml)

  #for name in names_abs:
  #    print(name.text)
    abs = names_abs[0].text
    names_title = soup.find_all('title')
    tit = names_title[0].text
    text_list.append(tit+'[SEP]'+abs)

  my_dict = {'text': text_list, 'location': files_list}
  dataset1 = Dataset.from_dict(my_dict)

  ds_with_embeddings1 = dataset1.map(
      lambda example: {'embeddings':convert_text_to_embeddings(example['text'])}, batched=True, batch_size=64)
  ds_with_embeddings1.add_faiss_index(column='embeddings')
  ds_with_embeddings1.save_faiss_index('embeddings', 'saved_index.faiss')

  import pickle
  with open('saved_dictionary.pkl', 'wb') as f:
      pickle.dump(my_dict, f)



#load dataset and faiss index
#def load_dataset():
    #pdfs_list = []
folder_dir = "./docus"
for pdf in os.listdir(folder_dir):
  pdfs_list.append(pdf)

with open('saved_dictionary.pkl', 'rb') as handle:
  text_list_map = pickle.load(handle)
    #text_list_map = {'text': text_list}
dataset1 = Dataset.from_dict(text_list_map)
dataset1.load_faiss_index('embeddings', 'saved_index.faiss')

#initialize model so that the model need not to load everytime
#def initialize_model():
  

#convert pdf file to required text(title + abstract)
def pdf_to_text(file_path):
  GROBID_URL = 'http://localhost:8070' 
  url = '%s/api/processFulltextDocument' % GROBID_URL
  xml = requests.post(url, files={'input': open(file_path, 'rb')}).text
  #xml = requests.post(url, files={'input': file}).text

  soup = BeautifulSoup(xml, 'xml')

  names_title = soup.find_all('title')
  title = names_title[0].text

  names_abs = soup.find_all('abstract')
  abstract = names_abs[0].text

  return (title,title+'[SEP]'+abstract)


#search the similar file when a text is given as input
def search(text):
  prompt1 = convert_text_to_embeddings(text)
  scores1, retrieved_examples1 = dataset1.get_nearest_examples('embeddings', prompt1.detach().numpy(), k=2)
  return (scores1[0],text_list_map['location'][text_list_map['text'].index(retrieved_examples1['text'][0])],scores1[1],text_list_map['location'][text_list_map['text'].index(retrieved_examples1['text'][1])])

#find the similar document when the file_path is given as input
@app.route('/api/uploadfile', methods=['GET', 'POST'])
def find_document():
  intxt = request.files['File']
  print("Hi")
    #print("Hi2")
    #print(intxt.filename)
  file_bytes = intxt.read()
  file_content = BytesIO(file_bytes).readlines()
    #print(file_content)
  file = open('temporary.pdf', 'wb')
  for line in file_content:
      file.write(line)
  file.close()
  title,text = pdf_to_text('temporary.pdf')
  result = search(text)
  print(result[0])
  print(result[2])
  os.rename('temporary.pdf',title + '.pdf')
  s3.upload_file(
                    Bucket = BUCKET_NAME,
                    Filename='./'+  title + '.pdf',
                    Key = title + '.pdf'
                )
  os.remove(title + '.pdf')
  print(result[1])
  print(result[3])
  response1=""
  response2=""
  try:
    response1 = s3.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME,
                                                            'Key': result[1]},
                                                    ExpiresIn=3000)
    response2 = s3.generate_presigned_url('get_object',
                                                    Params={'Bucket': BUCKET_NAME,
                                                            'Key': result[3]},
                                                    ExpiresIn=3000)                                                
    print(response1)
    print(response2)                                              
  except ClientError as e:
        logging.error(e)                                            
  jsonResponse = {
    "pdf1Name" :result[1],
    "score1":int(result[0]),
    "pdf1Link": response1,
    "pdf2Name":result[3],
    "score2":int(result[2]),
    "pdf2Link": response2,
  }
  # s3.download_file(
  #   Bucket=BUCKET_NAME, Key=result[1], Filename="download/" + result[1]
  #   )
  # s3.download_file(
  #   Bucket=BUCKET_NAME, Key=result[3], Filename="download/" + result[3]
  #   )
  #result = search(text)
  #return send_file(result, mimetype="application/pdf")
  return jsonify(jsonResponse)

#initialize_model()
#load_dataset()

if __name__ == "__main__":
  app.run(host ='0.0.0.0', port=8080, debug=True)

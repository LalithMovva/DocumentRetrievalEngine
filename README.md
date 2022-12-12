
The goal of this project is to build a Document retrieval engine where a user uploads a document and a set of relevant documents will be retrieved from the database. We will convert all the documents available in the repository to embeddings(document-level embeddings). We will create a search index for all the embeddings using Facebook AI Similarity Search (FAISS).  When a query/document is given as input, it will be converted to an embedding and it will be used for similarity search. Once a user uploads a pdf, the input details related to pdf are posted to the application via REST API, and after processing at backend, similar pdfs are displayed for the user.

Software:

Python Flask

Docker

React

AWS S3

Grobid(GeneRation Of BIbliographic Data.)

SPECTER (Transformer based NLP model)

Facebook AI Similarity Search 

Kubernetes

Firebase










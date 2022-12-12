FROM python:3.9
COPY /backend /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 8080
ENTRYPOINT [ "python" ]
CMD [ "search_similar.py" ]

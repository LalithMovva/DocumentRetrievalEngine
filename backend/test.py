
import os
from pathlib import Path

def main():
    folder_dir = "./docus/"
    for docu in os.listdir(folder_dir):
        print(docu)

main()
# Define o tamanho do arquivo em bytes (10GB)
file_size = 10000 * 1024 * 1024  # 10 GB

# Linha que será escrita repetidas vezes no arquivo
line = "This is a line of text to be transformed. Adding more text to increase the size of each line.\n"

# Calcula o número de linhas necessárias para preencher o arquivo
num_lines = file_size // len(line)

# Cria e escreve o arquivo
file_path = "large-input.txt"
with open(file_path, "w") as file:
    for _ in range(num_lines):
        file.write(line)

print(f"File created successfully at {file_path}")

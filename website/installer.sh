#!/bin/bash

# Função para imprimir mensagens coloridas
print_msg() {
    echo -e "\e[1;32m$1\e[0m"
}

# Atualiza a lista de pacotes e faz atualizações automáticas
print_msg "Atualizando pacotes e fazendo atualizações automáticas..."
sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y

# Instala pacotes essenciais
print_msg "Instalando Nginx, PM2, Node.js LTS, Micro, cURL e PostgreSQL..."
sudo apt install -y nginx pm2 curl postgresql
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn pnpm

# Configura Git globalmente
print_msg "Configurando Git..."
read -p "Digite seu nome de usuário Git: " git_user
read -p "Digite seu email Git: " git_email
git config --global user.name "$git_user"
git config --global user.email "$git_email"
git config --global credential.helper store

# Configura inicialização automática de Nginx, PostgreSQL e PM2
print_msg "Configurando inicialização automática de serviços..."
sudo systemctl enable nginx postgresql
sudo pm2 startup
pm2 save

# Configura sudo sem senha
print_msg "Configurando sudo sem senha..."
sudo_user=$(whoami)
echo "$sudo_user ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/nopasswd

# Clona repositório Next.js
read -p "Digite o nome de usuário do repositório: " repo_user
read -p "Digite o nome do repositório: " repo_name
git clone "https://github.com/$repo_user/$repo_name.git" ~/"$repo_name"

# Cria aliases
print_msg "Criando aliases..."
cat <<EOL >> ~/.bashrc
alias cls="clear"
alias mka="micro ~/.bashrc"
alias sva="source ~/.bashrc"
alias sudo="sudo "
build() {
    cd ~/"\$1"
    yarn build
}
start() {
    cd ~/"\$1"
    pm2 start yarn --name "\$1" -- start
}
stop() {
    pm2 stop "\$1"
}
update() {
    cd ~/"\$1"
    git pull
    build "\$1"
    pm2 restart "\$1"
}
env() {
    micro ~/"\$1/.env"
}
edng() {
    micro /etc/nginx/sites-available/"\$1"
}
EOL
source ~/.bashrc

# Executa alias "build"
print_msg "Executando 'build'..."
build "$repo_name"

# Executa "init" na porta 8080
print_msg "Executando 'init'..."
start "$repo_name" 8080

# Cria arquivo de configuração Nginx
read -p "Digite o domínio para configurar o Nginx: " domain
sudo tee "/etc/nginx/sites-available/$domain" >/dev/null <<EOL
server {
    listen 80;
    listen [::]:80;
    server_name $domain;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Ativa configuração Nginx e reinicia
sudo ln -s /etc/nginx/sites-available/"$domain" /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Agendamento diário para "update"
print_msg "Agendando 'update' diariamente..."
(crontab -l ; echo "0 * * * * ~/update.sh") | crontab -

# Mensagem de sucesso
print_msg "Configuração concluída com sucesso!"

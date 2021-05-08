docker.exe run --name gostack_gobarber -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker.exe run --name mongodb -p 27017:27017 -d -t mongo
docker.exe run --name redis -p 6379:6379 -d -t redis:alpine
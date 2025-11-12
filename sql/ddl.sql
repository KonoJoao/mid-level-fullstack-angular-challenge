CREATE table cliente (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
nome VARCHAR(120) NOT NULL,
email VARCHAR(120) NOT NULL UNIQUE,
telefone VARCHAR(20),
criado_em timestamp default now()
);

CREATE TYPE status_pedido as ENUM('PENDENTE','APROVADO','CANCELADO');

CREATE table pedido (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
cliente_id UUID REFERENCES cliente(id),
data_pedido timestamp NOT NULL,
status status_pedido NOT NULL,
valor_total DECIMAL(10,2) not null
);


CREATE table pedido_item (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
pedido_id UUID REFERENCES pedido(id),
produto_nome VARCHAR(120) NOT NULL,
quantidade INT4 NOT NULL,
preco_unitario DECIMAL(10,2) not null
)

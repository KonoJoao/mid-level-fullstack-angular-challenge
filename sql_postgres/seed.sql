INSERT INTO cliente (nome, email, telefone) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-1234'),
('Maria Santos', 'maria.santos@email.com', '(11) 98888-5678'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 97777-9012'),
('Ana Costa', 'ana.costa@email.com', '(11) 96666-3456'),
('Carlos Souza', 'carlos.souza@email.com', '(11) 95555-7890');

INSERT INTO pedido (cliente_id, data_pedido, status, valor_total) VALUES
((SELECT id FROM cliente WHERE email = 'joao.silva@email.com'), '2024-01-15 10:30:00', 'APROVADO', 350.50),
((SELECT id FROM cliente WHERE email = 'joao.silva@email.com'), '2024-01-20 14:15:00', 'PENDENTE', 120.75),
((SELECT id FROM cliente WHERE email = 'maria.santos@email.com'), '2024-01-18 09:45:00', 'APROVADO', 890.25),
((SELECT id FROM cliente WHERE email = 'pedro.oliveira@email.com'), '2024-01-22 16:20:00', 'CANCELADO', 45.90),
((SELECT id FROM cliente WHERE email = 'ana.costa@email.com'), '2024-01-25 11:10:00', 'APROVADO', 560.80);
((SELECT id FROM cliente WHERE email = 'ana.costa@email.com'), '2025-10-25 11:10:00', 'APROVADO', 560.80);
((SELECT id FROM cliente WHERE email = 'ana.costa@email.com'), '2025-10-25 11:10:00', 'APROVADO', 580.80);

INSERT INTO pedido_item (pedido_id, produto_nome, quantidade, preco_unitario) VALUES
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'joao.silva@email.com') AND data_pedido = '2024-01-15 10:30:00'), 'Notebook Dell', 1, 2500.00),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'joao.silva@email.com') AND data_pedido = '2024-01-15 10:30:00'), 'Mouse Wireless', 1, 50.50),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'joao.silva@email.com') AND data_pedido = '2024-01-20 14:15:00'), 'Teclado Mecânico', 1, 120.75),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'maria.santos@email.com') AND data_pedido = '2024-01-18 09:45:00'), 'Monitor 24"', 2, 395.00),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'maria.santos@email.com') AND data_pedido = '2024-01-18 09:45:00'), 'Cabo HDMI', 1, 25.25),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'maria.santos@email.com') AND data_pedido = '2024-01-18 09:45:00'), 'Suporte para Monitor', 1, 75.00),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'pedro.oliveira@email.com') AND data_pedido = '2024-01-22 16:20:00'), 'Fone de Ouvido', 1, 45.90),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'ana.costa@email.com') AND data_pedido = '2024-01-25 11:10:00'), 'Tablet Samsung', 1, 450.00),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'ana.costa@email.com') AND data_pedido = '2024-01-25 11:10:00'), 'Capa para Tablet', 1, 35.80),
((SELECT id FROM pedido WHERE cliente_id = (SELECT id FROM cliente WHERE email = 'ana.costa@email.com') AND data_pedido = '2024-01-25 11:10:00'), 'Caneta Stylus', 2, 37.50);

-- Listar todos os pedidos com nome do cliente e valor total.
SELECT ped.valor_total, cli.nome
FROM pedido as ped
INNER JOIN cliente as cli
on cli.id = ped.cliente_id
-- Seleção do valor total do pedido junto ao nome do cliente por meio de um join da
-- tabela de pedido, usando a FK client_id, com a tabela de cliente, usando a PK id

-- Obter o total de vendas (soma de valor_total) por cliente, ordenando do maior para o menor.
SELECT SUM(ped.valor_total) as valor_total, cli.nome, cli.id
FROM pedido as ped
INNER JOIN cliente as cli
on cli.id = ped.cliente_id
GROUP BY cli.nome, cli.id
ORDER BY valor_total DESC
-- Seleção com função agregadora somando o valor total da vendas e agrupando por id do client
-- trago por join com a tabela de cliente

-- Listar clientes que ainda não realizaram nenhum pedido.
SELECT * FROM cliente
WHERE id NOT IN(
    SELECT cli.id
    FROM pedido as ped
    INNER JOIN cliente as cli
    on cli.id = ped.cliente_id)
-- Seleção de clientes, retirando clientes que já tem seu id vinculado a algum pedido
-- na tabela de pedidos por meio de subselect e cláusula NOT IN

-- Exibir o ticket médio (média de valor_total) de pedidos aprovados no último mês.
SELECT COALESCE(AVG(ped.valor_total), 0)
FROM pedido as ped
WHERE ped.status = 'APROVADO'
AND data_pedido >= CURRENT_DATE - INTERVAL '1 month';
-- É feito uma seleção com função agregadora de cálculo de média dos pedidos de status 'APROVADO' e no intervalo
-- definido de até 1 mês

-- Listar todos os pedidos cujo valor_total não corresponde à soma de (quantidade × preço_unitário) nos itens.
SELECT *
FROM pedido ped
INNER JOIN (
    SELECT SUM (pedi.quantidade * pedi.preco_unitario) as valor_calculado,
    pedi.pedido_id
    FROM pedido_item pedi
    GROUP BY pedi.pedido_id) as peditem
ON ped.id = peditem.pedido_id
WHERE ped.valor_total <> peditem.valor_calculado
-- É feito uma seleção com função agregadora de soma na tabela de pedido_item, juntamente a um join na tabela de pedido
-- e uma condicional para verificação da paridade do valor somado e o valor gravado de fato

-- Buscar o produto mais vendido (soma de quandades) no último trimestre.
SELECT MAX(ped_item_quantity_sum.soma_quantidades) quantidade_vendida,
ped_item_quantity_sum.produto_nome,
ped_item_quantity_sum.id
FROM (
    SELECT ped.produto_nome, ped.id, SUM(ped.quantidade) as soma_quantidades
    FROM pedido_item ped
    WHERE ped.pedido_id IN(
        SELECT ped.id
        FROM pedido ped
        WHERE ped.data_pedido >= NOW() - INTERVAL '3 months')
        GROUP BY ped.produto_nome, ped.id) as ped_item_quantity_sum
GROUP BY ped_item_quantity_sum.produto_nome, ped_item_quantity_sum.id
ORDER BY quantidade_vendida DESC
LIMIT 1
-- É feito uma selação na tabela de pedidos para verificar os que foram feitos no ultimo trimestre
-- São selecionados e somados as quantidades dos produtos vinculados a esses pedidos, agrupando por produto
-- É cálculado o produto com mais pedidos com função agregadora MAX e seu resultado é retornado

# 3Dream Project — demonstração

Protótipo de apresentação. Não é uma loja pronta para vendas reais.

## Implementado
- Frontend responsivo React, catálogo, busca, filtro, ordenação, detalhes e carrinho.
- API GET/POST /api/demo, preços calculados no servidor, validação de saldo e quantidade.
- Pedidos e estoque de teste persistidos no D1, isolados por cookie de sessão.
- Controle otimista de concorrência por versão para evitar sobrescritas e saldos negativos.
- Simulação de venda física, reposição, histórico e reinício.

## Apresentação
1. Explore os produtos e abra um detalhe.
2. Abra “Explorar painel”. Venda uma A1 mini (saldo inicial 1).
3. Feche o painel e veja o produto esgotado.
4. Reponha 5 unidades pelo painel.
5. Adicione um produto à sacola, crie um pedido de teste e veja-o no painel.

## Limites
Bling e pagamentos não estão conectados. Valores e quantidades são ilustrativos.
Checkout somente com retirada demonstrativa, sem coleta de dados pessoais.
Não há cálculo real de frete, autenticação de lojista, nota fiscal, cancelamento ou estorno real.
O painel é deliberadamente acessível nesta demo privada; exige autenticação e papéis para produção.
A abertura usa vídeo do produto em loop; a seção seguinte usa vídeo controlado pela rolagem. Há fallback estático para preferência de movimento reduzido.
O cookie é válido por 7 dias. Dados são por sessão/navegador, não uma operação compartilhada entre funcionários.
Usa tema conceitual próprio, sem afirmar identidade visual aprovada.

## Imagens
Fotografias de produto para referência visual provenientes das páginas públicas de 3DJake:
https://www.3djake.de/bambu-lab/a1-combo
https://www.3djake.de/bambu-lab/a1-mini
https://www.3djake.de/bambu-lab/p1s
https://www.3djake.de/bambu-lab/pla-basic-black
Confirmar autorização de uso e substituir por assets da loja/fabricante antes do lançamento comercial.
Filamento verde é uma representação gráfica CSS.

## Produção futura
Validar cadastro, variações, depósitos e reservas no Bling; implementar autorização OAuth,
webhooks assinados/idempotentes, reconciliação de saldo, importação de pedidos e controles operacionais.
Contratar/configurar pagamento e logística. Rever políticas e tratamento de dados.

## Atualização visual 02
Logo original recuperado do site da 3Dream. Paleta vermelha, preta e branca.
Vídeos do produto obtidos no CDN público da Bambu Lab, descobertos na página de produto da Reset Argentina:
https://store.bblcdn.com/daee45d440704568912668d656d9f169.mp4
https://store.bblcdn.com/c77b8e3b71344fb982047f3b862fa748.mp4
Confirmar autorização do material promocional antes da publicação comercial. Não são filmagens da loja.

## Atualização visual 03
Abertura simplificada: vídeo silencioso em loop, frase e CTA único. Removidos controles visíveis, indicadores, instruções de movimento e seção de vídeo duplicada. O painel e a identificação da demonstração permanecem no rodapé. Movimento reduzido usa poster estático.

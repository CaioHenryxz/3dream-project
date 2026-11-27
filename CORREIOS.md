# Cotação de frete — configuração pendente

O conector usa as APIs oficiais Token, Preço e Prazo. Sem configuração retorna NOT_CONFIGURED, sem estimar ou inventar valores. Formulários no detalhe do produto e carrinho. O checkout do protótipo continua exclusivo para retirada, sem cobrança real; as consultas não selecionam entrega nem alteram o total do pedido.

## Configuração no servidor
Não colocar segredos no frontend nem no repositório.

- CORREIOS_USER: usuário do Meu Correios.
- CORREIOS_API_KEY: código de acesso às APIs do CWS, não a senha do site.
- CORREIOS_POSTING_CARD: cartão de postagem.
- CORREIOS_ORIGIN_CEP: CEP real de expedição, 8 dígitos.
- CORREIOS_CONTRACT e CORREIOS_DR: dados opcionais do contrato, configurar juntos.
- CORREIOS_ENV: homologation inicialmente; production somente após homologação.
- CORREIOS_SERVICES_JSON: array com code (5 dígitos do serviço contratado) e name. Não assumir que os mesmos códigos atendem todos os contratos.
- CORREIOS_PACKAGES_JSON: objeto indexado pelo ID de cada produto, com weight em gramas, length, width e height em cm. Usar peso bruto e dimensões externas da embalagem confirmados pela loja. Nenhuma medida fictícia foi incluída.

Estrutura sem valores: {"id-do-produto":{"weight":PESO_GRAMAS,"length":COMPRIMENTO_CM,"width":LARGURA_CM,"height":ALTURA_CM}}.

Cada unidade é cotada em pacote individual; valores somados. Aprovar essa política com a loja antes de produção. Até 10 unidades por consulta; volumes maiores encaminhados para atendimento. Embalagem ausente e serviços indisponíveis não geram preço. Prazos exibidos conforme a API, sem assumir dias úteis; contados a partir da postagem, sem preparação. Restrições de entrega domiciliar aparecem no resultado.

Credenciais e medidas ainda não recebidas; NÃO homologado com uma conta real. Autenticação, preços e prazos cobertos apenas por testes com respostas controladas. Antes de ativar comercialmente: validar fretes com o contrato real, configurar proteção de taxa persistente na borda, seguro/valor declarado conforme política, embalagem e limites; implementar endereço de entrega e recotação no checkout antes de cobrança. Mercado Pago e Bling continuam pendentes.

## Referências oficiais
https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1
https://www.correios.com.br/atendimento/developers/manuais/manual-api-prazo
https://www.correios.com.br/atendimento/developers/manuais/manual-uso-da-api-token

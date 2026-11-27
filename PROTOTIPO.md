# Protótipo de e-commerce 3Dream Project

## Escopo para aprovação
Identidade em branco e vermelho, logo e imagem A1 fornecidos pelo cliente, organização inspirada na referência Artbox. Catálogo por marcas, pesquisa, filtros, favoritos, detalhes, variação de cor Elegoo, carrinho, checkout simulado, conta do cliente e painel administrativo.

## Como demonstrar
- Cliente: cliente@3dream.demo / demo1234
- Administrador: admin@3dream.demo / demo1234
Esses acessos são públicos e demonstrativos. NÃO constituem autenticação de produção.
O servidor armazena o perfil de teste por sessão e exige o perfil admin para editar catálogo/status/estoque. Dados são isolados por navegador, não compartilhados entre clientes ou funcionários.

1. Adicione uma A1 Combo e um filamento ao carrinho.
2. Avance ao checkout e entre com o cliente de teste.
3. Escolha Pix ou cartão (valores distintos conforme a referência), retirada e simule o pedido.
4. Veja o pedido em Minha conta.
5. Use Área administrativa no rodapé, entre como admin e veja o pedido.
6. Edite preços/saldo em Produtos. A vitrine considera os valores do servidor.
7. Altere o status ou cancele um pedido. Cancelamento devolve saldo uma única vez.

## Fontes dos produtos
Preços das impressoras: imagem da tabela enviada em 06/10/2026. A coluna SITE PRÓPRIO foi usada como referência Pix, a confirmar com a empresa. Preços dos filamentos: portfólio de setembro enviado pelo usuário. Imagens dos filamentos extraídas do próprio PDF, preservando máscaras de transparência. Os estoques são fictícios para apresentação; não correspondem às quantidades da planilha/Bling.
As imagens Sunlu representam amostras de cor, conforme o catálogo.
A quantidade/peso das embalagens deve ser confirmada antes de publicar produtos para venda.

## Próximas integrações (não implementadas)
- Cadastro/login seguro de clientes e admin, recuperação de senha, autorização por usuário e sessão de produção.
- Mercado Pago: credenciais, preferências/pagamentos, webhooks, confirmação idempotente, cancelamentos e reembolsos. Não há cobrança ou QR Code real neste protótipo.
- Bling: OAuth, depósitos, produtos/variações, estoque, pedidos, reservas e reconciliação.
- Frete, endereços, nota fiscal, políticas, dados pessoais, comunicação de pedidos.

## Verificação
TypeScript e build de produção. Testes de API com banco simulado para permissões, login, quantidades, cálculo servidor, cancelamento e restituição única. Sem revisão automatizada no navegador disponível neste ambiente.

## Atualização do destaque com material do cliente
- Imagem e vídeo conceituais enviados pelo cliente em 07/10/2026, usados como comunicação da marca, sem atribuir modelo ou preço à máquina gerada.
- Filme otimizado em H.264, sem faixa de áudio e com retorno de câmera para um loop contínuo; sem controles visuais.
- Imagem estática para preferência de movimento reduzido, falha de reprodução e carregamento inicial. Vídeo pausado fora da tela ou com a aba em segundo plano.
- Fotos e valores dos produtos permanecem separados da composição conceitual.
- Verificação por TypeScript e build de produção; revisão visual em navegador indisponível neste ambiente.

- Ajuste solicitado pelo cliente: vídeo visível também com preferência de movimento reduzido, mantendo pausa fora da tela. Logo reenquadrada para mostrar PROJECT por inteiro. Arquivo MP4 publicado verificado por HTTP e assinatura do arquivo.

- Novo vídeo fornecido em 07/10: reprodução a 50% da velocidade, sem áudio, loop de aproximadamente 18 segundos com dissolução circular de 2 segundos; poster extraído do próprio vídeo.

## Revisão de compra e frete
Vídeo em velocidade original com loop de 9 segundos e dissolução circular de 1 segundo. Categorias visuais, atalhos de catálogo, botões e textos mobile maiores. Calculadora no produto/carrinho com conector oficial Correios no servidor, aguardando configuração real. Consulte CORREIOS.md. Checkout permanece com retirada; cotações não alteram pedidos. Testes do adaptador com respostas controladas e TypeScript; sem teste de integração real ou revisão visual no navegador.

## Portfólio completo de filamentos
Importado o PDF de setembro enviado pelo cliente, 35 páginas. 232 opções únicas de filamentos em 25 famílias: Elegoo 84, Bambu Lab 26, National 3D 33, Multfila 6, Polymaker 18, Sunlu 64 e F3D 1. A repetição de Elegoo PLA Silk Vermelho na página 10 foi unificada. A página 24 é de acessórios, fora deste pedido de filamentos. A página de resumo menciona materiais sem ficha comercial; não foram inventados produtos para esses nomes.

Imagens extraídas do próprio PDF, usando os recortes renderizados nas páginas com imagens compostas; dados e rastreabilidade em lib/filaments.json, script reproduzível em scripts/import-filaments.py. PDF de origem disponível pelo detalhe de cada produto. Preço total no cartão preservado, sem interpretar como valor de parcela. Correção National 3D: R$112,00 no cartão. Nenhum peso de embalagem inferido.

Novas opções sem estoque confirmado: consultar disponibilidade. Estoques previamente editados em uma sessão de demonstração permanecem ilustrativos. Administrador pode atribuir estoque de teste. Seleção de cor por família, filtros de material completos, carregamento de 24 itens por vez. Três impressoras preservadas. Nenhum acessório incluído nesta importação.

## Impressoras de setembro
Importação de 20 artes do ZIP fornecido: 12 modelos de impressoras e 7 acessórios. Duas artes Snapmaker U1 agrupadas no mesmo cadastro. A1 Combo e A1 mini atualizadas com os novos preços; P1S anterior removida da vitrine pois o novo material apresenta P2S como outro modelo. Nomes como A2L e X2D transcritos exatamente do material, sem inferir especificações externas. A2L e A2L Combo identificadas como pré-reserva a confirmar.

Artes originais preservadas, disponíveis no detalhe. Filamentos preservados. Destaques agora selecionados por ID, evitando trocar produtos quando o catálogo cresce. Categoria Acessórios e marca Snapmaker incluídas. Não foi inferido estoque real, prazo de pré-venda nem pesos de embalagem.

Quatro acessórios possuem apenas preço Pix: cartão aparece como consulta e é bloqueado no pedido de demonstração até um administrador confirmar o preço. Campo numérico interno utiliza o preço Pix como placeholder, acompanhado de cardPriceConfirmed=false; nunca oferecido como preço de cartão ao comprador. Material comercial de referência sujeito à confirmação, sem promessa de desconto cumulativo ou parcelamento.

Validação: TypeScript e checagens de contagem, imagens, preços e disponibilidade. Revisão visual das artes recebidas; interface publicada não testada em navegador neste ambiente.

## Quantidade e ficha do produto
Seletor com botões e entrada numérica (1–100), subtotal Pix, quantidade já no carrinho e limite pelo saldo restante. Quantidade reinicia ao trocar de produto/cor; selecionar outra foto mantém a quantidade. Ao adicionar, abre o carrinho com o total de unidades solicitado. Cotação de frete recebe a quantidade selecionada e é invalidada ao alterá-la. Produtos sem estoque confirmado continuam em consulta e a mensagem inclui a quantidade desejada.

Ficha estruturada com campos realmente disponíveis no material: marca, categoria, linha/material, cor, diâmetro, extrusão, mesa e tensão quando informada. Foco contido na janela e restauração ao fechar; rolagem da página bloqueada durante consulta. TypeScript e limites de adição ao carrinho verificados; sem validação visual em navegador disponível neste ambiente.

## Menu mobile
Substituído o menu expandido abaixo da busca por um painel lateral nativo dialog, acima do cabeçalho fixo. Categorias em lista, marcas expansíveis, acesso à conta e atendimento. Fecha pelo botão, toque fora, Escape, escolha de destino ou mudança para desktop. Foco contido pelo dialog e devolvido ao botão; bloqueio de rolagem do fundo. Cabeçalho compacto, busca em linha própria e áreas de toque de 44px. Verificação TypeScript/build; revisão visual em navegador indisponível.

## Revisão da jornada — outubro de 2026
- Menu lateral nativo até 1024px; cabeçalho compacto e busca separada no celular; navegação horizontal em telas maiores. Breakpoints 360 / 750 / 1024px.
- Início → categorias / marcas → catálogo → detalhes com variantes, quantidade, subtotal, carrinho e atendimento WhatsApp em todos os produtos.
- Carrinho com totais por linha, quantidades limitadas, remoção, continuar comprando, simulação de finalização e acompanhamento do pedido. Retorno ao checkout após acesso demonstrativo.
- Área da conta com pedidos e etapas, preferências persistidas no backend da sessão, favoritos e pagamentos explicitamente simulados. Sem armazenamento de cartões.
- Login personalizado como página. Botão Google explicitamente indisponível; acesso demonstrativo separado. Não há OAuth Google implementado nem credenciais configuradas. A hospedagem Sites documenta sua autenticação gerenciada via ChatGPT; confirmar suporte a provedor externo ou adotar backend de identidade compatível antes de implementar Google OAuth. Não tratar entrada no modo de demonstração como login Google.
- Disponibilidade inicial: todos os produtos habilitados por solicitação da loja. Limite técnico ilustrativo de 100 unidades por SKU, migrado uma vez por sessão (`inventoryRevision: 2`), sem alegar quantidade física real. Bling ainda não conectado.
- Históricos da navegação principal usam fragmentos; carrinho e favoritos persistem neste navegador. Pedidos e preferências são da sessão de demonstração, não de uma conta real entre dispositivos.
- Verificação visual em navegadores indisponível nesta sessão. Não homologado em aparelhos físicos.

## Revisão de hierarquia da home
A revisão das cinco capturas do cliente mostrou banners de categorias, uma grade de oito marcas, duas seleções de produtos e três chamadas para filamentos competindo pelo mesmo destino. A home passa a ter vídeo, faixa discreta de atendimento/retirada, uma seleção de quatro produtos e ajuda compacta. Categorias e marcas ficam na navegação e filtros; marcas no desktop agora abrem um menu em vez de deslocar para uma seção removida. Removidos subtítulos redundantes nos cards. As artes promocionais fornecidas continuam nas impressoras; fotos isoladas sem preços seriam uma melhoria futura, pois a arte já inclui preços que também aparecem no card. Sem substituir por imagens incorretas ou cortar informação do material original.

## Páginas de produto e hierarquia de cor
- Produtos têm rota `/produto/[id]`, links nativos nos cards, abertura em outra aba, restauração ao recarregar e metadados próprios. IDs desconhecidos retornam not found. Histórico do navegador restaura o produto.
- Compra, quantidade, preço e atendimento no início da página. Detalhes expansíveis de entrega, descrição, especificações, pagamento e suporte. Sem inventar parcelamento, garantia, itens inclusos ou manuais.
- Vermelho da marca concentrado no preço, compra, links e estados ativos. Atendimento secundário neutro.
- A1 Combo usa foto limpa já fornecida, mantendo a arte original como imagem adicional. Demais impressoras preservam o material correto disponível.

## Abertura com maior destaque
Banner inicial com painel vermelho da marca, título branco em maior escala, acesso direto a impressoras e filamentos e vídeo existente no lado direito (abaixo do texto no celular). Conteúdo comercial em HTML, preservando legibilidade e evitando texto embutido no vídeo. Sem novas seções repetidas na home. Chamadas de compra da seleção ganham preenchimento vermelho. Vídeo mantém velocidade normal, áudio mudo e loop; poster fica visível quando reprodução não inicia.
Referências examinadas: Artbox (campanhas por finalidade e benefícios no topo) e Beehive (campanhas e destaques comerciais), sem replicar ofertas, imagens ou promessas comerciais dos concorrentes.

Ícone de bolsa substituído por carrinho de compras no cabeçalho, botão de compra e estado vazio, conforme orientação do cliente.

## Menu e conta — revisão de 9 de outubro
Referências de arquitetura: Nike (Minha Conta, pedidos e alteração de dados cadastrais) e Amazon (organização de pedidos, endereços e métodos de pagamento). Referências consultadas por conteúdo público, sem alegar testes de suas áreas autenticadas.
- Menu lateral com logo, acesso à conta em vermelho, categorias com ícones, marca expansível, estados ativos, favoritos e atendimento separados. Cabeçalho permanece fixo dentro do diálogo e conteúdo rola.
- Conta com visão geral, pedidos pesquisáveis e filtráveis, detalhes e etapas, favoritos com abrir/remover, um endereço fictício editável/removível, pagamentos e configurações. Histórico entre seções por fragmento `#account?tab=...`.
- Dados pessoais, newsletter e preferência Pix/cartão persistem na sessão D1 de demonstração. Preferência utilizada na simulação, com fallback Pix se algum produto não tiver preço de cartão confirmado.
- Validação do endereço também no backend: campos, CEP, UF, limites. Remoção possui confirmação inline; reset remove o endereço.
- Mercado Pago e Google continuam sem conexão real; sem cartões, cobranças, mensagens de newsletter ou entrega efetiva. Endereço salvo não altera retirada da simulação.
- Favoritos permanecem locais ao navegador. Pedidos são demonstrativos por sessão, não associados a uma identidade real.
- TypeScript/build e validação de endereço verificados; sem teste visual em navegador nesta sessão.

## Correção baseada nas capturas IMG_7230/31/32
As capturas eram da página de login: banner promocional em altura excessiva, texto sobreposto à impressora, mensagem de boas-vindas repetida, benefícios e rodapé competindo com a entrada. Login substituído por um único cartão compacto. Cabeçalho dessa tela mostra apenas logo, com retorno à loja no conteúdo; retirados busca, menu de categorias, promoções e rodapé comercial durante o login. Google permanece desabilitado e explicitamente em configuração, com entrada de demonstração separada. Nenhum banner ou texto sobre imagem na tela de acesso.


### Novo vídeo Bambu Lab
Vídeo enviado em 09/10 aplicado no hero, velocidade original, sem áudio, reprodução inline e loop com transição cruzada de 1 segundo. Poster atualizado para o mesmo vídeo.


### Revisão de 10/10 — referências M3D e 3D Prime
- Grid de produtos com posições consistentes de títulos, Pix, cartão e ação principal; atendimento secundário padronizado.
- Interface PT/EN/ES com escolha persistida no navegador e valores/chaves de filtros preservados; traduções técnicas do portfólio ainda devem passar por revisão editorial.
- Instagram e LinkedIn oficiais fornecidos pelo cliente no rodapé.
- Link para avaliações reais do perfil Google fornecido pelo cliente. Sem nota, contagem ou depoimentos inventados: leitura do Google bloqueada e integração de reviews não configurada.
- Imagens de estúdio em public/images/studio, marca-d’água com a logo original em camada de apresentação. Foto original preservada na galeria; objetos impressos são ilustrações e não itens inclusos.
- Validação por TypeScript/build; não houve inspeção visual em navegador nesta sessão.

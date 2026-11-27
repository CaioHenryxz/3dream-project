# Avaliações Google

O bloco inicial abre o perfil oficial fornecido pelo cliente. Não usa nota, quantidade nem depoimentos fictícios.

A rota `/api/reviews` está preparada para Places API (New). Para ativar, configurar no servidor:
- `GOOGLE_PLACES_API_KEY`: chave restrita à Places API, mantida em segredo no servidor.
- `GOOGLE_PLACE_ID`: Place ID da 3Dream Project em São José dos Campos; o identificador hexadecimal do link de pesquisa não é um Place ID.

A conta Google Cloud da loja deve ter a API e o faturamento configurados. Validar identidade da empresa, atribuições, política de privacidade/termos e requisitos da Google Maps Platform antes da ativação em produção. Nenhuma chamada faturável é feita sem as duas variáveis.

São exibidas até cinco avaliações retornadas pela API, com autoria e links. A rota não persiste avaliações e usa Cache-Control no-store. Falha de rede, configuração ausente ou perfil que não contenha 3Dream no nome mantém o link direto ao Google. Não filtra por nota nem fabrica avaliações.

Documentação: https://developers.google.com/maps/documentation/places/web-service/place-details

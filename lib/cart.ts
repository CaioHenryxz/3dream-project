export function addQuantity(cart:Record<string,number>,id:string,qty:number,stock:number){
 if(!Number.isInteger(qty)||qty<1||qty>100)throw new Error('Escolha uma quantidade inteira entre 1 e 100.');
 const total=(cart[id]||0)+qty;
 if(total>stock)throw new Error('A quantidade excede o saldo disponível, incluindo o que já está no carrinho.');
 if(total>100)throw new Error('Para mais de 100 unidades, consulte a equipe.');
 return {...cart,[id]:total};
}

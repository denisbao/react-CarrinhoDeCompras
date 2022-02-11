import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart') // Busca dados do localStorage

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart]; // cópia de segurança do estado "cart"
      const productExists = updatedCart.find(product => product.id === productId); // verifica se o produto em questão já existe no carrinho

      const stock = await api.get(`/stock/${productId}`); // verifica na api a quantidade do produto existente no estoque
      const stockAmount = stock.data.amount; // separa a quantidade do produto em estoque
      const currentAmount = productExists ? productExists.amount : 0; // se o produto já está no carrinho, separa a quantidade atual dele no carrinho
      const amount = currentAmount + 1; // quantidade desejada do produto

      if (amount > stockAmount) { // verifica a quantidade em estoque
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if (productExists) { // se o produto já existe no carrinho, incrementa a quantidade desejada dele no carrinho
        productExists.amount = amount;
      } 
      else { // se o produto não existe no carrinho
        const product = await api.get(`/products/${productId}`); // busca as infos do produto do banco
        const newProduct = {  // cria uma nova cópia do produto, adicionando o campo "amount" para enviar para o carrinho
          ...product.data,
          amount: 1
        }
        updatedCart.push(newProduct); // adiciona o novo produto à cópia de segurança do carrinho
      }

      setCart(updatedCart); // atualiza a variável de estado do carrinho com as modificações
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart)); // salva o carrinho no localStorage

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}

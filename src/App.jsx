import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db";
import { useEffect, useState } from "react"

function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);
  const MAX_ITEMS = 5;

  useEffect(() => {
    localStorage.setItem('cart',JSON.stringify(cart));
  },[cart])

  function addToCart(item) {

    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExists >= 0) {
      
      if(cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);

    } else {
      item.quantity = 1;
      setCart([...cart, item])
    }
  }

  function deleteItem(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
  }

  function emptyCart() {
    setCart([])
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map(guitar => {
      if (guitar.id === id && guitar.quantity < MAX_ITEMS) {
        return {
          ...guitar,
          quantity: guitar.quantity + 1
        }
      }
      return guitar;
    })
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const index = cart.findIndex(guitar => guitar.id === id);
    if ((cart[index].quantity - 1) === 0) {
      setCart(prevCart => prevCart.filter(guitar => guitar.id !== id));
    } else {
      const updatedCart = [...cart];
      updatedCart[index].quantity--;
      setCart(updatedCart);
    }
  }


  return (
    <>
      <Header
        cart={cart}
        deleteItem={deleteItem}
        emptyCart={emptyCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
      />


      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestras Colecciones</h2>

        <div className="row mt-5">
          {db.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>

    </>
  )
}

export default App

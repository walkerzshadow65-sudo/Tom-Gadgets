/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingCart, User as UserIcon, LogIn, LogOut, LayoutDashboard, ShoppingBag, X, Plus, Minus, Search, Trash2, CheckCircle, ArrowLeft, Eye, Edit, Trash, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CartItem, User, Order, INITIAL_PRODUCTS, ADMIN_PASSWORD, VERIFICATION_CODE } from './types';

// --- CONTEXT ---
interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

// --- UTILS ---
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price);
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Sold Out', color: 'text-red-500' };
  if (stock <= 5) return { label: 'Low Stock', color: 'text-orange-500' };
  return { label: 'In Stock', color: 'text-green-500' };
};

// --- COMPONENTS ---

const Navigation = () => {
  const { cart, user, setCurrentPage, currentPage } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="h-20 sticky top-0 z-50 bg-bg-surface border-b border-white/10 px-8 flex items-center justify-between">
      <div 
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => setCurrentPage('home')}
      >
        <div className="h-16 flex items-center">
          <img 
            src="/logo.png" 
            alt="Tom Gadgets Logo" 
            className="h-full w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback if logo.png is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gold rounded-lg flex items-center justify-center text-black font-black text-2xl tracking-tighter transition-transform group-hover:scale-105">
                    TG
                  </div>
                  <div>
                    <h1 class="font-display font-bold text-xl tracking-tight uppercase leading-none text-white">TOM GADGETS</h1>
                    <p class="text-[10px] text-gold uppercase tracking-[0.2em] -mt-1">Power Your World</p>
                  </div>
                </div>
              `;
            }}
          />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10 text-sm font-medium uppercase tracking-widest text-white/70">
        <button onClick={() => setCurrentPage('home')} className={`hover:text-gold transition-colors ${currentPage === 'home' ? 'text-white' : ''}`}>Home</button>
        <button onClick={() => setCurrentPage('shop')} className={`hover:text-gold transition-colors ${currentPage === 'shop' ? 'text-white' : ''}`}>Shop</button>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setCurrentPage('cart')}
          className="relative p-2 text-white/80 hover:text-gold transition-colors"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        
        {user ? (
          <button 
            onClick={() => setCurrentPage('account')}
            className={`px-6 py-2 border border-gold text-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-black transition-all ${currentPage === 'account' ? 'bg-gold text-black' : ''}`}
          >
            <span className="hidden sm:inline">{user.fullName.split(' ')[0]}</span>
            <UserIcon size={16} className="sm:hidden" />
          </button>
        ) : (
          <button 
            onClick={() => setCurrentPage('login')}
            className="px-6 py-2 border border-gold text-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gold hover:text-black transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  const { setCurrentPage } = useStore();
  
  return (
    <footer className="h-12 bg-black border-t border-white/5 px-8 flex items-center justify-between text-[10px] text-white/30 tracking-widest uppercase mt-auto">
      <div className="flex items-center space-x-6">
        <span>© 2025 Tom Gadgets</span>
        <span>tomgadgets@gmail.com</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>IG / FB / WA</span>
        <button 
          onClick={() => setCurrentPage('admin-login')}
          className="text-white/10 hover:text-gold transition-colors"
        >
          Admin
        </button>
      </div>
    </footer>
  );
};

// --- PAGE COMPONENTS ---

const HomePage = () => {
  const { products, setCurrentPage } = useStore();
  const featured = products.slice(0, 6);

  return (
    <div className="flex flex-col min-h-full">
      {/* Featured Products */}
      <section className="py-12 px-8 w-full">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-3xl font-light tracking-tight">Featured <span className="font-bold italic">Tech</span></h2>
          <p className="text-white/40 text-sm">Showing {featured.length} unique pieces</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Banner adapted to Sophisticated Dark */}
      <section className="mt-auto border-t border-white/5 bg-black/40 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">
          <div className="flex flex-col items-center gap-2">
            <span className="text-gold text-lg">24/7</span>
            <span>Support</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-gold text-lg">FAST</span>
            <span>COURIER</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-gold text-lg">SECURE</span>
            <span>ENCRYPTED</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-gold text-lg">1 YR</span>
            <span>WARRANTY</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, setSelectedProduct, setCurrentPage } = useStore();
  const status = getStockStatus(product.stock);

  const statusStyles = {
    'In Stock': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Low Stock': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'Sold Out': 'bg-red-500 text-white border-transparent'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-bg-card border border-white/5 p-4 rounded-2xl transition-all hover:border-gold/30 flex flex-col h-full"
    >
      <div 
        className="aspect-square bg-bg-accent rounded-xl mb-4 overflow-hidden relative cursor-pointer flex items-center justify-center"
        onClick={() => {
          setSelectedProduct(product);
          setCurrentPage('detail');
        }}
      >
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded border ${statusStyles[status.label as keyof typeof statusStyles]}`}>
            {status.label}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.05] pointer-events-none transition-opacity">
          <span className="text-4xl font-black italic tracking-tighter uppercase">{product.category}</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 
          className="text-sm font-semibold mb-1 group-hover:text-gold transition-colors cursor-pointer"
          onClick={() => {
            setSelectedProduct(product);
            setCurrentPage('detail');
          }}
        >
          {product.name}
        </h3>
        <p className="text-gold font-bold text-lg mb-4">{formatPrice(product.price)}</p>
        
        <button 
          disabled={product.stock === 0}
          onClick={() => addToCart(product)}
          className={`mt-auto w-full py-2 text-xs font-bold uppercase rounded-lg transition-all ${
            product.stock > 0 
            ? 'bg-white text-black hover:bg-gold' 
            : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  );
};

const ShopPage = () => {
  const { products } = useStore();
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="p-8 w-full">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-3xl font-light tracking-tight">{filter === 'All' ? 'Our' : filter} <span className="font-bold italic">Collection</span></h2>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1 rounded-full border transition-all text-[10px] font-bold uppercase tracking-widest ${
                filter === cat 
                ? 'bg-gold border-gold text-black' 
                : 'border-white/10 hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { selectedProduct, addToCart, setCurrentPage } = useStore();
  if (!selectedProduct) {
    setCurrentPage('shop');
    return null;
  }

  const status = getStockStatus(selectedProduct.stock);

  return (
    <div className="p-8 w-full">
      <button 
        onClick={() => setCurrentPage('shop')}
        className="flex items-center gap-2 text-white/40 hover:text-gold mb-8 transition-colors text-xs uppercase tracking-widest font-bold"
      >
        <ArrowLeft size={14} /> Back to Collection
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="rounded-2xl overflow-hidden bg-bg-accent border border-white/5">
          <img 
            src={selectedProduct.imageUrl} 
            alt={selectedProduct.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-gold font-bold tracking-[0.3em] uppercase text-[10px] mb-4">{selectedProduct.category}</span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 leading-tight">
            {selectedProduct.name.split(' ').slice(0, -1).join(' ')} <span className="font-bold italic">{selectedProduct.name.split(' ').slice(-1)}</span>
          </h1>
          <p className="text-white/60 text-base mb-8 leading-relaxed max-w-xl">
            {selectedProduct.description}
          </p>
          
          <div className="flex items-center gap-6 mb-10">
            <span className="text-3xl font-bold">{formatPrice(selectedProduct.price)}</span>
            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2 ${status.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.color.replace('text', 'bg')}`} />
              {status.label}
            </span>
          </div>

          <button 
            disabled={selectedProduct.stock <= 0}
            onClick={() => addToCart(selectedProduct)}
            className={`w-full md:w-max px-12 py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
              selectedProduct.stock > 0 
              ? 'bg-gold text-black hover:shadow-[0_0_20px_rgba(255,184,0,0.3)]' 
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            Add to Shopping Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, setCurrentPage, user } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 2500;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="py-32 px-4 text-center">
        <div className="w-20 h-20 bg-bg-card rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
          <ShoppingBag size={40} className="text-white/10" />
        </div>
        <h2 className="text-2xl font-light tracking-tight mb-4">Your tray is <span className="font-bold italic">empty</span></h2>
        <p className="text-white/40 mb-8 max-w-xs mx-auto">Seems like you haven't added any premium gadgets to your collection yet.</p>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="px-8 py-3 bg-white text-black rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-gold transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-light tracking-tight mb-12">Shopping <span className="font-bold italic">Cart</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-bg-card border border-white/5 p-4 rounded-2xl flex items-center gap-6">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-xl grayscale opacity-60" />
              <div className="flex-grow">
                <h3 className="font-bold text-sm tracking-tight">{item.name}</h3>
                <p className="text-gold font-bold text-base mb-2">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black rounded-lg border border-white/10 p-1">
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gold hover:text-black rounded transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gold hover:text-black rounded transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-1">Subtotal</p>
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-bg-surface border border-white/10 p-8 rounded-3xl h-max sticky top-24">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Summary</h3>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm text-white/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? <span className="text-green-500 font-bold italic">FREE</span> : <span>{formatPrice(deliveryFee)}</span>}
            </div>
            <div className="border-t border-white/5 pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-gold">{formatPrice(total)}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (user) setCurrentPage('checkout');
              else setCurrentPage('login');
            }}
            className="w-full py-4 bg-gold text-black rounded-xl font-black uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-all"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { setUser, setCurrentPage } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users: User[] = JSON.parse(localStorage.getItem('tg_all_users') || '[]');
    const u = users.find(u => u.email === email && u.password === password);
    
    if (u) {
      setUser(u);
      setCurrentPage('home');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="py-24 px-4 flex justify-center">
      <div className="w-full max-w-sm bg-bg-surface border border-white/10 p-10 rounded-3xl text-center">
        <h2 className="text-2xl font-light tracking-tight mb-8">Welcome <span className="font-bold italic">Back</span></h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-gold outline-none transition-colors" />
          <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-gold outline-none transition-colors" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full py-4 border border-gold text-gold font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gold hover:text-black transition-all">
            Enter Dashboard
          </button>
        </form>
        <div className="mt-8 flex flex-col gap-2">
            <button onClick={() => setCurrentPage('register')} className="text-xs text-white/40 hover:text-white transition-colors">Create Account</button>
            <button onClick={() => setCurrentPage('forgot-password')} className="text-xs text-white/40 hover:text-white transition-colors">Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const { setCurrentPage } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [vCode, setVCode] = useState('');

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert('Passwords do not match');
    console.log(`[TOM GADGETS] Verification Code: ${VERIFICATION_CODE}`);
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (vCode === VERIFICATION_CODE) {
      const users: User[] = JSON.parse(localStorage.getItem('tg_all_users') || '[]');
      localStorage.setItem('tg_all_users', JSON.stringify([...users, { ...formData, id: Date.now().toString() }]));
      setCurrentPage('login');
      alert('Verification successful! Please login.');
    } else {
      alert('Invalid code');
    }
  };

  return (
    <div className="py-24 px-4 flex justify-center">
      <div className="w-full max-w-sm bg-bg-surface border border-white/10 p-10 rounded-3xl text-center">
        {step === 1 ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
             <h2 className="text-2xl font-light tracking-tight mb-8">Create <span className="font-bold italic">Account</span></h2>
             <input required placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-black border border-white/10 px-4 py-4 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
             <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 px-4 py-4 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
             <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-white/10 px-4 py-4 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
             <input required type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-black border border-white/10 px-4 py-4 rounded-xl text-sm outline-none focus:border-gold transition-colors" />
             <button type="submit" className="w-full py-4 border border-gold text-gold font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-gold hover:text-black transition-all">Next Step</button>
             <button onClick={() => setCurrentPage('login')} className="mt-6 text-xs text-white/40 hover:text-white transition-colors block w-full">I already have an account</button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6 text-center">
            <h2 className="text-2xl font-light tracking-tight mb-4">Verify <span className="font-bold italic">Identity</span></h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Enter the code sent to your Gmail</p>
            <input required maxLength={6} type="text" value={vCode} onChange={e => setVCode(e.target.value)} className="w-full bg-black border border-white/10 p-4 text-center text-3xl tracking-[0.5em] rounded-xl outline-none focus:border-gold transition-colors font-bold" />
            <button type="submit" className="w-full py-4 bg-gold text-black font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-all">Verify Now</button>
          </form>
        )}
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const { setCurrentPage } = useStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('A password reset link has been sent to your Gmail');
    setStep(2);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert('Passwords do not match');
    const users: User[] = JSON.parse(localStorage.getItem('tg_all_users') || '[]');
    localStorage.setItem('tg_all_users', JSON.stringify(users.map(u => u.email === email ? { ...u, password: passwords.new } : u)));
    alert('Password updated!');
    setCurrentPage('login');
  };

  return (
    <div className="py-24 px-4 flex justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 rounded-3xl">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            <button type="submit" className="w-full py-4 bg-gold text-black font-bold rounded-xl">Send Reset Link</button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">New Password</h2>
            <input required type="password" placeholder="New Password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            <input required type="password" placeholder="Confirm Password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            <button type="submit" className="w-full py-4 bg-gold text-black font-bold rounded-xl">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};
const AccountPage = () => {
  const { user, setUser, orders, setCurrentPage } = useStore();
  if (!user) return null;

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">My <span className="font-bold italic">Account</span></h1>
          <p className="text-white/40 text-xs uppercase tracking-widest">{user.fullName} | {user.email}</p>
        </div>
        <button onClick={() => { setUser(null); setCurrentPage('home'); }} className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold border border-red-500/20 uppercase text-[10px] tracking-widest">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-6">Order History</h2>
          <div className="space-y-4">
            {orders.filter(o => o.userId === user.id).length === 0 ? (
              <p className="p-8 bg-bg-card rounded-2xl text-white/40 border border-white/5 text-sm italic">No collections yet.</p>
            ) : (
              orders.filter(o => o.userId === user.id).map(order => (
                <div key={order.id} className="bg-bg-card p-6 rounded-2xl border border-white/5 flex justify-between items-center transition-all hover:border-gold/20">
                  <div>
                    <h4 className="font-bold text-sm">Order #{order.id.slice(-6).toUpperCase()}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold">{formatPrice(order.total)}</p>
                    <span className="text-[8px] uppercase font-black tracking-widest text-white/20 bg-white/5 px-2 py-0.5 rounded-full">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-bg-surface p-8 rounded-3xl border border-white/10">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-6">Profile Settings</h2>
          <button className="w-full py-4 border border-white/10 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:border-gold transition-colors">Update Profile Info</button>
        </div>
      </div>
    </div>
  );
};;

const CheckoutPage = () => {
  const { cart, clearCart, user, setCurrentPage, setOrders, setProducts } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + 2500;
  const [success, setSuccess] = useState(false);

  const handleCheckout = () => {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      customerName: user!.fullName,
      items: [...cart],
      total,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    setProducts(prev => prev.map(p => {
      const c = cart.find(ci => ci.id === p.id);
      return c ? { ...p, stock: Math.max(0, p.stock - c.quantity) } : p;
    }));
    clearCart();
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="py-32 px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20"><CheckCircle size={40} /></div>
        <h2 className="text-3xl font-light tracking-tight mb-4 italic">Collection <span className="font-bold">Secured</span></h2>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">Your premium gadgets are being prepared for delivery.</p>
        <button onClick={() => setCurrentPage('home')} className="px-8 py-3 bg-white text-black rounded-lg font-bold uppercase text-[10px] tracking-widest hover:bg-gold transition-colors">Return Home</button>
      </div>
    );
  }

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-light tracking-tight mb-12 italic">Secure <span className="font-bold">Checkout</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-bg-card p-8 rounded-3xl h-max border border-white/5">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Order Review</h2>
          <div className="space-y-4">
             {cart.map(i => <div key={i.id} className="flex justify-between text-sm text-white/60"><span>{i.name} (x{i.quantity})</span><span>{formatPrice(i.price * i.quantity)}</span></div>)}
             <div className="border-t border-white/5 pt-4 flex justify-between text-xl font-bold"><span>Total</span><span className="text-gold">{formatPrice(total)}</span></div>
          </div>
        </div>
        <div className="bg-bg-surface p-8 rounded-3xl border border-white/10 flex flex-col justify-center text-center">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-8">Shipping to: 123 Tech Avenue, Lagos</p>
          <button onClick={handleCheckout} className="w-full py-5 bg-gold text-black font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-all">Proceed to Payment</button>
        </div>
      </div>
    </div>
  );
};

const AdminLoginPage = () => {
  const [pass, setPass] = useState('');
  const { setCurrentPage } = useStore();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      setCurrentPage('admin-dashboard');
    } else {
      alert('Access Denied');
    }
  };

  return (
    <div className="py-32 px-4 flex justify-center">
      <div className="w-full max-w-sm bg-bg-surface border border-white/10 p-10 rounded-3xl text-center">
        <h2 className="text-2xl font-light tracking-tight mb-8">Admin <span className="font-bold italic">Panel</span></h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input required type="password" placeholder="System Security Password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl text-center text-sm outline-none focus:border-gold transition-colors" />
          <button type="submit" className="w-full py-4 bg-gold text-black font-black uppercase tracking-[0.2em] rounded-xl">Enter Dashboard</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { products, setProducts, orders, setOrders, setCurrentPage } = useStore();
  const [showModal, setShowModal] = useState<any>(null); // { mode: 'add' | 'edit', product?: Product }

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-light tracking-tight uppercase italic">Admin <span className="font-bold">Portal</span></h1>
        <button onClick={() => setCurrentPage('home')} className="text-xs font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors">Exit</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
          <div className="text-white/30 text-[8px] font-black tracking-[0.3em] mb-1">REVENUE</div>
          <div className="text-xl font-bold text-gold">{formatPrice(totalRevenue)}</div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
          <div className="text-white/30 text-[8px] font-black tracking-[0.3em] mb-1">ORDERS</div>
          <div className="text-xl font-bold">{orders.length}</div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
          <div className="text-white/30 text-[8px] font-black tracking-[0.3em] mb-1">PRODUCTS</div>
          <div className="text-xl font-bold">{products.length}</div>
        </div>
        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
          <div className="text-white/30 text-[8px] font-black tracking-[0.3em] mb-1">STOCK ALERT</div>
          <div className="text-xl font-bold text-red-500">{outOfStock}</div>
        </div>
      </div>

      <div className="bg-bg-card rounded-3xl overflow-hidden border border-white/10">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest">Inventory</h3>
            <button onClick={() => setShowModal({ mode: 'add' })} className="border border-gold text-gold px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all">+ Add Gadget</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-[8px] text-white/30 border-b border-white/5 uppercase font-black tracking-[0.2em]">
                    <tr><th className="p-6">Name</th><th className="p-6 text-center">Stock</th><th className="p-6">Status</th><th className="p-6 text-right">Actions</th></tr>
                </thead>
                <tbody className="text-xs">
                    {products.map(p => {
                        const s = getStockStatus(p.stock);
                        return (
                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="p-6">
                                    <div className="font-bold">{p.name}</div>
                                    <div className="text-[10px] text-white/20 uppercase tracking-widest">{p.category}</div>
                                </td>
                                <td className="p-6 text-center font-mono">{p.stock}</td>
                                <td className="p-6">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${s.color} border-current opacity-70`}>{s.label}</span>
                                </td>
                                <td className="p-6 text-right space-x-4">
                                    <button onClick={() => setShowModal({ mode: 'edit', product: p })} className="text-gold uppercase text-[10px] font-bold tracking-widest">Edit</button>
                                    <button onClick={() => { if(confirm('Delete gadget?')) setProducts(prev => prev.filter(i => i.id !== p.id)) }} className="text-red-500 uppercase text-[10px] font-bold tracking-widest opacity-40 hover:opacity-100">Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95">
              <div className="bg-bg-surface p-10 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-light tracking-tight mb-8">Gadget <span className="font-bold italic">Config</span></h3>
                  <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const p: Product = {
                          id: showModal.mode === 'add' ? Date.now().toString() : showModal.product.id,
                          name: formData.get('name') as string,
                          description: formData.get('description') as string,
                          price: Number(formData.get('price')),
                          category: formData.get('category') as string,
                          imageUrl: formData.get('imageUrl') as string,
                          stock: Number(formData.get('stock')),
                      };
                      if (showModal.mode === 'add') setProducts(prev => [...prev, p]);
                      else setProducts(prev => prev.map(old => old.id === p.id ? p : old));
                      setShowModal(null);
                  }} className="space-y-4">
                      <input name="name" required placeholder="Display Name" defaultValue={showModal.product?.name} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold" />
                      <input name="category" required placeholder="Category" defaultValue={showModal.product?.category} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold" />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="price" required type="number" placeholder="Price (₦)" defaultValue={showModal.product?.price} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold" />
                        <input name="stock" required type="number" placeholder="Stock Qty" defaultValue={showModal.product?.stock} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold" />
                      </div>
                      <input name="imageUrl" required placeholder="Image Source URL" defaultValue={showModal.product?.imageUrl} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold" />
                      <textarea name="description" required placeholder="Full Description" defaultValue={showModal.product?.description} className="w-full bg-black border border-white/10 px-4 py-3 rounded-xl text-sm outline-none focus:border-gold h-24" />
                      <div className="flex gap-4 pt-4">
                          <button type="submit" className="flex-grow py-4 bg-gold text-black font-black uppercase tracking-widest rounded-xl text-xs">Save Changes</button>
                          <button type="button" onClick={() => setShowModal(null)} className="px-6 py-4 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5">Cancel</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { setCurrentPage, products } = useStore();
  const categories = ['New Arrivals', ...new Set(products.map(p => p.category))];

  return (
    <aside className="hidden lg:flex w-64 border-r border-white/5 bg-bg-panel p-8 flex-col justify-between shrink-0">
      <div className="space-y-8">
        <section>
          <h3 className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Collection</h3>
          <ul className="space-y-3 text-sm text-white/60">
            {categories.map((cat, i) => (
              <li 
                key={cat}
                onClick={() => setCurrentPage('shop')}
                className={`hover:text-white transition-colors cursor-pointer flex items-center justify-between ${i === 0 ? 'text-white font-semibold italic' : ''}`}
              >
                <span>{cat}</span>
                {i === 0 && <span className="w-2 h-2 rounded-full bg-gold"></span>}
              </li>
            ))}
          </ul>
        </section>
        
        <section>
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Filter</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span>Price Range</span>
              <span className="text-gold">₦5k - ₦500k</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full w-full relative">
              <div className="absolute left-2 right-8 h-full bg-gold"></div>
            </div>
          </div>
        </section>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-white/5">
        <p className="text-[10px] text-white/40 uppercase mb-2 leading-none">Secure Checkout</p>
        <div className="flex space-x-2">
          <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
          <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
          <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
        </div>
      </div>
    </aside>
  );
};

const CartSidebar = () => {
  const { cart, removeFromCart, setCurrentPage, user } = useStore();
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + delivery;

  return (
    <aside className="hidden xl:flex w-80 border-l border-white/5 bg-bg-surface p-6 flex-col shrink-0 overflow-y-auto">
      <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Shopping Cart</h3>
      <div className="flex-1 space-y-4">
        {cart.length === 0 ? (
          <p className="text-white/20 text-xs italic">Your tray is empty.</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/5 rounded-lg shrink-0 overflow-hidden">
                <img src={item.imageUrl} className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold truncate">{item.name}</h4>
                <p className="text-[10px] text-white/40">{item.quantity} x {formatPrice(item.price)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-auto pt-6 space-y-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">Delivery</span>
          {delivery === 0 ? (
             <span className="text-green-500 font-bold uppercase text-xs tracking-tighter">FREE</span>
          ) : (
            <span className="font-bold">{formatPrice(delivery)}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-lg font-bold border-t border-white/5 pt-4">
          <span>Total</span>
          <span className="text-gold">{formatPrice(total)}</span>
        </div>
        <button 
          onClick={() => {
            if (user) setCurrentPage('checkout');
            else setCurrentPage('login');
          }}
          disabled={cart.length === 0}
          className="w-full py-4 bg-gold text-black font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(255,184,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Checkout
        </button>
      </div>
    </aside>
  );
};

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tg_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tg_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tg_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tg_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('tg_products', JSON.stringify(products));
    localStorage.setItem('tg_cart', JSON.stringify(cart));
    localStorage.setItem('tg_user', JSON.stringify(user));
    localStorage.setItem('tg_orders', JSON.stringify(orders));
  }, [products, cart, user, orders]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert('Sold Out');
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: Math.min(quantity, prod.stock) } : item));
  };

  const clearCart = () => setCart([]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'shop': return <ShopPage />;
      case 'detail': return <ProductDetailPage />;
      case 'cart': return <CartPage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'forgot-password': return <ForgotPasswordPage />;
      case 'account': return <AccountPage />;
      case 'checkout': return <CheckoutPage />;
      case 'admin-login': return <AdminLoginPage />;
      case 'admin-dashboard': return <AdminDashboard />;
      default: return <HomePage />;
    }
  };

  return (
    <StoreContext.Provider value={{
      products, setProducts, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      user, setUser, orders, setOrders, currentPage, setCurrentPage, selectedProduct, setSelectedProduct
    }}>
      <div className="flex flex-col h-screen bg-bg-main overflow-hidden">
        <Navigation />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Most pages will have sidebar/cart layout for the desktop experience */}
          {['home', 'shop', 'detail'].includes(currentPage) && <Sidebar />}
          
          <main className="flex-1 overflow-y-auto bg-bg-main relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          {['home', 'shop', 'detail'].includes(currentPage) && <CartSidebar />}
        </div>

        <Footer />
      </div>
    </StoreContext.Provider>
  );
}

import React, { useState, useCallback, FormEvent, useEffect, useRef } from 'react';
import {
  WHATSAPP_NUMBER_CLIENT,
  WHATSAPP_NUMBER_DEV,
  INSTAGRAM_LINK,
  INSTAGRAM_LINK_DEV,
  GOOGLE_REVIEW_LINK,
  GOOGLE_MAPS_LINK,
  InstagramIcon,
  LocationIcon,
  StarIcon,
  InfoIcon,
  WhatsAppIcon,
  BoxIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  BeefIcon,
} from './constants';
import { ModalType, OrderData, KitOrderData } from './types';
import Profile from './components/Profile';
import LinkButton from './components/LinkButton';
import Footer from './components/Footer';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [devContactName, setDevContactName] = useState('');
  const [isZooming, setIsZooming] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    name: '',
    items: {
      carnes: false,
      acompanhamentos: false,
      kits: false,
      panificadora: false,
      outros: false,
    },
    selectedKits: {
      churrasco1: false,
      churrascoPremium: false,
      economico: false,
      pratico: false,
      familiar: false,
    },
    outrosText: '',
    pickupTime: '',
    message: '',
  });
  const [kitOrderData, setKitOrderData] = useState<KitOrderData>({
    name: '',
    pickupTime: '',
    kits: {
      churrasco1: 0,
      churrascoPremium: 0,
      economico: 0,
      pratico: 0,
      familiar: 0,
    },
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewStep, setReviewStep] = useState<'rating' | 'feedback'>('rating');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Approximate width of a card + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isZooming) {
      const openModalTimer = setTimeout(() => {
        handleOpenModal(ModalType.ABOUT);
      }, 250);

      const resetTransitionTimer = setTimeout(() => {
        setIsZooming(false);
      }, 600);

      return () => {
        clearTimeout(openModalTimer);
        clearTimeout(resetTransitionTimer);
      };
    }
  }, [isZooming]);

  const handleSpinFinish = () => {
    setIsZooming(true);
  };

  const handleOpenModal = (modalType: ModalType) => {
    if (modalType === ModalType.REVIEW) {
      setRating(0);
      setHoverRating(0);
      setReviewStep('rating');
      setFeedbackMessage('');
    }
     if (modalType === ModalType.KITS) {
      setKitOrderData({
        name: '',
        pickupTime: '',
        kits: { churrasco1: 0, churrascoPremium: 0, economico: 0, pratico: 0, familiar: 0 },
      });
    }
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setActiveModal(ModalType.NONE);
    if (activeModal === ModalType.DEVELOPER) {
      setDevContactName('');
    }
    if (activeModal === ModalType.REVIEW) {
      setTimeout(() => {
        setRating(0);
        setHoverRating(0);
        setReviewStep('rating');
        setFeedbackMessage('');
      }, 300);
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name in orderData.items) {
          setOrderData(prev => ({
              ...prev,
              items: {
                  ...prev.items,
                  [name]: checked,
              }
          }));
        } else if (name in orderData.selectedKits) {
          setOrderData(prev => ({
            ...prev,
            selectedKits: {
              ...prev.selectedKits,
              [name]: checked,
            }
          }))
        }
    } else {
        setOrderData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const selectedItems = Object.entries(orderData.items)
      .filter(([, isSelected]) => isSelected as boolean)
      .map(([itemName]) => {
          if (itemName === 'outros' && orderData.outrosText) {
              return `Outros (${orderData.outrosText})`;
          }
          const label = itemName.charAt(0).toUpperCase() + itemName.slice(1);
          return label === 'Acompanhamentos' ? 'Acompanhamento' : label;
      });
    
    const selectedKitNames = Object.entries(orderData.selectedKits)
      .filter(([,isSelected]) => isSelected)
      .map(([kitName]) => {
        switch(kitName) {
          case 'churrasco1': return 'Kit Churrasco 1';
          case 'churrascoPremium': return 'Kit Churrasco Premium';
          case 'economico': return 'Kit Econômico';
          case 'pratico': return 'Kit Prático';
          case 'familiar': return 'Kit Familiar';
          default: return '';
        }
      });

    let fullMessage = `Olá, Nelore Brasil! Vim pelo link na bio e meu pedido para hoje é:\n\n`;
    fullMessage += `*Nome:* ${orderData.name}\n`;
    if(selectedItems.length > 0) {
      fullMessage += `*Itens de interesse:* ${selectedItems.join(', ')}\n`;
    }
    if(orderData.items.kits && selectedKitNames.length > 0) {
      fullMessage += `*Kits selecionados:* ${selectedKitNames.join(', ')}\n`;
    }
    if(orderData.pickupTime) {
      fullMessage += `*Horário para retirada:* ${orderData.pickupTime}\n`;
    }
    fullMessage += `\n`;
    if(orderData.message) {
      fullMessage += `*Mensagem:*\n${orderData.message}\n\n`;
    }
    fullMessage += `Poderia confirmar para mim, por favor?`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER_CLIENT}?text=${encodeURIComponent(fullMessage.trim())}`;
    window.open(whatsappUrl, '_blank');
  };
  
  const handleDevContactSubmit = () => {
      const message = `Olá, meu nome é ${devContactName}. Vi o link da Nelore Brasil e quero um site igual!`;
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER_DEV}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
  };

  const handleRatingClick = (clickedRating: number) => {
    setRating(clickedRating);
    if (clickedRating === 5) {
        window.open(GOOGLE_REVIEW_LINK, '_blank');
        handleCloseModal();
    } else {
        setReviewStep('feedback');
    }
  };

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    
    const data = {
        _subject: "Novo Feedback - Nelore Brasil",
        _captcha: "false",
        avaliacao: `${rating} Estrelas`,
        mensagem: feedbackMessage,
    };

    fetch("https://formsubmit.co/ajax/contato.nelorebrasil@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if(response.ok) {
            alert('Obrigado pelo seu feedback! Vamos trabalhar para melhorar.');
            setFeedbackMessage('');
            handleCloseModal();
        } else {
            alert('Ops! Algo deu errado. Tente novamente mais tarde.');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar feedback:', error);
        alert('Ops! Algo deu errado. Tente novamente mais tarde.');
    })
    .finally(() => {
        setIsSubmittingFeedback(false);
    });
  };

  const handleKitInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKitOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleKitQuantityChange = (kitName: keyof KitOrderData['kits'], delta: number) => {
    setKitOrderData(prev => ({
        ...prev,
        kits: {
            ...prev.kits,
            [kitName]: Math.max(0, prev.kits[kitName] + delta)
        }
    }));
  };

  const handleKitOrderSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selectedKits = Object.entries(kitOrderData.kits)
      .filter(([, quantity]) => (quantity as number) > 0)
      .map(([kitName, quantity]) => {
          let name = '';
          switch(kitName) {
              case 'churrasco1': name = 'Kit Churrasco 1'; break;
              case 'churrascoPremium': name = 'Kit Churrasco Premium'; break;
              case 'economico': name = 'Kit Econômico'; break;
              case 'pratico': name = 'Kit Prático'; break;
              case 'familiar': name = 'Kit Familiar'; break;
          }
          return `${quantity}x ${name}`;
      });

    if (selectedKits.length === 0) {
      alert('Por favor, selecione a quantidade de pelo menos um kit.');
      return;
    }

    let message = `Olá, Nelore Brasil! Vim pelo link na bio e meu pedido para hoje é:\n\n`;
    message += selectedKits.join('\n');
    message += `\n\n*Nome para retirada:* ${kitOrderData.name}`;
    message += `\n*Horário de retirada:* ${kitOrderData.pickupTime}`;
    message += `\n\nPoderia confirmar para mim, por favor?`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER_CLIENT}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    handleCloseModal();
  };


  const getModalTitle = () => {
    switch (activeModal) {
      case ModalType.ABOUT: return 'Sobre Nós';
      case ModalType.LOCATION: return 'Localização e Horários';
      case ModalType.ORDER: return 'Faça seu Pedido';
      case ModalType.REVIEW: return reviewStep === 'rating' ? 'Deixe sua Avaliação' : 'Ajude-nos a Melhorar';
      case ModalType.DEVELOPER: return 'Desenvolvido por InteligenciArte.IA';
      case ModalType.KITS: return 'Nossos Kits';
      default: return '';
    }
  };
  
  const renderOrderForm = () => {
    const itemCategories = [
        { id: 'carnes', label: 'Carnes' },
        { id: 'acompanhamentos', label: 'Acompanhamentos' },
        { id: 'kits', label: 'Kits' },
        { id: 'panificadora', label: 'Panificadora' },
        { id: 'outros', label: 'Outros' },
    ];
    const kitOptions = [
      { id: 'churrasco1', label: 'Kit Churrasco 1' },
      { id: 'churrascoPremium', label: 'Kit Churrasco Premium' },
      { id: 'economico', label: 'Kit Econômico' },
      { id: 'pratico', label: 'Kit Prático' },
      { id: 'familiar', label: 'Kit Familiar' },
    ];

    return (
        <form onSubmit={handleOrderSubmit} className="space-y-3">
            <div>
                <label htmlFor="name" className="block mb-1 text-xs uppercase tracking-wide text-neutral-500">Seu nome</label>
                <input type="text" id="name" name="name" onChange={handleOrderChange} value={orderData.name} required className="w-full bg-white border border-black/10 rounded-lg p-2 text-neutral-900 focus:border-red-500 focus:outline-none transition-colors shadow-sm" />
            </div>
            
            <div>
                <label className="block mb-1 text-xs uppercase tracking-wide text-neutral-500">Interesses</label>
                <div className="grid grid-cols-1 gap-2">
                    {itemCategories.map(item => (
                        <label key={item.id} className={`flex items-center space-x-3 bg-white border rounded-lg px-3 py-3 cursor-pointer transition-all shadow-sm ${orderData.items[item.id as keyof typeof orderData.items] ? 'bg-red-50 border-red-500 text-red-800' : 'border-black/10 hover:bg-neutral-50 text-neutral-600'}`}>
                            <input type="checkbox" id={item.id} name={item.id} onChange={handleOrderChange} checked={orderData.items[item.id as keyof typeof orderData.items]} className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 accent-red-600 shrink-0" />
                            <span className={`text-sm font-medium leading-tight`}>{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {orderData.items.kits && (
              <div className="p-3 bg-neutral-50 border border-black/5 rounded-lg space-y-2 animate-enter">
                <label className="block text-xs uppercase tracking-wide text-neutral-500">Selecione os kits:</label>
                <div className="grid grid-cols-1 gap-2">
                  {kitOptions.map(kit => (
                      <label key={kit.id} className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${orderData.selectedKits[kit.id as keyof typeof orderData.selectedKits] ? 'bg-red-50 border-red-500 text-red-800' : 'bg-white border-black/10 hover:bg-neutral-50 text-neutral-600'}`}>
                          <input type="checkbox" id={kit.id} name={kit.id} onChange={handleOrderChange} checked={orderData.selectedKits[kit.id as keyof typeof orderData.selectedKits]} className="w-5 h-5 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 accent-red-600 shrink-0" />
                          <span className="text-sm font-medium leading-tight">{kit.label}</span>
                      </label>
                  ))}
                </div>
              </div>
            )}

            {orderData.items.outros && (
                <div>
                    <input type="text" id="outrosText" name="outrosText" onChange={handleOrderChange} value={orderData.outrosText} placeholder="O que você precisa?" className="w-full bg-white border border-black/10 rounded-lg p-2 text-neutral-900 focus:border-red-500 focus:outline-none text-sm shadow-sm" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-3">
                <div>
                    <span className="block mb-2 text-xs uppercase tracking-wide text-neutral-500">Horário de retirada</span>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${orderData.pickupTime === 'Manhã' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-white border-black/10 text-neutral-700 hover:bg-neutral-50'}`}>
                        <input type="radio" name="pickupTime" value="Manhã" checked={orderData.pickupTime === 'Manhã'} onChange={handleOrderChange} className="hidden" required />
                        Manhã
                      </label>
                      <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${orderData.pickupTime === 'Tarde' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-white border-black/10 text-neutral-700 hover:bg-neutral-50'}`}>
                        <input type="radio" name="pickupTime" value="Tarde" checked={orderData.pickupTime === 'Tarde'} onChange={handleOrderChange} className="hidden" required />
                        Tarde
                      </label>
                    </div>
                </div>
            </div>

            <div>
                <textarea id="message" name="message" rows={2} onChange={handleOrderChange} value={orderData.message} placeholder="Observações..." className="w-full bg-white border border-black/10 rounded-lg p-2 text-neutral-900 focus:border-red-500 focus:outline-none text-sm shadow-sm"></textarea>
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/20 transform transition-all active:scale-[0.98]">
                Enviar Pedido
            </button>
        </form>
    );
  };

  const renderReviewModalContent = () => {
    if (reviewStep === 'rating') {
        return (
            <div className="flex flex-col items-center text-center py-4">
                <div 
                    className="flex space-x-1 mb-6"
                    onMouseLeave={() => setHoverRating(0)}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star} 
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className="p-1 transform hover:scale-110 transition-transform"
                        >
                            <StarIcon 
                                className="w-10 h-10 transition-colors duration-200"
                                isFilled={star <= (hoverRating || rating)}
                            />
                        </button>
                    ))}
                </div>
                 <p className="text-sm text-neutral-500 uppercase tracking-widest">Toque para avaliar</p>
            </div>
        );
    } else {
        return (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <p className="text-sm text-neutral-600">Como podemos melhorar sua experiência?</p>
                <textarea 
                    id="feedbackMessage"
                    name="feedbackMessage"
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Digite aqui..."
                    required
                    className="w-full bg-white border border-black/10 rounded-lg p-3 text-neutral-900 focus:border-red-500 focus:outline-none shadow-sm"
                />
                <button 
                  type="submit" 
                  disabled={isSubmittingFeedback}
                  className="w-full bg-neutral-900 text-white font-bold py-3 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmittingFeedback ? 'Enviando...' : 'Enviar Feedback'}
                </button>
            </form>
        );
    }
  };

  const getModalContent = useCallback(() => {
    switch (activeModal) {
      case ModalType.ABOUT:
        return (
          <div className="flex flex-col items-center space-y-4 py-1">
            
            <div className="text-center relative">
              <div className="absolute -inset-10 bg-red-500/10 blur-3xl rounded-full opacity-20 pointer-events-none"></div>
              <img src="/titulo.png" alt="Nelore Brasil" className="h-20 sm:h-24 object-contain relative z-10 drop-shadow-lg mx-auto" />
              <p className="text-[10px] text-red-800/70 tracking-[0.4em] uppercase mt-1 font-bold">
                Tradição & Qualidade
              </p>
            </div>

            <div className="text-center space-y-2 px-2">
              <p className="text-neutral-600 leading-relaxed font-light text-xs text-justify">
                A <strong className="text-neutral-900">Nelore Brasil</strong> é sinônimo de excelência. Nossa missão é transformar o seu churrasco e o seu dia a dia, levando até a sua mesa cortes selecionados com rigoroso controle de procedência.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-black/5 flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-800">
                       <ShieldCheckIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-sans font-bold text-sm text-neutral-900 tracking-wide uppercase">Qualidade</h3>
                        <p className="text-[10px] text-neutral-500">Rigoroso controle sanitário.</p>
                    </div>
                </div>
                
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-black/5 flex items-center space-x-3">
                     <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-800">
                       <BeefIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-sans font-bold text-sm text-neutral-900 tracking-wide uppercase">Premium</h3>
                        <p className="text-[10px] text-neutral-500">Cortes nobres selecionados.</p>
                    </div>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded-xl border border-black/5 flex items-center space-x-3">
                     <div className="p-2 bg-red-50 rounded-lg border border-red-100 text-red-800">
                       <HeartIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-sans font-bold text-sm text-neutral-900 tracking-wide uppercase">Paixão</h3>
                        <p className="text-[10px] text-neutral-500">Amor pelo que fazemos.</p>
                    </div>
                </div>
            </div>

            <div className="w-full text-center pt-1">
               <p className="text-neutral-800 font-medium italic text-xs border-t border-black/5 pt-3">
                  "O verdadeiro sabor da carne de qualidade."
               </p>
            </div>
          </div>
        );
      case ModalType.LOCATION:
        return (
          <div className="space-y-4">
            <div className="bg-neutral-50 p-4 rounded-xl border border-black/5 text-center">
                 <p className="text-sm text-neutral-500 mb-1">Endereço</p>
                 <p className="font-medium text-neutral-900">R. Siqueira Campos, 1998</p>
                 <p className="text-sm text-neutral-500">Uvaranas, Ponta Grossa - PR</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-neutral-50 p-3 rounded-xl border border-black/5">
                    <p className="text-xs text-red-700 font-bold uppercase mb-1">Seg - Sáb</p>
                    <p className="text-sm font-semibold text-neutral-800">07:00 - 20:00</p>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-black/5">
                    <p className="text-xs text-red-700 font-bold uppercase mb-1">Domingo</p>
                    <p className="text-sm font-semibold text-neutral-800">07:00 - 13:00</p>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-black/5 h-40 relative group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.7068611396953!2d-50.123185799999995!3d-25.111782499999997!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x94e81b002070dde5%3A0x4a2deb2ba543261!2sNelore%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1762874184008!5m2!1spt-BR!2sbr" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale group-hover:grayscale-0 transition-all duration-500"
                ></iframe>
            </div>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block w-full bg-neutral-900 text-white font-bold text-center py-3 rounded-xl hover:bg-neutral-800 transition-colors">
                Abrir no Maps
            </a>
          </div>
        );
      case ModalType.ORDER:
        return renderOrderForm();
      case ModalType.REVIEW:
        return renderReviewModalContent();
      case ModalType.DEVELOPER:
        return (
          <div className="flex flex-col items-center text-center space-y-6 py-4">
             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mb-2 animate-pulse">
                <SparklesIcon className="w-10 h-10 text-white" />
             </div>
            <p className="text-sm text-neutral-600 max-w-xs mx-auto">
              Transformamos ideias em experiências digitais de luxo.
            </p>
            
            <div className="w-full space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={devContactName}
                  onChange={(e) => setDevContactName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white border border-black/10 rounded-lg pl-9 p-3 text-neutral-900 focus:border-purple-500 focus:outline-none transition-colors shadow-sm"
                />
              </div>

                <button 
                onClick={handleDevContactSubmit} 
                disabled={!devContactName.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                Quero um site desse! 🚀
                </button>
            </div>
            
            <a href={INSTAGRAM_LINK_DEV} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-1">
               <InstagramIcon className="w-3 h-3" /> @inteligenciarte.ia
            </a>
          </div>
        );
      case ModalType.KITS:
        const totalKitQuantity = Object.values(kitOrderData.kits).reduce((sum: number, qty) => sum + (qty as number), 0);
        const isKitSubmitDisabled = totalKitQuantity === 0 || !kitOrderData.name.trim() || !kitOrderData.pickupTime;
        
        const kitsInfo = [
          { id: 'churrasco1', name: 'Kit Churrasco 1', price: 'R$129,90', items: ['Contra filé 700g', 'Fraldinha na mostarda 500g', 'Coxinha da asa 500g', 'Linguiça Pura 500g', 'Pão de alho santa massa'] },
          { id: 'churrascoPremium', name: 'Kit Churrasco Premium', price: 'R$169,90', items: ['Contra filé 1kg', 'Linguiça Toscana 500g', 'Coxinha da asa na Mostarda 500g', '1 Pão de Alho Santa Massa', '1 Queijo coalho', '1 Carvão super Brasa 4kg', 'Em uma sacola térmica especial'] },
          { id: 'economico', name: 'Kit Econômico', price: 'R$79,90', items: ['Strogonoff de frango', 'Strogonoff de carne', 'Bife bovino', 'Filé de frango'] },
          { id: 'pratico', name: 'Kit Prático', price: 'R$99,90', items: ['Carne moída', 'Bife bovino', 'Cubos bovino', 'Frango em cubos'] },
          { id: 'familiar', name: 'Kit Familiar', price: 'R$149,90', items: ['Bife bovino', 'Carne moída', 'Frango em cubos', 'Strogonoff de carne', 'Coxa e sobrecoxa', 'Linguiça toscana'] },
        ];

        return (
          <form onSubmit={handleKitOrderSubmit} className="space-y-4">
            <div className="relative group">
              {/* Left Arrow (Desktop only) */}
              <button 
                type="button"
                onClick={() => scrollCarousel('left')}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white border border-black/10 shadow-md rounded-full w-10 h-10 items-center justify-center text-neutral-600 hover:text-red-600 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div 
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-6 px-6 touch-pan-x snap-x snap-mandatory" 
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {kitsInfo.map(kit => {
                  const quantity = kitOrderData.kits[kit.id as keyof KitOrderData['kits']] || 0;
                  const isSelected = quantity > 0;
                  return (
                  <div 
                    key={kit.id} 
                    className={`snap-center w-[85%] sm:w-[280px] shrink-0 p-4 rounded-2xl border flex flex-col justify-between h-full select-none transition-colors ${isSelected ? 'bg-red-50/40 border-red-500' : 'bg-neutral-50 border-black/5'}`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-neutral-900 text-lg leading-tight">{kit.name}</h4>
                            <span className="text-sm text-red-700 font-bold">{kit.price}</span>
                        </div>
                      </div>
                      <ul className="text-xs text-neutral-600 space-y-1 mb-4 list-disc pl-4">
                        {kit.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/5">
                      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Quantidade</span>
                      <div className="flex items-center space-x-3 bg-white border border-black/10 rounded-xl p-1 shadow-sm">
                        <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors">-</button>
                        <span className="font-bold text-neutral-900 w-6 text-center text-base">{quantity}</span>
                        <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Right Arrow (Desktop only) */}
              <button 
                type="button"
                onClick={() => scrollCarousel('right')}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white border border-black/10 shadow-md rounded-full w-10 h-10 items-center justify-center text-neutral-600 hover:text-red-600 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="bg-neutral-50 p-3 rounded-xl border border-black/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-neutral-700">Total de Kits:</span>
                <span className="text-lg font-bold text-red-700">{totalKitQuantity}</span>
              </div>
              <div className="space-y-3">
                <input type="text" name="name" onChange={handleKitInfoChange} value={kitOrderData.name} required placeholder="Seu nome" className="w-full bg-white border border-black/10 text-neutral-900 text-sm rounded-lg p-3 focus:border-red-500 outline-none shadow-sm transition-colors" />
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-neutral-700 block">Horário de retirada:</span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${kitOrderData.pickupTime === 'Manhã' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-white border-black/10 text-neutral-700 hover:bg-neutral-50'}`}>
                      <input type="radio" name="pickupTime" value="Manhã" checked={kitOrderData.pickupTime === 'Manhã'} onChange={handleKitInfoChange} className="hidden" required />
                      Manhã
                    </label>
                    <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${kitOrderData.pickupTime === 'Tarde' ? 'bg-red-50 border-red-500 text-red-700 font-medium' : 'bg-white border-black/10 text-neutral-700 hover:bg-neutral-50'}`}>
                      <input type="radio" name="pickupTime" value="Tarde" checked={kitOrderData.pickupTime === 'Tarde'} onChange={handleKitInfoChange} className="hidden" required />
                      Tarde
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isKitSubmitDisabled} className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2">
              <WhatsAppIcon className="w-5 h-5" />
              Finalizar Compra
            </button>
          </form>
        );
      default:
        return null;
    }
  }, [activeModal, orderData, devContactName, rating, hoverRating, reviewStep, feedbackMessage, kitOrderData, isSubmittingFeedback]);

  return (
      <div className="fixed inset-0 w-full h-[100svh] overflow-hidden bg-black/20 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
        
        {/* Main Card Container - Centered and constrained */}
        <main className="w-full max-w-[400px] max-h-full flex flex-col relative z-10 animate-enter">
            
            {/* Glass Card */}
            <div className="w-full flex flex-col bg-white/70 backdrop-blur-2xl border border-black/5 rounded-3xl shadow-2xl overflow-hidden relative max-h-full">
                
                {/* Top highlight glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

                {/* Content Area - allows internal scrolling if absolutely necessary, but styled to fit */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 pt-2 pb-2 w-full overflow-y-auto no-scrollbar">
                    <Profile onSpinFinish={handleSpinFinish} isZooming={isZooming} />
                    
                    <div className="w-full space-y-2 mt-2">
                        <LinkButton icon={<InfoIcon />} text="Quem Somos?" onClick={() => handleOpenModal(ModalType.ABOUT)} />
                        <LinkButton icon={<WhatsAppIcon />} text="Faça seu Pedido" onClick={() => handleOpenModal(ModalType.ORDER)} />
                        <LinkButton icon={<BoxIcon />} text="Nossos Kits" onClick={() => handleOpenModal(ModalType.KITS)} />
                        <LinkButton icon={<InstagramIcon />} text="Instagram" href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" />
                        <LinkButton icon={<LocationIcon />} text="Localização" onClick={() => handleOpenModal(ModalType.LOCATION)} />
                        <LinkButton icon={<StarIcon />} text="Avalie-nos" onClick={() => handleOpenModal(ModalType.REVIEW)} />
                    </div>
                </div>

                {/* Footer integrated inside the card design for mobile compactness */}
                <div className="w-full bg-black/5 p-2 sm:p-3 border-t border-black/5 shrink-0">
                    <Footer onDeveloperClick={() => handleOpenModal(ModalType.DEVELOPER)} />
                </div>
            </div>

        </main>
        
        <Modal
          isOpen={activeModal !== ModalType.NONE}
          onClose={handleCloseModal}
          title={getModalTitle()}
        >
          {getModalContent()}
        </Modal>
      </div>
  );
};

export default App;
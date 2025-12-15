import React, { useState, useCallback, FormEvent, useEffect } from 'react';
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
      proteina: false,
      almocoJantar: false,
      semanal: false,
      churrasco: false,
    },
    outrosText: '',
    pickupTime: '',
    message: '',
  });
  const [kitOrderData, setKitOrderData] = useState<KitOrderData>({
    name: '',
    pickupTime: '',
    kits: {
      proteina: 0,
      almocoJantar: 0,
      semanal: 0,
      churrasco: 0,
    },
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewStep, setReviewStep] = useState<'rating' | 'feedback'>('rating');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // No longer locking body scroll here since index.html handles overflow:hidden globally for the main view
  
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
        kits: { proteina: 0, almocoJantar: 0, semanal: 0, churrasco: 0 },
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
          case 'proteina': return 'Kit Proteína';
          case 'almocoJantar': return 'Kit Almoço e Jantar';
          case 'semanal': return 'Kit Semanal';
          case 'churrasco': return 'Kit Churrasco';
          default: return '';
        }
      });

    let fullMessage = `Olá, gostaria de fazer um pedido!\n\n`;
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
      fullMessage += `*Mensagem:*\n${orderData.message}`;
    }
    
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
              case 'semanal': name = 'Kit Semanal'; break;
              case 'almocoJantar': name = 'Kit Almoço e Jantar'; break;
              case 'proteina': name = 'Kit Proteína'; break;
              case 'churrasco': name = 'Kit Churrasco'; break;
          }
          return `${quantity}x ${name}`;
      });

    if (selectedKits.length === 0) {
      alert('Por favor, selecione a quantidade de pelo menos um kit.');
      return;
    }

    let message = `Olá! Gostaria de solicitar os seguintes kits:\n\n`;
    message += selectedKits.join('\n');
    message += `\n\n*Nome para retirada:* ${kitOrderData.name}`;
    message += `\n*Horário de retirada:* ${kitOrderData.pickupTime}`;

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
  
  const getPickupTimeConstraints = () => {
    const today = new Date().getDay();
    if (today === 0) {
      return { min: '07:00', max: '13:00' };
    }
    return { min: '07:00', max: '20:00' };
  };

  const renderOrderForm = () => {
    const { min, max } = getPickupTimeConstraints();
    const itemCategories = [
        { id: 'carnes', label: 'Carnes' },
        { id: 'acompanhamentos', label: 'Acomp.' },
        { id: 'kits', label: 'Kits' },
        { id: 'panificadora', label: 'Pães' },
        { id: 'outros', label: 'Outros' },
    ];
    const kitOptions = [
      { id: 'proteina', label: 'Kit Proteína' },
      { id: 'almocoJantar', label: 'Kit Almoço/Jantar' },
      { id: 'semanal', label: 'Kit Semanal' },
      { id: 'churrasco', label: 'Kit Churrasco' },
    ];

    return (
        <form onSubmit={handleOrderSubmit} className="space-y-3">
            <div>
                <label htmlFor="name" className="block mb-1 text-xs uppercase tracking-wide text-neutral-400">Seu nome</label>
                <input type="text" id="name" name="name" onChange={handleOrderChange} value={orderData.name} required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none transition-colors" />
            </div>
            
            <div>
                <label className="block mb-1 text-xs uppercase tracking-wide text-neutral-400">Interesses</label>
                <div className="flex flex-wrap gap-2">
                    {itemCategories.map(item => (
                        <label key={item.id} className={`flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 cursor-pointer transition-all ${orderData.items[item.id as keyof typeof orderData.items] ? 'bg-red-900/40 border-red-500/50' : 'hover:bg-white/10'}`}>
                            <input type="checkbox" id={item.id} name={item.id} onChange={handleOrderChange} checked={orderData.items[item.id as keyof typeof orderData.items]} className="hidden" />
                            <span className={`text-xs font-medium ${orderData.items[item.id as keyof typeof orderData.items] ? 'text-white' : 'text-neutral-400'}`}>{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {orderData.items.kits && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2 animate-enter">
                <label className="block text-xs uppercase tracking-wide text-neutral-400">Selecione os kits:</label>
                <div className="grid grid-cols-2 gap-2">
                  {kitOptions.map(kit => (
                      <label key={kit.id} className={`flex items-center justify-center text-center p-2 rounded border cursor-pointer transition-all ${orderData.selectedKits[kit.id as keyof typeof orderData.selectedKits] ? 'bg-red-900/40 border-red-500/50' : 'bg-transparent border-white/10 hover:bg-white/5'}`}>
                          <input type="checkbox" id={kit.id} name={kit.id} onChange={handleOrderChange} checked={orderData.selectedKits[kit.id as keyof typeof orderData.selectedKits]} className="hidden" />
                          <span className="text-xs">{kit.label}</span>
                      </label>
                  ))}
                </div>
              </div>
            )}

            {orderData.items.outros && (
                <div>
                    <input type="text" id="outrosText" name="outrosText" onChange={handleOrderChange} value={orderData.outrosText} placeholder="O que você precisa?" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none text-sm" />
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="pickupTime" className="block mb-1 text-xs uppercase tracking-wide text-neutral-400">Retirada ({min}-{max})</label>
                    <input type="time" id="pickupTime" name="pickupTime" onChange={handleOrderChange} value={orderData.pickupTime} min={min} max={max} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none text-sm" />
                </div>
            </div>

            <div>
                <textarea id="message" name="message" rows={2} onChange={handleOrderChange} value={orderData.message} placeholder="Observações..." className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:border-red-500 focus:outline-none text-sm"></textarea>
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
                 <p className="text-sm text-neutral-400 uppercase tracking-widest">Toque para avaliar</p>
            </div>
        );
    } else {
        return (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <p className="text-sm text-neutral-300">Como podemos melhorar sua experiência?</p>
                <textarea 
                    id="feedbackMessage"
                    name="feedbackMessage"
                    rows={4}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Digite aqui..."
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                />
                <button 
                  type="submit" 
                  disabled={isSubmittingFeedback}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
          <div className="flex flex-col items-center space-y-6 py-2">
            
            <div className="text-center relative">
              <div className="absolute -inset-10 bg-red-900/20 blur-3xl rounded-full opacity-20 pointer-events-none"></div>
              <h1 className="font-display text-4xl font-bold tracking-widest uppercase relative z-10">
                <span className="text-white drop-shadow-lg">NELORE</span> <span className="text-[#850305] drop-shadow-lg">BRASIL</span>
              </h1>
              <p className="text-[10px] text-neutral-500 tracking-[0.4em] uppercase mt-2">
                Tradição & Qualidade
              </p>
            </div>

            <div className="text-center space-y-4 px-2">
              <p className="text-neutral-300 leading-relaxed font-light text-sm text-justify">
                A <strong className="text-white">Nelore Brasil</strong> é sinônimo de excelência. Nossa missão é transformar o seu churrasco e o seu dia a dia, levando até a sua mesa cortes selecionados com rigoroso controle de procedência.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center space-x-4">
                    <div className="p-2.5 bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-red-900/10 text-[#850305]">
                       <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-display text-base text-white tracking-wide uppercase">Qualidade</h3>
                        <p className="text-[11px] text-neutral-400">Rigoroso controle sanitário.</p>
                    </div>
                </div>
                
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center space-x-4">
                     <div className="p-2.5 bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-red-900/10 text-[#850305]">
                       <BeefIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-display text-base text-white tracking-wide uppercase">Premium</h3>
                        <p className="text-[11px] text-neutral-400">Cortes nobres selecionados.</p>
                    </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center space-x-4">
                     <div className="p-2.5 bg-gradient-to-br from-red-900/20 to-black rounded-lg border border-red-900/10 text-[#850305]">
                       <HeartIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-display text-base text-white tracking-wide uppercase">Paixão</h3>
                        <p className="text-[11px] text-neutral-400">Amor pelo que fazemos.</p>
                    </div>
                </div>
            </div>

            <div className="w-full text-center pt-2">
               <p className="text-white font-medium italic text-sm border-t border-white/10 pt-4">
                  "O verdadeiro sabor da carne de qualidade."
               </p>
            </div>
          </div>
        );
      case ModalType.LOCATION:
        return (
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                 <p className="text-sm text-neutral-300 mb-1">Endereço</p>
                 <p className="font-medium text-white">R. Siqueira Campos, 1998</p>
                 <p className="text-sm text-neutral-400">Uvaranas, Ponta Grossa - PR</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-xs text-red-400 font-bold uppercase mb-1">Seg - Sáb</p>
                    <p className="text-sm font-semibold">07:00 - 20:00</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <p className="text-xs text-red-400 font-bold uppercase mb-1">Domingo</p>
                    <p className="text-sm font-semibold">07:00 - 13:00</p>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 h-40 relative group">
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
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block w-full bg-white text-black font-bold text-center py-3 rounded-xl hover:bg-neutral-200 transition-colors">
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
            <p className="text-sm text-neutral-300 max-w-xs mx-auto">
              Transformamos ideias em experiências digitais de luxo.
            </p>
            
            <div className="w-full space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-4 h-4 text-neutral-500" />
                </div>
                <input
                  type="text"
                  value={devContactName}
                  onChange={(e) => setDevContactName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 p-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
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
            
            <a href={INSTAGRAM_LINK_DEV} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1">
               <InstagramIcon className="w-3 h-3" /> @inteligenciarte.ia
            </a>
          </div>
        );
      case ModalType.KITS:
        const { min, max } = getPickupTimeConstraints();
        const totalKitQuantity = Object.values(kitOrderData.kits).reduce((sum: number, qty) => sum + (qty as number), 0);
        const isKitSubmitDisabled = totalKitQuantity === 0 || !kitOrderData.name.trim() || !kitOrderData.pickupTime;
        
        const kitsInfo = [
          { id: 'semanal', name: 'Kit Semanal', price: 'R$69,90', items: ['Acém cubos 400g', 'Músculo cubos 400g', 'Almondegas 400g', 'Peito Frango 400g', 'Pernil cubos 400g'] },
          { id: 'almocoJantar', name: 'Almoço & Jantar', price: 'R$129,90', items: ['Moída 800g', 'Bife Bovino 800g', 'Músculo 400g', 'Peito Frango 800g', 'Pernil 1.2kg'] },
          { id: 'proteina', name: 'Kit Proteína', price: 'R$79,90', items: ['2x Moída 400g', '2x Bife Bovino 400g', '1x Músculo 400g'] },
        ];

        return (
          <form onSubmit={handleKitOrderSubmit} className="space-y-4">
            <div className="space-y-3 overflow-y-auto max-h-[40vh] pr-1">
              {kitsInfo.map(kit => (
                <div key={kit.id} className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                        <h4 className="font-bold text-white text-sm">{kit.name}</h4>
                        <span className="text-xs text-red-400 font-bold">{kit.price}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/40 rounded-lg p-1">
                      <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], -1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20">-</button>
                      <span className="font-bold text-white w-4 text-center text-sm">{kitOrderData.kits[kit.id as keyof KitOrderData['kits']]}</span>
                      <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20">+</button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-tight">
                    {kit.items.join(' • ')}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <input type="text" name="name" onChange={handleKitInfoChange} value={kitOrderData.name} required placeholder="Seu nome" className="bg-white/5 border border-white/10 text-white text-xs rounded-lg p-2.5 focus:border-red-500 outline-none" />
                <input type="time" name="pickupTime" onChange={handleKitInfoChange} value={kitOrderData.pickupTime} min={min} max={max} required className="bg-white/5 border border-white/10 text-white text-xs rounded-lg p-2.5 focus:border-red-500 outline-none" />
            </div>

            <button type="submit" disabled={isKitSubmitDisabled} className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Pedir no WhatsApp
            </button>
          </form>
        );
      default:
        return null;
    }
  }, [activeModal, orderData, devContactName, rating, hoverRating, reviewStep, feedbackMessage, kitOrderData, isSubmittingFeedback]);

  return (
      <div className="fixed inset-0 w-full h-[100svh] flex items-center justify-center overflow-hidden bg-black/50">
        
        {/* Main Card Container - Centered and constrained */}
        <main className="w-full h-full max-w-[430px] flex flex-col items-center justify-center p-4 relative z-10 animate-enter">
            
            {/* Glass Card */}
            <div className="w-full flex flex-col items-center bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
                
                {/* Top highlight glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <div className="p-6 w-full flex flex-col items-center space-y-4 md:space-y-6">
                    <Profile onSpinFinish={handleSpinFinish} isZooming={isZooming} />
                    
                    <div className="w-full space-y-2 md:space-y-3">
                        <LinkButton icon={<InfoIcon />} text="Quem Somos?" onClick={() => handleOpenModal(ModalType.ABOUT)} />
                        <LinkButton icon={<WhatsAppIcon />} text="Faça seu Pedido" onClick={() => handleOpenModal(ModalType.ORDER)} />
                        <LinkButton icon={<BoxIcon />} text="Nossos Kits" onClick={() => handleOpenModal(ModalType.KITS)} />
                        <LinkButton icon={<InstagramIcon />} text="Instagram" href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" />
                        <LinkButton icon={<LocationIcon />} text="Localização" onClick={() => handleOpenModal(ModalType.LOCATION)} />
                        <LinkButton icon={<StarIcon />} text="Avalie-nos" onClick={() => handleOpenModal(ModalType.REVIEW)} />
                    </div>
                </div>

                {/* Footer integrated inside the card design for mobile compactness */}
                <div className="w-full bg-black/20 p-3 border-t border-white/5">
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
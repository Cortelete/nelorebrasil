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


  // State for the review modal
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewStep, setReviewStep] = useState<'rating' | 'feedback'>('rating');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    if (activeModal !== ModalType.NONE) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }

    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [activeModal]);
  
  useEffect(() => {
    if (isZooming) {
      // Start opening the modal shortly after the zoom animation begins
      const openModalTimer = setTimeout(() => {
        handleOpenModal(ModalType.ABOUT);
      }, 250);

      // Reset the transition state after the animation is complete
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
      // FIX: Cast the value to boolean to ensure correct type inference down the chain.
      // Object.entries on a typed object without an index signature can lead to `unknown` values.
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
    // Placeholder for formsubmit.io integration
    console.log('Feedback to be sent:', feedbackMessage);
    alert('Obrigado pelo seu feedback! Vamos trabalhar para melhorar.');
    handleCloseModal();
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
      // FIX: Cast quantity to number to allow comparison.
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
    const today = new Date().getDay(); // Sunday = 0, Monday = 1, etc.
    if (today === 0) { // Sunday
      return { min: '07:00', max: '13:00' };
    }
    // Monday to Saturday
    return { min: '07:00', max: '21:00' };
  };

  const renderOrderForm = () => {
    const { min, max } = getPickupTimeConstraints();
    const itemCategories = [
        { id: 'carnes', label: 'Carnes' },
        { id: 'acompanhamentos', label: 'Acompanhamentos' },
        { id: 'kits', label: 'Kits' },
        { id: 'panificadora', label: 'Panificadora' },
        { id: 'outros', label: 'Outros' },
    ];
    const kitOptions = [
      { id: 'proteina', label: 'Kit Proteína' },
      { id: 'almocoJantar', label: 'Kit Almoço e Jantar' },
      { id: 'semanal', label: 'Kit Semanal' },
      { id: 'churrasco', label: 'Kit Churrasco' },
    ];

    return (
        <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Seu nome</label>
                <input type="text" id="name" name="name" onChange={handleOrderChange} value={orderData.name} required className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
            </div>
            
            <div>
                <label className="block mb-2 text-sm font-medium">O que você procura? (Opcional)</label>
                <div className="grid grid-cols-2 gap-2">
                    {itemCategories.map(item => (
                        <label key={item.id} htmlFor={item.id} className="flex items-center space-x-2 bg-black/20 border border-white/10 rounded-lg p-2.5 cursor-pointer has-[:checked]:bg-red-700/50 has-[:checked]:border-red-500 transition-colors">
                            <input type="checkbox" id={item.id} name={item.id} onChange={handleOrderChange} checked={orderData.items[item.id as keyof typeof orderData.items]} className="w-4 h-4 text-red-600 bg-neutral-700 border-neutral-600 rounded focus:ring-red-500 flex-shrink-0" />
                            <span className="min-w-0 break-words">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {orderData.items.kits && (
              <div className="p-3 bg-black/20 border border-white/10 rounded-lg space-y-2">
                <label className="block text-sm font-medium">Selecione os kits desejados:</label>
                <div className="grid grid-cols-2 gap-2">
                  {kitOptions.map(kit => (
                      <label key={kit.id} htmlFor={kit.id} className="flex items-center space-x-2 bg-black/20 border border-white/10 rounded-lg p-2.5 cursor-pointer has-[:checked]:bg-red-700/50 has-[:checked]:border-red-500 transition-colors">
                          <input type="checkbox" id={kit.id} name={kit.id} onChange={handleOrderChange} checked={orderData.selectedKits[kit.id as keyof typeof orderData.selectedKits]} className="w-4 h-4 text-red-600 bg-neutral-700 border-neutral-600 rounded focus:ring-red-500 flex-shrink-0" />
                          <span className="min-w-0 break-words text-sm">{kit.label}</span>
                      </label>
                  ))}
                </div>
              </div>
            )}

            {orderData.items.outros && (
                <div>
                    <label htmlFor="outrosText" className="block mb-2 text-sm font-medium">Especifique "Outros"</label>
                    <input type="text" id="outrosText" name="outrosText" onChange={handleOrderChange} value={orderData.outrosText} placeholder="Ex: Bebidas, carvão..." className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
            )}

            <div>
                <label htmlFor="pickupTime" className="block mb-2 text-sm font-medium">Horário de retirada (Opcional)</label>
                <input type="time" id="pickupTime" name="pickupTime" onChange={handleOrderChange} value={orderData.pickupTime} min={min} max={max} className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                <p className="text-xs text-neutral-400 mt-1">Horário de funcionamento hoje: {min} - {max}</p>
            </div>

            <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">Mensagem (Opcional)</label>
                <textarea id="message" name="message" rows={3} onChange={handleOrderChange} value={orderData.message} placeholder="Alguma observação ou dúvida?" className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"></textarea>
            </div>

            <button type="submit" className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                Enviar pedido via WhatsApp
            </button>
        </form>
    );
  };

  const renderReviewModalContent = () => {
    if (reviewStep === 'rating') {
        return (
            <div className="flex flex-col items-center text-center">
                <p className="mb-4">Sua opinião é muito importante para nós!</p>
                <div 
                    className="flex space-x-2 text-yellow-400"
                    onMouseLeave={() => setHoverRating(0)}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                            key={star} 
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            className="p-1"
                        >
                            <StarIcon 
                                className="w-8 h-8 transition-all duration-200"
                                isFilled={star <= (hoverRating || rating)}
                            />
                        </button>
                    ))}
                </div>
                 <p className="text-xs text-neutral-400 mt-4">Clique para avaliar</p>
            </div>
        );
    } else { // 'feedback' step
        return (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <p>Lamentamos que sua experiência não tenha sido perfeita. Por favor, conte-nos como podemos melhorar:</p>
                <div>
                    <label htmlFor="feedbackMessage" className="sr-only">Sua mensagem</label>
                    <textarea 
                        id="feedbackMessage"
                        name="feedbackMessage"
                        rows={4}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Deixe seu feedback aqui..."
                        required
                        className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5"
                    />
                </div>
                <button type="submit" className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                    Enviar Feedback
                </button>
            </form>
        );
    }
  };

  const getModalContent = useCallback(() => {
    switch (activeModal) {
      case ModalType.ABOUT:
        return (
          <div className="space-y-6 text-center text-neutral-300">
            <div className="flex justify-center items-center gap-3">
              <span className="text-2xl">🥩</span>
              <h3 className="font-display text-2xl tracking-wider uppercase">
                <span className="text-white">NELORE</span> <span style={{ color: '#850305' }}>BRASIL</span>
              </h3>
            </div>
            <p className="italic text-neutral-200">"A paixão pela carne transformada em arte."</p>

            <div className="space-y-5 text-left pt-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-red-500 pt-1"><HeartIcon /></div>
                    <div>
                        <h4 className="font-bold text-white">Paixão e Tradição</h4>
                        <p className="text-sm">Nascemos em Ponta Grossa com o propósito de elevar o padrão da carne premium, valorizando cada cliente.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-red-500 pt-1"><ShieldCheckIcon /></div>
                    <div>
                        <h4 className="font-bold text-white">Qualidade Garantida</h4>
                        <p className="text-sm">Oferecemos cortes selecionados com origem controlada e procedência garantida, escolhidos com o máximo rigor.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 text-red-500 pt-1"><SparklesIcon /></div>
                    <div>
                        <h4 className="font-bold text-white">Uma Nova Experiência</h4>
                        <p className="text-sm">Nossa estrutura foi pensada para encantar, do ambiente moderno ao cuidado em cada detalhe do preparo.</p>
                    </div>
                </div>
            </div>
            
            <p className="font-bold text-white pt-4">
                <span className="font-display tracking-wider uppercase text-lg">
                    <span className="text-white">NELORE</span> <span style={{ color: '#850305' }}>BRASIL</span>
                </span>
                <span className="font-sans normal-case tracking-normal"> — o sabor da excelência na sua mesa.</span>
            </p>
          </div>
        );
      case ModalType.LOCATION:
        return (
          <div>
            <p className="mb-4">
              Estamos na R. Siqueira Campos, 1998 - Uvaranas, Ponta Grossa - PR.
            </p>
            <p className="font-bold">Horários:</p>
            <p>Seg a Sáb: 07:00 - 21:00</p>
            <p>Domingo: 07:00 - 13:00</p>
            <div className="aspect-w-16 aspect-h-9 my-4 rounded-lg overflow-hidden border border-white/10" style={{aspectRatio: '16/9'}}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.7068611396953!2d-50.123185799999995!3d-25.111782499999997!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x94e81b002070dde5%3A0x4a2deb2ba543261!2sNelore%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1762874184008!5m2!1spt-BR!2sbr" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="w-full mt-4 inline-block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
                Abrir no Google Maps
            </a>
          </div>
        );
      case ModalType.ORDER:
        return renderOrderForm();
      case ModalType.REVIEW:
        return renderReviewModalContent();
      case ModalType.DEVELOPER:
        return (
          <div className="flex flex-col items-center text-center space-y-5">
            <p className="text-sm text-neutral-300">
              Este site foi desenvolvido com paixão e tecnologia pela InteligenciArte.IA.
            </p>
            
            <div className="w-full">
              <label htmlFor="devContactName" className="sr-only">Seu nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="devContactName"
                  value={devContactName}
                  onChange={(e) => setDevContactName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full pl-10 p-2.5 transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handleDevContactSubmit} 
              disabled={!devContactName.trim()}
              className="relative w-full text-white font-medium rounded-lg text-sm px-5 py-3 text-center overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              <span className="relative z-10">Quer um site incrível como esse? Fale comigo! 🚀</span>
            </button>

            <div className="flex items-center space-x-2">
              <p className="text-xs text-neutral-400">Ou siga-nos no Instagram:</p>
              <a href={INSTAGRAM_LINK_DEV} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        );
      case ModalType.KITS:
        const { min, max } = getPickupTimeConstraints();
        // FIX: Operator '+' cannot be applied to types 'unknown' and 'number'.
        // This is resolved by explicitly typing the accumulator 'sum' as a number.
        const totalKitQuantity = Object.values(kitOrderData.kits).reduce((sum: number, qty) => sum + (qty as number), 0);
        const isKitSubmitDisabled = totalKitQuantity === 0 || !kitOrderData.name.trim() || !kitOrderData.pickupTime;
        
        const kitsInfo = [
          { id: 'semanal', name: 'Kit Semanal', price: 'R$69,90', items: ['Acém em cubos - 400g', 'Músculo em cubos - 400g', 'Almondegas - 400g', 'Bife de peito de frango - 400g', 'Pernil de porco em cubos - 400g'] },
          { id: 'almocoJantar', name: 'Kit Almoço e Jantar', price: 'R$129,90', items: ['Carne Moída - 800g', 'Bife Bovino - 800g', 'Músculo - 400g', 'Bife de peito de frango - 800g', 'Pernil de porco em cubos - 1200g'] },
          { id: 'proteina', name: 'Kit Proteína', price: 'R$79,90', items: ['2 bandejas de carne moída - 400g', '2 bandejas de bife bovino - 400g', '1 bandeja de músculo - 400g'] },
        ];

        return (
          <form onSubmit={handleKitOrderSubmit} className="space-y-6">
            <div className="space-y-4">
              {kitsInfo.map(kit => (
                <div key={kit.id}>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg text-white">{kit.name} <span className="text-red-500 font-normal">{kit.price}</span></h4>
                    <div className="flex items-center space-x-3 bg-black/20 border border-white/10 rounded-full">
                      <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], -1)} className="px-2 py-1 rounded-full hover:bg-white/10 transition-colors">-</button>
                      <span className="font-bold text-white w-4 text-center">{kitOrderData.kits[kit.id as keyof KitOrderData['kits']]}</span>
                      <button type="button" onClick={() => handleKitQuantityChange(kit.id as keyof KitOrderData['kits'], 1)} className="px-2 py-1 rounded-full hover:bg-white/10 transition-colors">+</button>
                    </div>
                  </div>
                  <ul className="list-disc list-inside text-neutral-300 mt-2 space-y-1 text-sm">
                    {kit.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  <hr className="border-white/10 mt-4" />
                </div>
              ))}
               <div>
                  <h4 className="font-bold text-lg text-white">Kit Churrasco</h4>
                  <p className="text-neutral-400 text-sm mt-2">Em breve mais detalhes sobre nosso kit churrasco!</p>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
                <div>
                    <label htmlFor="kit-name" className="block mb-2 text-sm font-medium">Seu nome</label>
                    <input type="text" id="kit-name" name="name" onChange={handleKitInfoChange} value={kitOrderData.name} required className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                </div>
                 <div>
                    <label htmlFor="kit-pickupTime" className="block mb-2 text-sm font-medium">Horário de retirada</label>
                    <input type="time" id="kit-pickupTime" name="pickupTime" onChange={handleKitInfoChange} value={kitOrderData.pickupTime} min={min} max={max} required className="bg-black/20 border border-white/10 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5" />
                    <p className="text-xs text-neutral-400 mt-1">Horário de funcionamento hoje: {min} - {max}</p>
                </div>
            </div>

            <button type="submit" disabled={isKitSubmitDisabled} className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors disabled:bg-neutral-600 disabled:cursor-not-allowed">
              Solicitar Kits via WhatsApp
            </button>
          </form>
        );
      default:
        return null;
    }
  }, [activeModal, orderData, devContactName, rating, hoverRating, reviewStep, feedbackMessage, kitOrderData]);

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
        <main className="w-full max-w-lg mx-auto flex flex-col items-center gap-y-4 my-auto relative z-10">
            <div className="w-full bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <Profile onSpinFinish={handleSpinFinish} isZooming={isZooming} />
                <div className="space-y-3">
                    <LinkButton icon={<InfoIcon />} text="Quem Somos?" onClick={() => handleOpenModal(ModalType.ABOUT)} />
                    <LinkButton icon={<WhatsAppIcon />} text="Faça seu Pedido" onClick={() => handleOpenModal(ModalType.ORDER)} />
                    <LinkButton icon={<BoxIcon />} text="Nossos Kits" onClick={() => handleOpenModal(ModalType.KITS)} />
                    <LinkButton icon={<InstagramIcon />} text="Nosso Instagram" href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" />
                    <LinkButton icon={<LocationIcon />} text="Localização e Horários" onClick={() => handleOpenModal(ModalType.LOCATION)} />
                    <LinkButton icon={<StarIcon />} text="Avalie-nos" onClick={() => handleOpenModal(ModalType.REVIEW)} />
                </div>
            </div>
            <Footer onDeveloperClick={() => handleOpenModal(ModalType.DEVELOPER)} />
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
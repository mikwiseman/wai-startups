export interface Industry {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
}

export const INDUSTRIES: Industry[] = [
  {
    id: "fintech",
    name: "ФинТех",
    nameEn: "FinTech",
    icon: "💳",
    description: "Финансовые технологии, платежи, банкинг",
  },
  {
    id: "healthtech",
    name: "ХелсТех",
    nameEn: "HealthTech",
    icon: "🏥",
    description: "Медицина, здоровье, телемедицина",
  },
  {
    id: "edtech",
    name: "ЭдТех",
    nameEn: "EdTech",
    icon: "📚",
    description: "Образование, онлайн-обучение, EdTech",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    nameEn: "E-commerce",
    icon: "🛒",
    description: "Электронная коммерция, онлайн-торговля",
  },
  {
    id: "saas",
    name: "SaaS",
    nameEn: "SaaS",
    icon: "☁️",
    description: "Программное обеспечение как услуга",
  },
  {
    id: "ai-ml",
    name: "AI/ML",
    nameEn: "AI/ML",
    icon: "🤖",
    description: "Искусственный интеллект, машинное обучение",
  },
  {
    id: "logistics",
    name: "Логистика",
    nameEn: "Logistics",
    icon: "🚚",
    description: "Доставка, логистика, цепочки поставок",
  },
  {
    id: "proptech",
    name: "ПропТех",
    nameEn: "PropTech",
    icon: "🏠",
    description: "Недвижимость, PropTech",
  },
  {
    id: "foodtech",
    name: "ФудТех",
    nameEn: "FoodTech",
    icon: "🍔",
    description: "Еда, доставка еды, рестораны",
  },
  {
    id: "greentech",
    name: "ГринТех",
    nameEn: "GreenTech",
    icon: "🌱",
    description: "Экология, устойчивое развитие, CleanTech",
  },
  {
    id: "hrtech",
    name: "HRTech",
    nameEn: "HRTech",
    icon: "👥",
    description: "HR, рекрутинг, управление персоналом",
  },
  {
    id: "legaltech",
    name: "ЛигалТех",
    nameEn: "LegalTech",
    icon: "⚖️",
    description: "Юридические технологии",
  },
  {
    id: "insurtech",
    name: "ИншурТех",
    nameEn: "InsurTech",
    icon: "🛡️",
    description: "Страхование, InsurTech",
  },
  {
    id: "traveltech",
    name: "ТравелТех",
    nameEn: "TravelTech",
    icon: "✈️",
    description: "Путешествия, туризм, бронирование",
  },
  {
    id: "cybersecurity",
    name: "Кибербезопасность",
    nameEn: "Cybersecurity",
    icon: "🔒",
    description: "Информационная безопасность",
  },
  {
    id: "gaming",
    name: "Гейминг",
    nameEn: "Gaming",
    icon: "🎮",
    description: "Игры, гейм-дизайн, esports",
  },
  {
    id: "social",
    name: "Соцсети",
    nameEn: "Social",
    icon: "💬",
    description: "Социальные сети, коммуникации",
  },
  {
    id: "marketplaces",
    name: "Маркетплейсы",
    nameEn: "Marketplaces",
    icon: "🏪",
    description: "Торговые площадки, C2C/B2B платформы",
  },
  {
    id: "devtools",
    name: "DevTools",
    nameEn: "DevTools",
    icon: "🛠️",
    description: "Инструменты для разработчиков",
  },
  {
    id: "crypto-web3",
    name: "Крипто/Web3",
    nameEn: "Crypto/Web3",
    icon: "⛓️",
    description: "Криптовалюты, блокчейн, Web3",
  },
  {
    id: "mediatech",
    name: "МедиаТех",
    nameEn: "MediaTech",
    icon: "🎬",
    description: "Медиа, контент, стриминг",
  },
  {
    id: "agrotech",
    name: "АгроТех",
    nameEn: "AgroTech",
    icon: "🌾",
    description: "Сельское хозяйство, AgriTech",
  },
];

export const REGIONS = [
  "North America",
  "Western Europe",
  "Eastern Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa",
];

export const COUNTRIES = [
  "США",
  "Великобритания",
  "Германия",
  "Франция",
  "Израиль",
  "Индия",
  "Китай",
  "Сингапур",
  "Бразилия",
  "ОАЭ",
  "Нидерланды",
  "Швеция",
  "Канада",
  "Австралия",
  "Япония",
];

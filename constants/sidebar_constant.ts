interface IPage {
  title: string
  name: string
  icon: string
  isActive: boolean
}

// pages was "Home, Customers, Tables, Orders, Reports, Settings"
export const pages = ref<IPage[]>([
  {
    title: 'Accueil',
    name: 'home',
    icon: 'i-carbon-home',
    isActive: true,
  },
  {
    title: 'Clients',
    name: 'customer',
    icon: 'i-carbon-user',
    isActive: false,
  },
  {
    title: 'Tables',
    name: 'table',
    icon: 'i-carbon-thumbnail-preview',
    isActive: false,
  },
  {
    title: 'Commandes',
    name: 'order',
    icon: 'i-carbon-order-details',
    isActive: false,
  },
  {
    title: 'Rapports',
    name: 'report',
    icon: 'i-carbon-report-data',
    isActive: false,
  },
  {
    title: 'Paramètres',
    name: 'setting',
    icon: 'i-carbon-settings-adjust',
    isActive: false,
  },
])

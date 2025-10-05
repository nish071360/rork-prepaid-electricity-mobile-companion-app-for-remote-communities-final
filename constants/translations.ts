export type Language = "English" | "Yumplatok" | "Kriol";

export interface Translations {
  settings: string;
  language: string;
  textSize: string;
  help: string;
  home: string;
  history: string;
  alerts: string;
  moneyLeft: string;
  day: string;
  days: string;
  aboutDaysLeft: string;
  lowAddCreditSoon: string;
  today: string;
  deviceConnection: string;
  bluetooth: string;
  connected: string;
  disconnected: string;
  manageDevice: string;
  connectDevice: string;
  syncNow: string;
  recharge: string;
  usage: string;
  week: string;
  month: string;
  total: string;
  averagePer: string;
  hour: string;
  newAlerts: string;
  noAlerts: string;
  hoursAgo: string;
  yesterday: string;
  daysAgo: string;
  now: string;
  small: string;
  medium: string;
  large: string;
  chooseLanguage: string;
  chooseTextSize: string;
  cancel: string;
  helpMessage: string;
  findChargingStations: string;
  toRechargeYourAccount: string;
  tapButtonBelowToOpenMaps: string;
  openMaps: string;
  onceAtChargingStation: string;
  syncData: string;
  readyToSync: string;
  syncing: string;
  syncComplete: string;
  syncFailed: string;
  offline: string;
  whatGetsSynced: string;
  energyUsageData: string;
  creditTransactions: string;
  alertPreferences: string;
  deviceSettings: string;
  startSync: string;
  queueForSync: string;
  lastSuccessfulSync: string;
  sensorSetup: string;
  enableBluetooth: string;
  weNeedBluetoothAccess: string;
  scanningForDevices: string;
  makeSureYourEnergyMonitor: string;
  searchingForDevices: string;
  scanAgain: string;
  connecting: string;
  establishingConnection: string;
  successfullyConnected: string;
  device: string;
  signal: string;
  testingConnection: string;
  testComplete: string;
  readingDataFromMonitor: string;
  successfullyReceivedData: string;
  connectionEstablished: string;
  dataStreamActive: string;
  currentReading: string;
  setupComplete: string;
  yourEnergyMonitorIsConnected: string;
  done: string;
  step: string;
  of: string;
  tapToConnect: string;
  excellent: string;
  good: string;
  fair: string;
  poor: string;
  kWh: string;
  lowCreditWarning: string;
  lowCreditWarningMessage: string;
  highUsageDetected: string;
  highUsageDetectedMessage: string;
  creditRunningLow: string;
  creditRunningLowMessage: string;
}

export const translations: Record<Language, Translations> = {
  English: {
    settings: "Settings",
    language: "Language",
    textSize: "Text Size",
    help: "Help",
    home: "Home",
    history: "History",
    alerts: "Alerts",
    moneyLeft: "Money Left",
    day: "day",
    days: "days",
    aboutDaysLeft: "About",
    lowAddCreditSoon: "LOW - Add credit soon",
    today: "Today",
    deviceConnection: "Device Connection",
    bluetooth: "Bluetooth",
    connected: "Connected",
    disconnected: "Disconnected",
    manageDevice: "Manage Device",
    connectDevice: "Connect Device",
    syncNow: "Sync Now",
    recharge: "Recharge",
    usage: "Usage",
    week: "Week",
    month: "Month",
    total: "Total",
    averagePer: "Average per",
    hour: "hour",
    newAlerts: "New",
    noAlerts: "No alerts",
    hoursAgo: "hours ago",
    yesterday: "Yesterday",
    daysAgo: "days ago",
    now: "Now",
    small: "Small",
    medium: "Medium",
    large: "Large",
    chooseLanguage: "Choose language",
    chooseTextSize: "Choose text size",
    cancel: "Cancel",
    helpMessage: "Contact your community energy office for help",
    findChargingStations: "Find Charging Stations",
    toRechargeYourAccount: "To recharge your account, visit a nearby charging station or hub. We'll help you find the closest locations.",
    tapButtonBelowToOpenMaps: "Tap the button below to open your maps app and find charging stations near you.",
    openMaps: "Open Maps",
    onceAtChargingStation: "Once at a charging station, follow the on-site instructions to add credit to your account.",
    syncData: "Sync Data",
    readyToSync: "Ready to sync",
    syncing: "Syncing...",
    syncComplete: "Sync complete",
    syncFailed: "Sync failed",
    offline: "Offline",
    whatGetsSynced: "What gets synced:",
    energyUsageData: "Energy usage data",
    creditTransactions: "Credit transactions",
    alertPreferences: "Alert preferences",
    deviceSettings: "Device settings",
    startSync: "Start Sync",
    queueForSync: "Queue for Sync",
    lastSuccessfulSync: "Last successful sync: 2 hours ago",
    sensorSetup: "Sensor Setup",
    enableBluetooth: "Enable Bluetooth",
    weNeedBluetoothAccess: "We need Bluetooth access to connect to your energy monitor sensor.",
    scanningForDevices: "Scanning for Devices",
    makeSureYourEnergyMonitor: "Make sure your energy monitor is powered on and nearby.",
    searchingForDevices: "Searching for devices...",
    scanAgain: "Scan Again",
    connecting: "Connecting...",
    establishingConnection: "Establishing connection to",
    successfullyConnected: "Successfully connected to",
    device: "Device",
    signal: "Signal",
    testingConnection: "Testing Connection",
    testComplete: "Test Complete",
    readingDataFromMonitor: "Reading data from your energy monitor...",
    successfullyReceivedData: "Successfully received data from your sensor!",
    connectionEstablished: "Connection established",
    dataStreamActive: "Data stream active",
    currentReading: "Current reading: 2.4 kW",
    setupComplete: "Setup Complete!",
    yourEnergyMonitorIsConnected: "Your energy monitor is now connected and ready to track your usage.",
    done: "Done",
    step: "Step",
    of: "of",
    tapToConnect: "Tap to connect",
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    kWh: "kWh",
    lowCreditWarning: "Low Credit Warning",
    lowCreditWarningMessage: "Your credit balance is below $10. Consider topping up soon.",
    highUsageDetected: "High Usage Detected",
    highUsageDetectedMessage: "Today's usage is 25% above your average. Check for any unusual appliance activity.",
    creditRunningLow: "Credit Running Low",
    creditRunningLowMessage: "At current usage rate, your credit will run out in 2 days.",
  },
  Yumplatok: {
    settings: "Ol Seting",
    language: "Langgus",
    textSize: "Saes blong Raetem",
    help: "Halpem",
    home: "Hom",
    history: "Histri",
    alerts: "Ol Woning",
    moneyLeft: "Mane i Stap",
    day: "dei",
    days: "ol dei",
    aboutDaysLeft: "Samting olsem",
    lowAddCreditSoon: "I LOO - Putum moa kredit kwiktaem",
    today: "Tude",
    deviceConnection: "Koneksen blong Masin",
    bluetooth: "Bluetooth",
    connected: "I Konektem",
    disconnected: "I No Konektem",
    manageDevice: "Lukaftarem Masin",
    connectDevice: "Konektem Masin",
    syncNow: "Sinkronaisem Nao",
    recharge: "Putum Moa Paoa",
    usage: "Yusem",
    week: "Wik",
    month: "Manis",
    total: "Olgeta",
    averagePer: "Averis long",
    hour: "aua",
    newAlerts: "Nyu",
    noAlerts: "I no gat woning",
    hoursAgo: "aua i go pinis",
    yesterday: "Yestedei",
    daysAgo: "ol dei i go pinis",
    now: "Nao",
    small: "Smol",
    medium: "Mediem",
    large: "Bigwan",
    chooseLanguage: "Kiusim langgus",
    chooseTextSize: "Kiusim saes blong raetem",
    cancel: "Kenselem",
    helpMessage: "Kontaktem yur komuniti enesi ofis blong halpem",
    findChargingStations: "Faenem Ol Ples blong Putum Paoa",
    toRechargeYourAccount: "Blong putum moa paoa long akant blong yu, yu mas go long wan ples blong putum paoa i stap klostu. Yumi bae halpem yu faenem.",
    tapButtonBelowToOpenMaps: "Presem baten daon ia blong openem map blong yu mo faenem ol ples blong putum paoa i stap klostu long yu.",
    openMaps: "Openem Map",
    onceAtChargingStation: "Taem yu stap long ples blong putum paoa, folem ol instruksen i stap long ples ia blong putum kredit long akant blong yu.",
    syncData: "Sinkronaisem Data",
    readyToSync: "Redi blong sinkronaisem",
    syncing: "I Sinkronaisem...",
    syncComplete: "Sinkronaisem i finis",
    syncFailed: "Sinkronaisem i feil",
    offline: "I No Onlaen",
    whatGetsSynced: "Wanem i sinkronaisem:",
    energyUsageData: "Data blong yusem enesi",
    creditTransactions: "Ol transaksen blong kredit",
    alertPreferences: "Ol preferens blong woning",
    deviceSettings: "Ol seting blong masin",
    startSync: "Statem Sinkronaisem",
    queueForSync: "Putum long Laen blong Sinkronaisem",
    lastSuccessfulSync: "Las taem sinkronaisem i gud: 2 aua i go pinis",
    sensorSetup: "Setupem Sensa",
    enableBluetooth: "Mekem Bluetooth i Wok",
    weNeedBluetoothAccess: "Yumi nidim akses long Bluetooth blong konektem long enesi monita sensa blong yu.",
    scanningForDevices: "Lukluk blong Ol Masin",
    makeSureYourEnergyMonitor: "Mekem sua se enesi monita blong yu i onem mo i stap klostu.",
    searchingForDevices: "Lukluk blong ol masin...",
    scanAgain: "Lukluk Bakegen",
    connecting: "I Konektem...",
    establishingConnection: "Mekem koneksen long",
    successfullyConnected: "I konektem gud long",
    device: "Masin",
    signal: "Signal",
    testingConnection: "Testem Koneksen",
    testComplete: "Test i Finis",
    readingDataFromMonitor: "Ridem data long enesi monita blong yu...",
    successfullyReceivedData: "I resivim gud data long sensa blong yu!",
    connectionEstablished: "Koneksen i mekem gud",
    dataStreamActive: "Data strim i wok",
    currentReading: "Ridem nao: 2.4 kW",
    setupComplete: "Setup i Finis!",
    yourEnergyMonitorIsConnected: "Enesi monita blong yu i konektem nao mo redi blong traktem yusem blong yu.",
    done: "Finis",
    step: "Step",
    of: "long",
    tapToConnect: "Presem blong konektem",
    excellent: "Tumas Gud",
    good: "Gud",
    fair: "Oraet",
    poor: "No Gud Tumas",
    kWh: "kWh",
    lowCreditWarning: "Woning blong Loo Kredit",
    lowCreditWarningMessage: "Kredit blong yu i stap anda $10. Tingim blong putum moa kwiktaem.",
    highUsageDetected: "Yusem Tumas i Faenem",
    highUsageDetectedMessage: "Yusem tude i 25% moa long averis blong yu. Lukim sapos i gat wan masin i yusem tumas.",
    creditRunningLow: "Kredit i Stap Lus",
    creditRunningLowMessage: "Long ret blong yusem nao, kredit blong yu bae i finis long 2 dei.",
  },
  Kriol: {
    settings: "Ol Seting",
    language: "Langgwij",
    textSize: "Saiz blanga Raitin",
    help: "Halpem",
    home: "Houm",
    history: "Histri",
    alerts: "Ol Woning",
    moneyLeft: "Mani i Stap",
    day: "dei",
    days: "ol dei",
    aboutDaysLeft: "Samting olsem",
    lowAddCreditSoon: "I LOO - Putum moa kredit kwikawei",
    today: "Tudei",
    deviceConnection: "Konekshan blanga Mashin",
    bluetooth: "Bluetooth",
    connected: "I Konekted",
    disconnected: "I No Konekted",
    manageDevice: "Lukaftabat Mashin",
    connectDevice: "Konektem Mashin",
    syncNow: "Singkronaisem Nau",
    recharge: "Putum Moa Pawa",
    usage: "Yusem",
    week: "Wik",
    month: "Manis",
    total: "Olgidabat",
    averagePer: "Averij langa",
    hour: "awa",
    newAlerts: "Nyu",
    noAlerts: "I no gat woning",
    hoursAgo: "awa i bin go",
    yesterday: "Yestadei",
    daysAgo: "ol dei i bin go",
    now: "Nau",
    small: "Smol",
    medium: "Midiyam",
    large: "Bigwan",
    chooseLanguage: "Jujim langgwij",
    chooseTextSize: "Jujim saiz blanga raitin",
    cancel: "Kenselem",
    helpMessage: "Kontaktem yua komuniti enaji ofis blanga halpem",
    findChargingStations: "Faindem Ol Pleis blanga Putum Pawa",
    toRechargeYourAccount: "Blanga putum moa pawa langa akawnt blanga yu, yu mas go langa wan pleis blanga putum pawa i stap klous. Yumob bla halpem yu faindem.",
    tapButtonBelowToOpenMaps: "Presem batan daun hiya blanga openem map blanga yu mo faindem ol pleis blanga putum pawa i stap klous langa yu.",
    openMaps: "Openem Map",
    onceAtChargingStation: "Taim yu stap langa pleis blanga putum pawa, folem ol instrukshan i stap langa pleis hiya blanga putum kredit langa akawnt blanga yu.",
    syncData: "Singkronaisem Data",
    readyToSync: "Redi blanga singkronaisem",
    syncing: "I Singkronaisem...",
    syncComplete: "Singkronaisem i finish",
    syncFailed: "Singkronaisem i feil",
    offline: "I No Onlain",
    whatGetsSynced: "Wanim i singkronaisem:",
    energyUsageData: "Data blanga yusem enaji",
    creditTransactions: "Ol transakshan blanga kredit",
    alertPreferences: "Ol preferens blanga woning",
    deviceSettings: "Ol seting blanga mashin",
    startSync: "Statem Singkronaisem",
    queueForSync: "Putum langa Lain blanga Singkronaisem",
    lastSuccessfulSync: "Las taim singkronaisem i bin gud: 2 awa i bin go",
    sensorSetup: "Setupem Sensa",
    enableBluetooth: "Mekem Bluetooth i Wok",
    weNeedBluetoothAccess: "Yumob nidim akses langa Bluetooth blanga konektem langa enaji monita sensa blanga yu.",
    scanningForDevices: "Lukluk blanga Ol Mashin",
    makeSureYourEnergyMonitor: "Mekem shua se enaji monita blanga yu i onem mo i stap klous.",
    searchingForDevices: "Lukluk blanga ol mashin...",
    scanAgain: "Lukluk Bagen",
    connecting: "I Konektin...",
    establishingConnection: "Mekem konekshan langa",
    successfullyConnected: "I konekted gud langa",
    device: "Mashin",
    signal: "Signal",
    testingConnection: "Testem Konekshan",
    testComplete: "Test i Finish",
    readingDataFromMonitor: "Ridem data langa enaji monita blanga yu...",
    successfullyReceivedData: "I resivim gud data langa sensa blanga yu!",
    connectionEstablished: "Konekshan i mekem gud",
    dataStreamActive: "Data strim i wok",
    currentReading: "Ridem nau: 2.4 kW",
    setupComplete: "Setup i Finish!",
    yourEnergyMonitorIsConnected: "Enaji monita blanga yu i konekted nau mo redi blanga traktem yusem blanga yu.",
    done: "Finish",
    step: "Step",
    of: "langa",
    tapToConnect: "Presem blanga konektem",
    excellent: "Tumas Gud",
    good: "Gud",
    fair: "Orait",
    poor: "No Gud Tumas",
    kWh: "kWh",
    lowCreditWarning: "Woning blanga Loo Kredit",
    lowCreditWarningMessage: "Kredit blanga yu i stap anda $10. Tingabat blanga putum moa kwikawei.",
    highUsageDetected: "Yusem Tumas i Faindem",
    highUsageDetectedMessage: "Yusem tudei i 25% moa langa averij blanga yu. Lukim sapos i gat wan mashin i yusem tumas.",
    creditRunningLow: "Kredit i Stap Lus",
    creditRunningLowMessage: "Langa ret blanga yusem nau, kredit blanga yu bla finish langa 2 dei.",
  },
};

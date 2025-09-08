// Script pour initialiser toutes les tables 1 à 50
// Usage: node scripts/init-all-50-tables.js

const initAllTables = async () => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
  const password = 'FD2025INIT'
  
  console.log('🎮 Initialisation de toutes les tables 1 à 50...')
  console.log(`📍 URL: ${baseUrl}`)
  
  try {
    const response = await fetch(`${baseUrl}/api/init-all-tables?password=${password}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Initialisation réussie!')
      console.log(`✨ Nouvelles tables créées: ${data.totalCreated}`)
      console.log(`📌 Tables déjà existantes: ${data.totalExisting}`)
      console.log(`📊 Total: 50 tables`)
      
      if (data.createdTables.length > 0) {
        console.log('\n📝 Tables créées:')
        data.createdTables.forEach(table => console.log(`  - ${table}`))
      }
      
      if (data.existingTables.length > 0) {
        console.log('\n📋 Tables déjà existantes:')
        data.existingTables.forEach(table => console.log(`  - ${table}`))
      }
      
      console.log(`\n${data.message}`)
    } else {
      console.error('❌ Erreur:', data.error)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel à l\'API:', error.message)
    console.log('💡 Assurez-vous que le serveur est en cours d\'exécution')
    console.log('💡 Pour démarrer le serveur: npm run dev')
  }
}

// Fonction pour vérifier le statut actuel des tables
const checkTablesStatus = async () => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
  
  console.log('🔍 Vérification du statut actuel des tables...')
  
  try {
    // Cette requête utilisera l'endpoint game-state pour voir les tables existantes
    const response = await fetch(`${baseUrl}/api/game-state`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`📊 Tables actuellement enregistrées: ${data.registrations?.length || 0}`)
    }
  } catch (error) {
    console.log('ℹ️  Impossible de vérifier le statut actuel')
  }
}

// Script principal
const main = async () => {
  console.log('🚀 Script d\'initialisation des tables de mariage')
  console.log('=' .repeat(50))
  
  // Vérifier le statut actuel
  await checkTablesStatus()
  
  console.log('\n' + '=' .repeat(50))
  
  // Initialiser toutes les tables
  await initAllTables()
  
  console.log('\n✅ Script terminé!')
}

// Exécuter le script principal
main()
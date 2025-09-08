// Script pour initialiser les tables 1 à 40
// Usage: node scripts/init-tables.js

const initTables = async () => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
  const password = 'FD2025'
  
  console.log('🎮 Initialisation des tables 1 à 40...')
  console.log(`📍 URL: ${baseUrl}`)
  
  try {
    const response = await fetch(`${baseUrl}/api/init-tables?password=${password}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Initialisation réussie!')
      console.log(`📊 Total des tables enregistrées: ${data.totalRegistered}`)
      
      // Afficher le résumé
      const created = data.results.filter(r => r.status === 'created').length
      const existing = data.results.filter(r => r.status === 'already_exists').length
      const errors = data.results.filter(r => r.status === 'error').length
      
      console.log(`✨ Nouvelles tables créées: ${created}`)
      console.log(`📌 Tables déjà existantes: ${existing}`)
      if (errors > 0) {
        console.log(`❌ Erreurs: ${errors}`)
      }
      
      // Afficher les erreurs s'il y en a
      data.results
        .filter(r => r.status === 'error')
        .forEach(r => console.error(`❌ ${r.table}: ${r.error}`))
    } else {
      console.error('❌ Erreur:', data.error)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'appel à l\'API:', error.message)
    console.log('💡 Assurez-vous que le serveur est en cours d\'exécution')
  }
}

// Exécuter le script
initTables()
// Script de test pour vérifier les fonctionnalités du jeu
// Usage: node scripts/test-game.js

const testGame = async () => {
  const baseUrl = process.env.SITE_URL || 'https://francois-divine.vercel.app'
  
  console.log('🧪 Test des fonctionnalités du jeu')
  console.log(`📍 URL: ${baseUrl}`)
  console.log('━'.repeat(50))
  
  try {
    // 1. Vérifier les tables enregistrées
    console.log('\n1️⃣ Vérification des tables enregistrées...')
    const gameStateResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getRegisteredTables' })
    })
    
    if (!gameStateResponse.ok) {
      throw new Error(`Erreur HTTP: ${gameStateResponse.status}`)
    }
    
    const gameState = await gameStateResponse.json()
    
    if (!gameState || !gameState.registeredTables) {
      console.log('❌ Réponse invalide de l\'API')
      return
    }
    
    const registeredTables = Object.keys(gameState.registeredTables)
    console.log(`✅ ${registeredTables.length} tables enregistrées`)
    
    // Vérifier que toutes les tables sont au bon format
    const invalidTables = registeredTables.filter(
      table => !/^Table ([1-9]|[1-3][0-9]|40)$/.test(table)
    )
    
    if (invalidTables.length > 0) {
      console.log(`⚠️  Tables invalides trouvées: ${invalidTables.join(', ')}`)
    } else {
      console.log('✅ Toutes les tables sont au format correct')
    }
    
    // 2. Vérifier l'état des événements
    console.log('\n2️⃣ Vérification de l\'état des événements...')
    const eventsResponse = await fetch(`${baseUrl}/api/events-state`)
    
    if (!eventsResponse.ok) {
      throw new Error(`Erreur HTTP: ${eventsResponse.status}`)
    }
    
    const eventsState = await eventsResponse.json()
    const eventCount = Object.keys(eventsState).length
    console.log(`✅ ${eventCount} événements avec état persisté`)
    
    // 3. Vérifier la configuration du jeu
    console.log('\n3️⃣ Vérification de la configuration du jeu...')
    const configResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getConfig' })
    })
    
    if (!configResponse.ok) {
      throw new Error(`Erreur HTTP: ${configResponse.status}`)
    }
    
    const config = await configResponse.json()
    console.log(`✅ Jeu ${config.isGameEnabled ? 'activé' : 'désactivé'}`)
    
    // 4. Vérifier le classement
    console.log('\n4️⃣ Vérification du classement...')
    const leaderboardResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getLeaderboard' })
    })
    
    if (!leaderboardResponse.ok) {
      throw new Error(`Erreur HTTP: ${leaderboardResponse.status}`)
    }
    
    const leaderboard = await leaderboardResponse.json()
    console.log(`✅ ${leaderboard.leaderboard.length} tables dans le classement`)
    
    // Résumé
    console.log('\n' + '━'.repeat(50))
    console.log('📊 Résumé du test:')
    console.log(`   - Tables enregistrées: ${registeredTables.length}/40`)
    console.log(`   - Tables invalides: ${invalidTables.length}`)
    console.log(`   - Événements persistés: ${eventCount}`)
    console.log(`   - Jeu activé: ${config.isGameEnabled ? 'Oui' : 'Non'}`)
    console.log(`   - Tables actives: ${leaderboard.leaderboard.length}`)
    
    if (registeredTables.length >= 40 && invalidTables.length === 0) {
      console.log('\n✅ Tout est prêt pour le mariage ! 🎉')
    } else {
      console.log('\n⚠️  Quelques ajustements peuvent être nécessaires')
      if (invalidTables.length > 0) {
        console.log('\n💡 Pour nettoyer les tables invalides, exécutez:')
        console.log(`   curl "${baseUrl}/api/clean-tables?password=FD2025CLEAN"`)
      }
    }
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message)
    console.log('💡 Vérifiez que le site est accessible et que la base de données est configurée')
  }
}

// Exécuter le test
testGame()
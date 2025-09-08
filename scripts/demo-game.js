// Script de démonstration du jeu pour une table
// Usage: node scripts/demo-game.js [numéro de table]

const demoGame = async () => {
  const baseUrl = process.env.SITE_URL || 'https://francois-divine.vercel.app'
  const tableNumber = process.argv[2] || '1'
  const tableName = `Table ${tableNumber}`
  
  console.log('🎮 Démonstration du jeu de mariage')
  console.log(`📍 URL: ${baseUrl}`)
  console.log(`🪑 Table: ${tableName}`)
  console.log('━'.repeat(50))
  
  try {
    // 1. Vérifier que la table est enregistrée
    console.log('\n1️⃣ Vérification de l\'enregistrement de la table...')
    const checkResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getRegisteredTables' })
    })
    
    const gameState = await checkResponse.json()
    const tables = Object.keys(gameState.registeredTables || {})
    
    if (!tables.includes(tableName)) {
      console.log(`❌ La table "${tableName}" n'est pas enregistrée`)
      console.log('💡 Tables disponibles:', tables.filter(t => /^Table \d+$/.test(t)).sort((a,b) => {
        const numA = parseInt(a.replace('Table ', ''))
        const numB = parseInt(b.replace('Table ', ''))
        return numA - numB
      }).join(', '))
      return
    }
    
    console.log('✅ Table enregistrée')
    
    // 2. Récupérer la progression actuelle
    console.log('\n2️⃣ Récupération de la progression...')
    const progressResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'getProgress',
        tableNumber: tableName
      })
    })
    
    const progress = await progressResponse.json()
    
    if (progress.error) {
      console.log('ℹ️  Aucune progression trouvée - nouvelle partie')
    } else if (progress.progress) {
      console.log('✅ Progression existante trouvée:')
      console.log(`   - Score total: ${progress.progress.totalScore || 0} points`)
      console.log(`   - Phases complétées: ${progress.progress.phases?.filter(p => p.completed).length || 0}/3`)
    }
    
    // 3. Simuler le début d'une partie
    console.log('\n3️⃣ Simulation du début de partie...')
    const startResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'updateProgress',
        tableNumber: tableName,
        progress: {
          tableNumber: tableName,
          phases: [
            { phase: 1, completed: false, score: 0, answers: [] },
            { phase: 2, completed: false, score: 0, answers: [] },
            { phase: 3, completed: false, score: 0, answers: [] }
          ],
          totalScore: 0,
          lastActivity: Date.now()
        }
      })
    })
    
    if (startResponse.ok) {
      console.log('✅ Partie initialisée avec succès')
    } else {
      console.log('❌ Erreur lors de l\'initialisation')
    }
    
    // 4. Vérifier le classement
    console.log('\n4️⃣ Vérification du classement...')
    const leaderboardResponse = await fetch(`${baseUrl}/api/game-state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getLeaderboard' })
    })
    
    const leaderboard = await leaderboardResponse.json()
    
    if (leaderboard.leaderboard && leaderboard.leaderboard.length > 0) {
      console.log('🏆 Top 5 du classement:')
      leaderboard.leaderboard.slice(0, 5).forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.tableNumber}: ${entry.totalScore} points`)
      })
    } else {
      console.log('ℹ️  Aucune table n\'a encore de score')
    }
    
    // Résumé
    console.log('\n' + '━'.repeat(50))
    console.log('📊 Test terminé avec succès!')
    console.log(`\n🎯 Pour jouer, visitez: ${baseUrl}`)
    console.log(`   1. Faites défiler jusqu'au jeu`)
    console.log(`   2. Sélectionnez "${tableName}"`)
    console.log(`   3. Cliquez sur "Commencer l'aventure"`)
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la démonstration:', error.message)
  }
}

// Exécuter la démo
demoGame()
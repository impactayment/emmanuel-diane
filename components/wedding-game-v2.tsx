"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGameSync } from "@/hooks/useGameSync"
import { toast } from "@/components/ui/use-toast"
import { 
  Trophy, 
  Users, 
  CheckCircle, 
  XCircle, 
  GamepadIcon, 
  Hash, 
  Lock, 
  Clock,
  Sparkles,
  ChevronRight,
  Medal,
  Star,
  Zap,
  BarChart,
  RefreshCw
} from "lucide-react"

// Types de questions
type QuestionType = 'boolean' | 'multiple' | 'text'

interface Question {
  id: number
  phase: number
  question: string
  type: QuestionType
  answer?: boolean
  correctAnswer?: string
  options?: string[]
  explanation?: string
  points: number
}

interface PhaseProgress {
  phase: number
  completed: boolean
  score: number
  answers: (string | boolean)[]
  completedAt?: number
}

interface TableProgress {
  tableNumber: string
  phases: PhaseProgress[]
  totalScore: number
  lastActivity: number
}

// Configuration des phases
const PHASES = [
  {
    id: 1,
    name: "Phase 1 : Découverte",
    unlockTime: "18:00",
    icon: "🌟",
    color: "from-blue-400 to-blue-600",
    description: "Apprenez à connaître Emmanuel et Diane"
  },
  {
    id: 2,
    name: "Phase 2 : Histoire d'amour",
    unlockTime: "18:30",
    icon: "💕",
    color: "from-pink-400 to-pink-600",
    description: "Leur parcours romantique"
  },
  {
    id: 3,
    name: "Phase 3 : Grand final",
    unlockTime: "21:30",
    icon: "🎊",
    color: "from-purple-400 to-purple-600",
    description: "Questions surprises et défis"
  }
]

// Questions pour chaque phase (10 par phase)
const QUESTIONS: Question[] = [
  // Phase 1 - Questions générales
  {
    id: 1,
    phase: 1,
    question: "Qui est le plus susceptible de se faire arnaquer par un faux mail ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane a tendance à être plus confiante avec les emails !",
    points: 10
  },
  {
    id: 2,
    phase: 1,
    question: "Qui survivrait le moins longtemps à Koh-Lanta ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane préfère le confort à l'aventure extrême !",
    points: 15
  },
  {
    id: 3,
    phase: 1,
    question: "Qui connaît par cœur les pubs TV… mais pas l'anniversaire de la tante ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel a une mémoire sélective pour les publicités !",
    points: 15
  },
  {
    id: 4,
    phase: 1,
    question: "Qui de nous deux a parlé mariage en premier ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel a été le premier à évoquer le mariage",
    points: 15
  },
  {
    id: 5,
    phase: 1,
    question: "Qui de nous deux oublie toujours ses mots de passe ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane a besoin de réinitialiser ses mots de passe régulièrement !",
    points: 10
  },
  {
    id: 6,
    phase: 1,
    question: "Diane est une vraie couche-tard. Impossible d'être au lit avant 00h.",
    type: "boolean",
    answer: false,
    explanation: "Faux ! Diane aime se coucher tôt pour être en forme",
    points: 15
  },
  {
    id: 7,
    phase: 1,
    question: "Je suis fervent(e) supporter(trice) du Lion d'or, qui suis-je ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane est une grande supportrice du Lion d'or !",
    points: 20
  },
  
  // Phase 2 - Qui de nous deux ?
  {
    id: 8,
    phase: 2,
    question: "Je suis passé par Roubaix, j'ai fait le feu à Lambersart, je me suis fait des amis à Wattrelos et je me suis expatrié en Belgique, qui suis-je ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel a voyagé dans toutes ces villes du Nord !",
    points: 15
  },
  {
    id: 9,
    phase: 2,
    question: "Je suis fan des couleurs de St Etienne mais ils se font toujours battre par les Lyonnais. Qui suis-je ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane supporte l'AS Saint-Étienne malgré les défaites !",
    points: 15
  },
  {
    id: 10,
    phase: 2,
    question: "Êtes-vous bien accueillis ce soir ? La téranga c'est dans les veines. Qui suis-je ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel a la téranga (hospitalité) dans les veines !",
    points: 15
  },
  {
    id: 11,
    phase: 2,
    question: "Qui est le/la plus gourmand(e) ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane est la plus gourmande du couple !",
    points: 10
  },
  {
    id: 12,
    phase: 2,
    question: "Qui passe le plus de temps sur l'ordinateur ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel est toujours sur son ordinateur !",
    points: 10
  },
  {
    id: 13,
    phase: 2,
    question: "Qui rappe le mieux ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel a des talents cachés de rappeur !",
    points: 15
  },
  {
    id: 14,
    phase: 2,
    question: "Qui chante le mieux ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane a une voix magnifique !",
    points: 15
  },
  {
    id: 15,
    phase: 2,
    question: "Qui est le/la plus maniaque ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel aime que tout soit parfaitement rangé !",
    points: 10
  },
  
  // Phase 3 - Grand final
  {
    id: 16,
    phase: 3,
    question: "Qui est le/la plus romantique ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane est la plus romantique du couple !",
    points: 15
  },
  {
    id: 17,
    phase: 3,
    question: "On se connaît depuis l'année où tout le monde pleurait devant l'Euro. Combien d'années cela fait-il qu'on se connaît ?",
    type: "text",
    correctAnswer: "9 ans",
    explanation: "Ils se connaissent depuis 9 ans !",
    points: 20
  },
  {
    id: 18,
    phase: 3,
    question: "Où avons-nous fait notre premier voyage ensemble ?",
    type: "multiple",
    options: ["Brésil", "Rwanda", "Sénégal"],
    correctAnswer: "Sénégal",
    explanation: "Leur premier voyage ensemble était au Sénégal !",
    points: 15
  },
  {
    id: 19,
    phase: 3,
    question: "Qui a le plus de paires de chaussures ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Emmanuel",
    explanation: "Emmanuel collectionne les chaussures !",
    points: 10
  },
  {
    id: 20,
    phase: 3,
    question: "Qui a toujours froid ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane a toujours besoin d'un pull supplémentaire !",
    points: 10
  },
  {
    id: 21,
    phase: 3,
    question: "Qui veut toujours goûter les plats bizarres au resto ?",
    type: "multiple",
    options: ["Emmanuel", "Diane"],
    correctAnswer: "Diane",
    explanation: "Diane est aventureuse avec la nourriture !",
    points: 15
  },
  {
    id: 22,
    phase: 3,
    question: "Je suis l'enfant préféré(e) de ma mère, je fais des jaloux auprès de mes frères et sœurs mais je les aime quand même ❤️",
    type: "multiple",
    options: ["Emmanuel", "Diane", "Les deux"],
    correctAnswer: "Les deux",
    explanation: "Ils sont tous les deux les préférés de leur maman !",
    points: 20
  }
]

export default function WeddingGameV2() {
  const [tableNumber, setTableNumber] = useState("")
  const [newTableName, setNewTableName] = useState("")
  const [currentPhase, setCurrentPhase] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const [tableProgress, setTableProgress] = useState<TableProgress | null>(null)
  const [showPhaseComplete, setShowPhaseComplete] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [password, setPassword] = useState("")
  const [bypassTimeRestriction, setBypassTimeRestriction] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [showLeaderboardPassword, setShowLeaderboardPassword] = useState(false)
  const [leaderboardPassword, setLeaderboardPassword] = useState("")
  const [globalBypass, setGlobalBypass] = useState(false)
  
  // Utiliser le hook de synchronisation
  const { 
    registeredTables, 
    tableProgress: serverProgress, 
    visibleProgress,
    registerTable: registerTableServer,
    updateProgress,
    completePhase,
    refresh,
    gameConfig
  } = useGameSync()

  // Mettre à jour l'heure toutes les 10 secondes pour une meilleure réactivité
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000) // 10 secondes au lieu de 60
    return () => clearInterval(timer)
  }, [])

  // Charger la progression de la table sélectionnée
  useEffect(() => {
    // Ne pas écraser les données locales si on est en train de jouer
    if (tableNumber && serverProgress[tableNumber] && !gameStarted) {
      const progress = serverProgress[tableNumber]
      // Convertir lastActivity de string ISO à timestamp
      const convertedProgress = {
        ...progress,
        tableNumber: tableNumber,
        lastActivity: typeof progress.lastActivity === 'string' 
          ? new Date(progress.lastActivity).getTime() 
          : progress.lastActivity
      }
      setTableProgress(convertedProgress)
    }
  }, [tableNumber, serverProgress, gameStarted])

  // Sauvegarder la table sélectionnée dans localStorage
  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('lastSelectedTable', tableNumber)
    }
  }, [tableNumber])
  
  // Debug: Observer les changements de selectedAnswer
  useEffect(() => {
    console.log("selectedAnswer changed to:", selectedAnswer)
  }, [selectedAnswer])

  // Restaurer la dernière table utilisée et l'état du jeu au chargement  
  useEffect(() => {
    // Ne restaurer qu'une seule fois au chargement initial
    if (registeredTables.length === 0 || gameStarted) return
    
    // Récupérer l'état sauvegardé depuis localStorage
    const savedGameState = localStorage.getItem('weddingGameState')
    
    if (savedGameState) {
      try {
        const gameState = JSON.parse(savedGameState)
        const timeSinceLastSave = Date.now() - gameState.timestamp
        
        // Ne restaurer que si la sauvegarde a moins de 30 minutes
        if (timeSinceLastSave < 30 * 60 * 1000 && registeredTables.includes(gameState.tableNumber)) {
          setTableNumber(gameState.tableNumber)
          setCurrentPhase(gameState.currentPhase || 0)
          setCurrentQuestionIndex(gameState.currentQuestion || 0)
          
          if (gameState.tableProgress) {
            setTableProgress(gameState.tableProgress)
          }
          
          // Marquer le jeu comme commencé
          setGameStarted(true)
          setShowResult(false)
          setSelectedAnswer(null)
          setTextAnswer("")
          
          console.log('Jeu restauré depuis localStorage:', {
            table: gameState.tableNumber,
            phase: gameState.currentPhase,
            question: gameState.currentQuestion
          })
          
          // Envoyer un toast pour informer l'utilisateur
          toast({
            title: "Jeu restauré",
            description: `Reprise à la question ${gameState.currentQuestion + 1} de la phase ${gameState.currentPhase + 1}`,
          })
        } else {
          // Sauvegarde trop ancienne ou table non valide, on la supprime
          localStorage.removeItem('weddingGameState')
          const lastTable = localStorage.getItem('lastSelectedTable')
          if (lastTable && registeredTables.includes(lastTable)) {
            setTableNumber(lastTable)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la restauration du jeu:', error)
        localStorage.removeItem('weddingGameState')
        const lastTable = localStorage.getItem('lastSelectedTable')
        if (lastTable && registeredTables.includes(lastTable)) {
          setTableNumber(lastTable)
        }
      }
    } else {
      // Pas de sauvegarde, essayer de restaurer juste la table
      const lastTable = localStorage.getItem('lastSelectedTable')
      if (lastTable && registeredTables.includes(lastTable) && !tableNumber) {
        setTableNumber(lastTable)
      }
    }
  }, [registeredTables]) // Retirer serverProgress et startGameWithTable des dépendances pour éviter les boucles

  // Vérifier si une phase est débloquée
  const isPhaseUnlocked = (phaseId: number): boolean => {
    // TEMPORAIRE: Désactiver les restrictions horaires pour les tests
    return true
    
    /*
    if (bypassTimeRestriction) return true
    
    const phase = PHASES.find(p => p.id === phaseId)
    if (!phase) return false
    
    const now = new Date() // Utiliser l'heure actuelle directement
    const [hours, minutes] = phase.unlockTime.split(':').map(Number)
    const unlockTime = new Date()
    unlockTime.setHours(hours, minutes, 0, 0)
    
    return now >= unlockTime
    */
  }

  // Obtenir les questions de la phase actuelle
  const getCurrentPhaseQuestions = () => {
    return QUESTIONS.filter(q => q.phase === currentPhase + 1)
  }

  // Calculer le score total d'une table
  const calculateTotalScore = (progress: TableProgress): number => {
    return progress.phases.reduce((total, phase) => total + phase.score, 0)
  }

  // Enregistrer une table
  const registerTable = async () => {
    if (!newTableName.trim() || registeredTables.includes(newTableName)) return
    
    const success = await registerTableServer(newTableName)
    if (success) {
      setNewTableName("")
      setShowRegisterForm(false)
      setRegistrationSuccess(true)
      refresh()
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setRegistrationSuccess(false)
      }, 3000)
    }
  }

  // Vérifier le mot de passe
  const checkPassword = () => {
    if (password === "ED2025") {
      setBypassTimeRestriction(true)
      setShowPasswordPrompt(false)
      setPassword("")
      startGameWithTable()
    } else {
      setPassword("")
    }
  }

  // Démarrer/reprendre le jeu
  const startGame = () => {
    if (!tableNumber.trim()) return

    // Vérifier si c'est une table valide (Table 1 à 50)
    if (!/^Table ([1-9]|[1-4][0-9]|50)$/.test(tableNumber)) {
      toast({
        title: "⚠️ Table invalide",
        description: "Veuillez sélectionner une table valide (Table 1 à Table 50)",
        variant: "destructive",
      })
      return
    }

    // Vérifier si au moins une phase est débloquée
    if (!isPhaseUnlocked(1) && !bypassTimeRestriction) {
      toast({
        title: "🎮 Jeu bientôt disponible",
        description: "Nous sommes en train de finaliser les derniers préparatifs. Merci de votre patience !",
        variant: "default",
      })
      return
    }

    startGameWithTable()
  }

  const startGameWithTable = useCallback(async () => {
    // Vérifier si la table a déjà une progression
    const existingProgress = serverProgress[tableNumber]
    
    if (existingProgress && existingProgress.phases) {
      // Convertir et créer une copie pour éviter les mutations
      const convertedProgress = {
        ...existingProgress,
        tableNumber: tableNumber,
        phases: [...existingProgress.phases],
        lastActivity: typeof existingProgress.lastActivity === 'string' 
          ? new Date(existingProgress.lastActivity).getTime() 
          : existingProgress.lastActivity
      }
      setTableProgress(convertedProgress)
      
      // Trouver la première phase non complétée ET débloquée
      let foundPhase = false
      let resumeQuestionIndex = 0
      
      for (let i = 0; i < existingProgress.phases.length; i++) {
        if (!existingProgress.phases[i].completed && isPhaseUnlocked(i + 1)) {
          setCurrentPhase(i)
          foundPhase = true
          
          // Restaurer la question où on s'était arrêté
          const phaseAnswers = existingProgress.phases[i].answers || []
          if (phaseAnswers.length > 0) {
            // Reprendre à la prochaine question non répondue
            resumeQuestionIndex = phaseAnswers.filter((a: any) => a !== null && a !== undefined).length
            const phaseQuestions = QUESTIONS.filter(q => q.phase === i + 1)
            if (resumeQuestionIndex < phaseQuestions.length) {
              setCurrentQuestionIndex(resumeQuestionIndex)
            } else if (resumeQuestionIndex === phaseQuestions.length) {
              // Toutes les questions de cette phase sont répondues, passer à la suivante
              setCurrentQuestionIndex(0)
            }
          }
          break
        }
      }
      
      if (!foundPhase) {
        // Toutes les phases sont complétées pour cette table
        // Permettre de recommencer depuis le début
        setCurrentPhase(0)
        setCurrentQuestionIndex(0)
        setShowPhaseComplete(false)
        
        // Réinitialiser la progression pour permettre de rejouer
        const resetProgress: TableProgress = {
          tableNumber,
          phases: PHASES.map(phase => ({
            phase: phase.id,
            completed: false,
            score: 0,
            answers: []
          })),
          totalScore: 0,
          lastActivity: Date.now()
        }
        
        setTableProgress(resetProgress)
        
        // Réinitialiser les 3 phases dans la base de données
        for (let i = 0; i < 3; i++) {
          await completePhase(tableNumber, {
            phase: i + 1,
            completed: false,
            score: 0,
            answers: [],
            completedAt: null
          })
        }
      }
    } else {
      // Créer une nouvelle progression pour cette table
      const newProgress: TableProgress = {
        tableNumber,
        phases: PHASES.map(phase => ({
          phase: phase.id,
          completed: false,
          score: 0,
          answers: []
        })),
        totalScore: 0,
        lastActivity: Date.now()
      }
      
      setTableProgress(newProgress)
      setCurrentPhase(0)
      
      // Initialiser les 3 phases dans la base de données
      for (let i = 0; i < 3; i++) {
        await completePhase(tableNumber, {
          phase: i + 1,
          completed: false,
          score: 0,
          answers: [],
          completedAt: null
        })
      }
    }
    
    setGameStarted(true)
    setSelectedAnswer(null)
    setTextAnswer("")
    setShowResult(false)
    
    // Sauvegarder l'état du jeu dans localStorage  
    const stateToSave = {
      tableNumber,
      currentPhase: currentPhase,
      currentQuestion: currentQuestionIndex,
      timestamp: Date.now()
    }
    localStorage.setItem('weddingGameState', JSON.stringify(stateToSave))
  }, [tableNumber, serverProgress, completePhase])

  // Gérer la réponse
  const handleAnswer = () => {
    const questions = getCurrentPhaseQuestions()
    const currentQuestion = questions[currentQuestionIndex]
    let isCorrect = false
    let points = 0

    switch (currentQuestion.type) {
      case 'boolean':
        isCorrect = selectedAnswer === currentQuestion.answer
        break
      case 'multiple':
        isCorrect = selectedAnswer === currentQuestion.correctAnswer
        break
      case 'text':
        // Comparaison flexible pour le texte
        const normalizedAnswer = textAnswer.toLowerCase().trim()
        const normalizedCorrect = currentQuestion.correctAnswer!.toLowerCase().trim()
        isCorrect = normalizedAnswer.includes(normalizedCorrect) || 
                   normalizedCorrect.includes(normalizedAnswer)
        break
    }

    if (isCorrect) {
      points = currentQuestion.points
    }

    // Mettre à jour le score
    if (tableProgress) {
      // Créer une copie profonde pour que React détecte les changements
      const updatedProgress = {
        ...tableProgress,
        phases: [...tableProgress.phases.map((phase, index) => {
          if (index === currentPhase) {
            return {
              ...phase,
              score: phase.score + points,
              answers: [...(phase.answers || [])],
            }
          }
          return { ...phase }
        })],
        totalScore: 0,
        lastActivity: Date.now()
      }
      
      // Vérifier que la phase existe
      if (!updatedProgress.phases[currentPhase]) {
        console.error("Phase non trouvée:", currentPhase, "dans", updatedProgress.phases)
        return
      }
      
      // Mettre à jour la réponse
      updatedProgress.phases[currentPhase].answers[currentQuestionIndex] = 
        currentQuestion.type === 'text' ? textAnswer : selectedAnswer!
      
      // Recalculer le score total
      updatedProgress.totalScore = calculateTotalScore(updatedProgress)
      
      setTableProgress(updatedProgress)
      
      // Sauvegarder dans localStorage pour persistance locale
      const gameState = {
        tableNumber,
        currentPhase,
        currentQuestion: currentQuestionIndex,
        tableProgress: updatedProgress,
        timestamp: Date.now()
      }
      localStorage.setItem('weddingGameState', JSON.stringify(gameState))
      
      // Sauvegarder après chaque question pour éviter de perdre les progrès
      updateProgress(tableNumber, {
        currentPhase: currentPhase + 1, // Phase 1-based dans l'API
        currentQuestion: currentQuestionIndex,
        answers: updatedProgress.phases[currentPhase].answers
      })
    }

    setShowResult(true)
  }

  // Question suivante
  const nextQuestion = async () => {
    const questions = getCurrentPhaseQuestions()
    
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setShowResult(false)
      setSelectedAnswer(null)
      setTextAnswer("")
      
      // Sauvegarder dans localStorage
      const gameState = {
        tableNumber,
        currentPhase,
        currentQuestion: nextIndex,
        tableProgress,
        timestamp: Date.now()
      }
      localStorage.setItem('weddingGameState', JSON.stringify(gameState))
      
      // Sauvegarder aussi la progression après avoir changé de question
      if (tableProgress) {
        await updateProgress(tableNumber, {
          currentPhase: currentPhase + 1,
          currentQuestion: nextIndex,
          answers: tableProgress.phases[currentPhase].answers
        })
      }
    } else {
      // Fin de la phase
      if (tableProgress) {
        const currentPhaseData = tableProgress?.phases?.[currentPhase]
        
        // Sauvegarder la phase complétée avec la nouvelle API
        await completePhase(tableNumber, {
          phase: currentPhase + 1, // Phase 1-based dans l'API
          completed: true,
          score: currentPhaseData.score,
          answers: currentPhaseData.answers,
          completedAt: new Date().toISOString()
        })
        
        // Mettre à jour localement avec une copie profonde
        const updatedProgress = {
          ...tableProgress,
          phases: tableProgress.phases.map((phase, index) => {
            if (index === currentPhase) {
              return {
                ...phase,
                completed: true,
                completedAt: Date.now()
              }
            }
            return phase
          })
        }
        setTableProgress(updatedProgress)
      }
      
      setShowPhaseComplete(true)
    }
  }

  // Passer à la phase suivante
  const goToNextPhase = () => {
    if (currentPhase < PHASES.length - 1 && isPhaseUnlocked(currentPhase + 2)) {
      const nextPhase = currentPhase + 1
      
      // Vérifier que la phase suivante a des questions
      const nextPhaseQuestions = QUESTIONS.filter(q => q.phase === nextPhase + 1)
      
      if (nextPhaseQuestions.length === 0) {
        console.error("Erreur: Aucune question pour la phase", nextPhase + 1)
        return
      }
      
      // Réinitialiser tous les états
      setCurrentPhase(nextPhase)
      setCurrentQuestionIndex(0)
      setShowPhaseComplete(false)
      setShowResult(false)
      setSelectedAnswer(null)
      setTextAnswer("")
      
      console.log("Passage à la phase", nextPhase + 1, "avec", nextPhaseQuestions.length, "questions")
    }
  }

  // Obtenir le classement avec scores visibles
  const getLeaderboard = () => {
    // Si le mot de passe est entré, afficher tous les scores réels
    if (bypassTimeRestriction || globalBypass) {
      return Object.values(serverProgress)
        .map(progress => ({
          ...progress,
          phases: progress.phases.map((phase: any) => ({
            ...phase,
            visible: true
          }))
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10)
    }
    
    const currentHour = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()
    const time = currentHour + currentMinutes / 60
    
    // Avant 18h30, pas de scores visibles
    if (time < 18.5) {
      return Object.values(visibleProgress)
        .map(table => ({ ...table, totalScore: 0 }))
        .slice(0, 10)
    }
    
    return Object.values(visibleProgress)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10)
  }
  
  // Vérifier le mot de passe du classement
  const checkLeaderboardPassword = () => {
    if (leaderboardPassword === "ED2025") {
      setGlobalBypass(true)
      setShowLeaderboardPassword(false)
      setLeaderboardPassword("")
    } else {
      setLeaderboardPassword("")
    }
  }

  // Variables pour l'interface de jeu
  const questions = getCurrentPhaseQuestions()
  const currentQuestion = questions[currentQuestionIndex]
  const phase = PHASES[currentPhase]
  
  // Protection contre les questions undefined
  if (gameStarted && !currentQuestion) {
    console.error("Question non trouvée", { currentPhase, currentQuestionIndex, questions })
    setGameStarted(false)
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="shadow-xl">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">Erreur: Question non trouvée. Veuillez réessayer.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Recharger la page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Interface principale
  if (!gameStarted) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
            <div className="text-center">
              <GamepadIcon className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Grand Jeu des Mariés</h1>
              <p className="text-xl opacity-90">Emmanuel & Diane</p>
            </div>
          </div>
          
          <CardContent className="p-8">
            {/* Sélection de table */}
            <div className="max-w-md mx-auto space-y-6 mb-12">
              {!registeredTables ? (
                <div className="text-center p-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                  <p className="mt-4 text-gray-600">Chargement des tables...</p>
                </div>
              ) : registeredTables.length > 0 ? (
                <>
                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-3">
                      <Hash className="w-5 h-5 inline mr-2" />
                      Sélectionnez votre table
                    </label>
                    <Select value={tableNumber} onValueChange={setTableNumber}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une table..." />
                      </SelectTrigger>
                      <SelectContent>
                        {registeredTables
                          .filter(table => /^Table \d+$/.test(table))
                          .sort((a, b) => {
                            const numA = parseInt(a.replace('Table ', ''))
                            const numB = parseInt(b.replace('Table ', ''))
                            return numA - numB
                          })
                          .map(table => (
                          <SelectItem key={table} value={table}>
                            {table}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    onClick={startGame}
                    disabled={!tableNumber}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Cliquez ici pour commencer à jouer
                  </Button>
                </>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Aucune table enregistrée pour le moment</p>
                </div>
              )}
              
              {/* Bouton d'enregistrement désactivé - Tables pré-enregistrées uniquement
              <Button
                onClick={() => setShowRegisterForm(true)}
                variant="outline"
                className="w-full border-purple-500 text-purple-500 hover:bg-purple-50"
              >
                <Users className="w-5 h-5 mr-2" />
                Enregistrer une nouvelle table
              </Button> */}
              
              {/* Message de succès */}
              {registrationSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
                  <span className="text-green-800 font-medium">Table enregistrée avec succès !</span>
                </div>
              )}
            </div>

            {/* Phases disponibles */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-center">Phases du jeu</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {PHASES.map((phase) => {
                  const unlocked = isPhaseUnlocked(phase.id)
                  const progress = tableProgress?.phases[phase.id - 1]
                  
                  return (
                    <Card 
                      key={phase.id} 
                      className={`relative overflow-hidden transition-all ${
                        unlocked ? 'shadow-lg hover:shadow-xl' : 'opacity-50'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-10`} />
                      <CardContent className="p-6 relative">
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-3xl">{phase.icon}</span>
                          {!unlocked && <Lock className="w-5 h-5 text-gray-400" />}
                          {progress?.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{phase.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            <span>Déblocage : {phase.unlockTime}</span>
                          </div>
                        </div>
                        
                        {unlocked && !progress?.completed && (
                          <Badge className="mt-3 bg-green-100 text-green-800">
                            Disponible
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>


            {/* Tables enregistrées - Section cachée
            {registeredTables.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3 text-center">
                  <Users className="w-5 h-5 inline mr-2 text-purple-500" />
                  Tables enregistrées ({registeredTables.length})
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {registeredTables.map((table) => (
                    <Badge
                      key={table}
                      className="bg-purple-100 text-purple-800 px-3 py-1"
                    >
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}

            {/* Classement - Affichage progressif mais sans montrer les scores */}
            <div className="mt-12">
              {(() => {
                const hour = currentTime.getHours()
                const minutes = currentTime.getMinutes()
                const time = hour + minutes / 60
                
                let title = "Classement"
                let subtitle = ""
                let showScores = false
                
                if (bypassTimeRestriction || globalBypass) {
                  title = "🔓 Classement Complet 🔓"
                  subtitle = "Accès privilégié - Tous les scores visibles"
                  showScores = true
                } else if (time < 18.5) {
                  subtitle = "Les scores seront visibles à partir de 18h30"
                } else if (time < 19) {
                  subtitle = "Classement après la Phase 1"
                } else if (time < 21.5) {
                  subtitle = "Classement après les Phases 1 et 2"
                } else if (time < 22) {
                  subtitle = "Classement provisoire - Phase finale en cours"
                } else {
                  title = "🏆 Classement Final 🏆"
                  subtitle = "Tous les scores sont révélés !"
                  showScores = true
                }
                
                return (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-center">
                      <Trophy className="w-6 h-6 inline mr-2 text-yellow-500" />
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-sm text-gray-600 text-center mb-4">{subtitle}</p>
                    )}
                  </>
                )
              })()}
              
              <div className="space-y-2">
                {getLeaderboard().slice(0, 5).map((table, index) => {
                  const hour = currentTime.getHours()
                  const minutes = currentTime.getMinutes()
                  const time = hour + minutes / 60
                  const showScores = (bypassTimeRestriction || globalBypass) || time >= 22
                  const isWinner = time >= 22 && index === 0
                  
                  return (
                    <div
                      key={table.tableNumber}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        isWinner ? 'bg-gradient-to-r from-yellow-200 to-yellow-100 border-2 border-yellow-400 shadow-lg animate-pulse' :
                        index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300' :
                        index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300' :
                        index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300' :
                        'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold">
                          {isWinner ? '👑' : index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : 
                           <span className="text-gray-400">#{index + 1}</span>}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {table.tableNumber}
                            {isWinner && <span className="ml-2 text-yellow-600">Champion !</span>}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {table.phases.map((phase, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  phase.visible && phase.completed ? 'bg-green-500' : 
                                  phase.completed ? 'bg-gray-400' : 'bg-gray-300'
                                }`}
                                title={phase.visible ? `Phase ${i + 1}: ${phase.score} pts` : 'Score caché'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">
                          {showScores ? table.totalScore : '?'}
                        </p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Indicateur pour plus de tables */}
              {getLeaderboard().length > 5 && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500 italic">
                    Top 5 affiché • {getLeaderboard().length - 5} autres tables en compétition
                  </p>
                </div>
              )}
              
              {/* Bouton pour débloquer les scores */}
              {!globalBypass && currentTime.getHours() + currentTime.getMinutes()/60 < 22 && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowLeaderboardPassword(true)}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-500 hover:bg-purple-50"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Débloquer tous les scores
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Modal mot de passe */}
        {showPasswordPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  Accès anticipé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600">
                  Le jeu n'est pas encore ouvert. Entrez le mot de passe pour accéder maintenant.
                </p>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') checkPassword()
                  }}
                  className="text-center"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowPasswordPrompt(false)
                      setPassword("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={checkPassword}
                    disabled={!password.trim()}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Valider
                  </Button>
                </div>
                {password && password !== "ED2025" && (
                  <p className="text-sm text-red-500 text-center">Mot de passe incorrect</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Modal pour enregistrer une nouvelle table */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  Enregistrer une table
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600">
                  Entrez le nom ou numéro de votre table
                </p>
                <Input
                  type="text"
                  placeholder="Ex: Table 5"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTableName.trim()) registerTable()
                  }}
                  className="text-center"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowRegisterForm(false)
                      setNewTableName("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={registerTable}
                    disabled={!newTableName.trim() || registeredTables.includes(newTableName)}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Enregistrer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Modal mot de passe pour le classement */}
        {showLeaderboardPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  Débloquer les scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-gray-600">
                  Entrez le mot de passe pour voir tous les scores maintenant.
                </p>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={leaderboardPassword}
                  onChange={(e) => setLeaderboardPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') checkLeaderboardPassword()
                  }}
                  className="text-center"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowLeaderboardPassword(false)
                      setLeaderboardPassword("")
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={checkLeaderboardPassword}
                    disabled={!leaderboardPassword.trim()}
                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Valider
                  </Button>
                </div>
                {leaderboardPassword && leaderboardPassword !== "ED2025" && (
                  <p className="text-sm text-red-500 text-center">Mot de passe incorrect</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Interface de jeu
  // Vérification de sécurité
  if (!currentQuestion) {
    console.error("Erreur: Pas de question trouvée", {
      currentPhase,
      currentQuestionIndex,
      questionsLength: questions.length
    })
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">Erreur: Question introuvable</p>
            <Button
              onClick={() => {
                setGameStarted(false)
                setTableNumber("")
                setCurrentPhase(0)
                setCurrentQuestionIndex(0)
                setShowPhaseComplete(false)
              }}
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-50"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Écran de fin de phase
  if (showPhaseComplete) {
    const phaseScore = tableProgress?.phases?.[currentPhase]?.score || 0
    const isLastPhase = currentPhase === PHASES.length - 1
    
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className={`bg-gradient-to-r ${phase.color} p-8 text-white text-center`}>
            <span className="text-6xl mb-4 block">{phase.icon}</span>
            <h2 className="text-3xl font-bold mb-2">
              {isLastPhase ? 'Félicitations !' : 'Phase terminée !'}
            </h2>
            <p className="text-xl opacity-90">{phase.name}</p>
            <p className="text-2xl font-black opacity-90 mt-2">{tableNumber}</p>
          </div>
          
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <p className="text-5xl font-bold text-purple-600 mb-2">{phaseScore}</p>
              <p className="text-gray-600">points gagnés dans cette phase</p>
            </div>
            
            {/* Résumé des réponses - Masqué jusqu'à la dernière phase */}
            {isLastPhase && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Résumé de vos réponses</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {tableProgress?.phases?.[currentPhase]?.answers?.map((answer, index) => {
                  const questions = getCurrentPhaseQuestions()
                  const question = questions[index]
                  let isCorrect = false
                  
                  if (question.type === 'boolean') {
                    isCorrect = answer === question.answer
                  } else if (question.type === 'multiple') {
                    isCorrect = answer === question.correctAnswer
                  } else if (question.type === 'text' && typeof answer === 'string') {
                    const normalizedAnswer = answer.toLowerCase().trim()
                    const normalizedCorrect = question.correctAnswer!.toLowerCase().trim()
                    isCorrect = normalizedAnswer.includes(normalizedCorrect) || 
                               normalizedCorrect.includes(normalizedAnswer)
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span className="text-sm font-medium">Q{index + 1}</span>
                      <span className="text-lg">
                        {isCorrect ? '✅' : '❌'}
                      </span>
                      <span className="text-xs font-bold">
                        {isCorrect ? `+${question.points}` : '0'}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>Incorrect</span>
                </div>
              </div>
            </div>
            )}
            
            {!isLastPhase && (
              <>
                <div className="mt-6">
                  {isPhaseUnlocked(currentPhase + 2) ? (
                    <Button
                      onClick={goToNextPhase}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      Continuer vers la phase {currentPhase + 2}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Badge className="bg-gray-100 text-gray-600 mb-4">
                        <Lock className="w-4 h-4 mr-2" />
                        Phase {currentPhase + 2} disponible à {PHASES[currentPhase + 1].unlockTime}
                      </Badge>
                      <p className="text-gray-600 mb-4">
                        La prochaine phase n'est pas encore disponible.
                      </p>
                      <Button
                        onClick={() => {
                          setGameStarted(false)
                          setTableNumber("")
                          setCurrentPhase(0)
                          setShowPhaseComplete(false)
                        }}
                        variant="outline"
                        className="border-purple-500 text-purple-500 hover:bg-purple-50"
                      >
                        Retour à l'accueil
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {isLastPhase && (
              <div>
                {/* Résumé complet des 3 phases */}
                <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Résumé complet du jeu
                  </h3>
                  <div className="space-y-4">
                    {PHASES.map((phase, phaseIndex) => {
                      const phaseProgress = tableProgress?.phases[phaseIndex]
                      if (!phaseProgress || phaseProgress.answers.length === 0) return null
                      
                      return (
                        <div key={phase.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{phase.icon}</span>
                              <span className="font-medium">{phase.name}</span>
                            </div>
                            <span className="font-bold text-purple-600">
                              {phaseProgress.score} pts
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                            {phaseProgress.answers.map((answer, index) => {
                              const questions = QUESTIONS.filter(q => q.phase === phase.id)
                              const question = questions[index]
                              let isCorrect = false
                              
                              if (question.type === 'boolean') {
                                isCorrect = answer === question.answer
                              } else if (question.type === 'multiple') {
                                isCorrect = answer === question.correctAnswer
                              } else if (question.type === 'text' && typeof answer === 'string') {
                                const normalizedAnswer = answer.toLowerCase().trim()
                                const normalizedCorrect = question.correctAnswer!.toLowerCase().trim()
                                isCorrect = normalizedAnswer.includes(normalizedCorrect) || 
                                           normalizedCorrect.includes(normalizedAnswer)
                              }
                              
                              return (
                                <div
                                  key={index}
                                  className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${
                                    isCorrect 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-red-100 text-red-600'
                                  }`}
                                  title={`Question ${index + 1}`}
                                >
                                  {index + 1}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-800 mb-2">
                    Score total : {tableProgress?.totalScore} points
                  </p>
                  <p className="text-gray-600">
                    Merci d'avoir participé au grand jeu des mariés !
                  </p>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={async () => {
                      // Réinitialiser la progression pour rejouer
                      const resetProgress: TableProgress = {
                        tableNumber,
                        phases: PHASES.map(phase => ({
                          phase: phase.id,
                          completed: false,
                          score: 0,
                          answers: []
                        })),
                        totalScore: 0,
                        lastActivity: Date.now()
                      }
                      
                      setTableProgress(resetProgress)
                      
                      // Réinitialiser les phases dans la base
                      for (let i = 0; i < 3; i++) {
                        await completePhase(tableNumber, {
                          phase: i + 1,
                          completed: false,
                          score: 0,
                          answers: [],
                          completedAt: null
                        })
                      }
                      setCurrentPhase(0)
                      setCurrentQuestionIndex(0)
                      setShowPhaseComplete(false)
                      setSelectedAnswer(null)
                      setTextAnswer("")
                      setShowResult(false)
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Rejouer
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setGameStarted(false)
                      setTableNumber("")
                      setCurrentPhase(0)
                      setShowPhaseComplete(false)
                      // Effacer les données de localStorage
                      localStorage.removeItem('gameInProgress')
                      localStorage.removeItem('lastSelectedTable')
                    }}
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-50"
                  >
                    Changer de table
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Interface de question
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-2xl border-0 overflow-hidden">
        {/* En-tête avec progression */}
        <div className={`bg-gradient-to-r ${phase.color} p-6 text-white`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm opacity-80">{phase.name}</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-black">{tableNumber}</p>
                <Button
                  onClick={() => {
                    if (confirm("Voulez-vous vraiment changer de table ? Votre progression sera sauvegardée.")) {
                      setGameStarted(false)
                      setTableNumber("")
                      setCurrentPhase(0)
                      setCurrentQuestionIndex(0)
                      setSelectedAnswer(null)
                      setTextAnswer("")
                      setShowResult(false)
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="text-black bg-white/90 border-white hover:bg-white hover:shadow-md transition-all"
                  title="Changer de table"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Changer
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Score actuel</p>
              <p className="text-2xl font-bold">{tableProgress?.phases?.[currentPhase]?.score || 0} pts</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <Progress 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              className="h-2 bg-white/20"
            />
          </div>
        </div>
        
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">{currentQuestion.points} points</span>
            </div>
            
            <h3 className="text-2xl font-medium text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>
            
            {!showResult && (
              <>
                {/* Questions Vrai/Faux */}
                {currentQuestion.type === 'boolean' && (
                  <div className="flex gap-4 justify-center mb-6">
                    <Button
                      onClick={() => setSelectedAnswer(true)}
                      variant={selectedAnswer === true ? "default" : "outline"}
                      className={`px-8 py-4 text-lg ${
                        selectedAnswer === true 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : "border-green-500 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Vrai
                    </Button>
                    <Button
                      onClick={() => setSelectedAnswer(false)}
                      variant={selectedAnswer === false ? "default" : "outline"}
                      className={`px-8 py-4 text-lg ${
                        selectedAnswer === false 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "border-red-500 text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Faux
                    </Button>
                  </div>
                )}
                
                {/* Questions à choix multiples */}
                {currentQuestion.type === 'multiple' && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {currentQuestion.options?.map((option) => (
                      <Button
                        key={option}
                        onClick={() => {
                          console.log("Button clicked:", option)
                          setSelectedAnswer(option)
                          console.log("Selected answer set to:", option)
                        }}
                        variant={selectedAnswer === option ? "default" : "outline"}
                        className={`p-4 h-auto ${
                          selectedAnswer === option 
                            ? "bg-purple-500 hover:bg-purple-600 text-white" 
                            : "hover:bg-purple-50"
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Questions texte */}
                {currentQuestion.type === 'text' && (
                  <div className="max-w-md mx-auto mb-6">
                    <Input
                      type="text"
                      placeholder="Votre réponse..."
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      className="text-center text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && textAnswer.trim()) {
                          handleAnswer()
                        }
                      }}
                    />
                  </div>
                )}
                
                <Button
                  onClick={handleAnswer}
                  disabled={
                    !currentQuestion ||
                    (currentQuestion.type === 'boolean' && selectedAnswer === null) ||
                    (currentQuestion.type === 'multiple' && !selectedAnswer) ||
                    (currentQuestion.type === 'text' && !textAnswer.trim())
                  }
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                >
                  Valider la réponse
                </Button>
              </>
            )}
            
            {/* Résultat */}
            {showResult && (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg ${
                  (currentQuestion.type === 'boolean' && selectedAnswer === currentQuestion.answer) ||
                  (currentQuestion.type === 'multiple' && selectedAnswer === currentQuestion.correctAnswer) ||
                  (currentQuestion.type === 'text' && textAnswer.toLowerCase().includes(currentQuestion.correctAnswer!.toLowerCase()))
                    ? "bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-300"
                    : "bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300"
                }`}>
                  <div className="text-3xl mb-3">
                    {(currentQuestion.type === 'boolean' && selectedAnswer === currentQuestion.answer) ||
                     (currentQuestion.type === 'multiple' && selectedAnswer === currentQuestion.correctAnswer) ||
                     (currentQuestion.type === 'text' && textAnswer.toLowerCase().includes(currentQuestion.correctAnswer!.toLowerCase()))
                      ? "✅ Correct !"
                      : "❌ Pas tout à fait..."}
                  </div>
                  
                  
                  <div className="mt-4 text-2xl font-bold text-purple-600">
                    {(currentQuestion.type === 'boolean' && selectedAnswer === currentQuestion.answer) ||
                     (currentQuestion.type === 'multiple' && selectedAnswer === currentQuestion.correctAnswer) ||
                     (currentQuestion.type === 'text' && textAnswer.toLowerCase().includes(currentQuestion.correctAnswer!.toLowerCase()))
                      ? `+${currentQuestion.points} points !`
                      : "0 point"}
                  </div>
                </div>
                
                <Button
                  onClick={nextQuestion}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                >
                  {currentQuestionIndex < questions.length - 1 
                    ? "Question suivante" 
                    : "Terminer la phase"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
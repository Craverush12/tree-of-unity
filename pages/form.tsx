import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { leavesDB } from '../lib/firebase'
import VirtualKeyboard from '../components/VirtualKeyboard'

export default function Home() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeInput, setActiveInput] = useState<'name' | 'city' | null>(null)
  const router = useRouter()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const citySelectRef = useRef<HTMLSelectElement>(null)

  // Virtual keyboard handlers
  const handleKeyPress = (key: string) => {
    if (activeInput === 'name') {
      setName(prev => prev + key)
    } else if (activeInput === 'city') {
      // For city, we'll simulate typing to filter options
      const currentValue = city
      const newValue = currentValue + key
      setCity(newValue)
    }
  }

  const handleBackspace = () => {
    if (activeInput === 'name') {
      setName(prev => prev.slice(0, -1))
    } else if (activeInput === 'city') {
      setCity(prev => prev.slice(0, -1))
    }
  }

  const handleEnter = () => {
    if (activeInput === 'name' && citySelectRef.current) {
      setActiveInput('city')
      citySelectRef.current.focus()
    } else if (activeInput === 'city') {
      handleSubmit(new Event('submit') as any)
    }
  }

  const handleClear = () => {
    if (activeInput === 'name') {
      setName('')
    } else if (activeInput === 'city') {
      setCity('')
    }
  }

  const handleInputFocus = (inputType: 'name' | 'city') => {
    setActiveInput(inputType)
  }

  const handleInputBlur = () => {
    // Keep keyboard visible even when inputs lose focus
    // setActiveInput(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Generate coordinates using the same logic as tree page
      const leafPositions = [
        {x: 600, y: 250}, {x: 620, y: 280}, {x: 580, y: 300}, {x: 640, y: 320}, {x: 560, y: 350},
        {x: 660, y: 380}, {x: 540, y: 400}, {x: 680, y: 420}, {x: 520, y: 440}, {x: 700, y: 460},
        {x: 450, y: 320}, {x: 420, y: 350}, {x: 480, y: 380}, {x: 390, y: 400}, {x: 510, y: 420},
        {x: 360, y: 440}, {x: 540, y: 460}, {x: 330, y: 480}, {x: 570, y: 500}, {x: 300, y: 520},
        {x: 750, y: 320}, {x: 780, y: 350}, {x: 720, y: 380}, {x: 810, y: 400}, {x: 690, y: 420},
        {x: 840, y: 440}, {x: 660, y: 460}, {x: 870, y: 480}, {x: 630, y: 500}, {x: 900, y: 520},
        {x: 350, y: 220}, {x: 320, y: 250}, {x: 380, y: 280}, {x: 290, y: 300}, {x: 410, y: 320},
        {x: 260, y: 340}, {x: 440, y: 360}, {x: 230, y: 380}, {x: 470, y: 400}, {x: 200, y: 420},
        {x: 850, y: 220}, {x: 880, y: 250}, {x: 820, y: 280}, {x: 910, y: 300}, {x: 790, y: 320},
        {x: 940, y: 340}, {x: 760, y: 360}, {x: 970, y: 380}, {x: 730, y: 400}, {x: 1000, y: 420}
      ]
      
      // Find available coordinates
      let selectedPosition = null
      for (const position of leafPositions) {
        const isAvailable = await leavesDB.checkCoordinates(position.x, position.y)
        if (isAvailable) {
          selectedPosition = position
          break
        }
      }
      
      // Fallback to center if no position found
      if (!selectedPosition) {
        selectedPosition = { x: 600, y: 400 }
      }
      
      // Generate leaf properties
      const leafTemplateId = Math.random() > 0.5 ? "leaf1" : "leaf2"
      const angle = Math.floor(Math.random() * 360)
      const scale = 0.5 + Math.random() * 0.7
      
      // Navigate to success page with user data (leaf will be added there)
      router.push({
        pathname: '/success',
        query: { name, city }
      })
      
    } catch (error) {
      console.error('Error saving leaf:', error)
      alert('Failed to add your leaf. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Tree of Unity</title>
        <meta name="description" content="Add your leaf to the Unity Tree" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
         
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => handleInputFocus('name')}
                  onBlur={handleInputBlur}
                  className={`${styles.input} ${activeInput === 'name' ? styles.activeInput : ''}`}
                  required
                  readOnly
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="city" className={styles.label}>City</label>
                <select
                  ref={citySelectRef}
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onFocus={() => handleInputFocus('city')}
                  onBlur={handleInputBlur}
                  className={`${styles.select} ${activeInput === 'city' ? styles.activeInput : ''}`}
                  required
                >
                  <option value="">Choose your city</option>
                  <option value="Riyadh">Riyadh</option>
                  <option value="Jeddah">Jeddah</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              <span>{isSubmitting ? 'Adding Leaf...' : 'Submit'}</span>
            </button>
          </form>
        </div>
        
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          onClear={handleClear}
          activeInput={activeInput}
        />
      </main>
    </>
  )
}

import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', { name, city })
    // Navigate to success page with user data
    router.push({
      pathname: '/success',
      query: { name, city }
    })
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
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="city" className={styles.label}>City</label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Choose your city</option>
                  <option value="Riyaadh">Riyaadh</option>
                  <option value="Jeddah">Jeddah</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className={styles.submitButton}>
              <span>Submit</span>
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

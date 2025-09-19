import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Confirmation.module.css'

export default function Confirmation() {
  const router = useRouter()
  const { name, city } = router.query

  useEffect(() => {
    // Set a 5-second timer to redirect to welcome screen
    const timer = setTimeout(() => {
      router.push('/welcome')
    }, 5000)

    // Cleanup timer on component unmount
    return () => clearTimeout(timer)
  }, [router])

  const handleReturnHome = () => {
    router.push('/welcome')
  }

  return (
    <>
      <Head>
        <title>Tree of Unity - Confirmation</title>
        <meta name="description" content="Your leaf has been successfully added to the Unity Tree" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.leafContainer}>
            <Image
              src="/addedleaf.svg"
              alt="Added Leaf"
              width={300}
              height={200}
              className={styles.leafImage}
            />
            <span className={styles.nameText}>{name || 'User'}</span>
          </div>
        </div>
      </main>
    </>
  )
}

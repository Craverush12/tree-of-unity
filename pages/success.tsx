import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Success.module.css'

export default function Success() {
  const router = useRouter()
  const { name, city } = router.query

  const handleAddLeaf = () => {
    // Navigate to confirmation page with user data
    router.push({
      pathname: '/confirmation',
      query: { name, city }
    })
  }

  return (
    <>
      <Head>
        <title>Tree of Unity - Success</title>
        <meta name="description" content="Your leaf has been added to the Unity Tree" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.leafContainer}>
            <Image
              src="/leaf.svg"
              alt="Leaf"
              width={300}
              height={200}
              className={styles.leafImage}
            />
            <span className={styles.nameText}>{name || 'User'}</span>
          </div>
          
          <button onClick={handleAddLeaf} className={styles.addLeafButton} />
        </div>
      </main>
    </>
  )
}

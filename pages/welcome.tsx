import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Welcome.module.css'

export default function Welcome() {
  const router = useRouter()

  const handleBegin = () => {
    router.push('/form')
  }

  return (
    <>
      <Head>
        <title>Tree of Unity - Welcome</title>
        <meta name="description" content="Welcome to Tree of Unity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <button onClick={handleBegin} className={styles.beginButton} />
      </main>
    </>
  )
}

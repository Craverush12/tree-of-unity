import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Success.module.css'
import { leavesDB } from '../lib/firebase'

export default function Success() {
  const router = useRouter()
  const { name, city } = router.query

  const handleAddLeaf = async () => {
    try {
      // Generate coordinates using the same logic as tree page - scaled for 2160x3840
      const leafPositions = [
        {x: 1080, y: 450}, {x: 1116, y: 504}, {x: 1044, y: 540}, {x: 1152, y: 576}, {x: 1008, y: 630},
        {x: 1188, y: 684}, {x: 972, y: 720}, {x: 1224, y: 756}, {x: 936, y: 792}, {x: 1260, y: 828},
        {x: 810, y: 576}, {x: 756, y: 630}, {x: 864, y: 684}, {x: 702, y: 720}, {x: 918, y: 756},
        {x: 648, y: 792}, {x: 972, y: 828}, {x: 594, y: 864}, {x: 1026, y: 900}, {x: 540, y: 936},
        {x: 1350, y: 576}, {x: 1404, y: 630}, {x: 1296, y: 684}, {x: 1458, y: 720}, {x: 1242, y: 756},
        {x: 1512, y: 792}, {x: 1188, y: 828}, {x: 1566, y: 864}, {x: 1134, y: 900}, {x: 1620, y: 936},
        {x: 630, y: 396}, {x: 576, y: 450}, {x: 684, y: 504}, {x: 522, y: 540}, {x: 738, y: 576},
        {x: 468, y: 612}, {x: 792, y: 648}, {x: 414, y: 684}, {x: 846, y: 720}, {x: 360, y: 756},
        {x: 1530, y: 396}, {x: 1584, y: 450}, {x: 1476, y: 504}, {x: 1638, y: 540}, {x: 1422, y: 576},
        {x: 1692, y: 612}, {x: 1368, y: 648}, {x: 1746, y: 684}, {x: 1314, y: 720}, {x: 1800, y: 756}
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
      
      // Fallback to center if no position found - scaled for 2160x3840
      if (!selectedPosition) {
        selectedPosition = { x: 1080, y: 720 }
      }
      
      // Generate leaf properties
      const leafTemplateId = Math.random() > 0.5 ? "leaf1" : "leaf2"
      const angle = Math.floor(Math.random() * 360)
      const scale = 0.5 + Math.random() * 0.7
      
      // Save to database
      const leafData = {
        name,
        city,
        x: selectedPosition.x,
        y: selectedPosition.y,
        angle,
        scale,
        leaf_type: leafTemplateId
      }
      
      await leavesDB.addLeaf(leafData)
      
      // Navigate to confirmation page with user data
      router.push({
        pathname: '/confirmation',
        query: { name, city }
      })
      
    } catch (error) {
      console.error('Error adding leaf:', error)
      alert('Failed to add your leaf. Please try again.')
    }
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

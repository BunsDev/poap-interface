import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <div className={styles.home}>
      <img className={styles.bg_desktop} src="./hero_desktop_bg.png" alt="" />
      <img className={styles.bg_mobile} src="./hero_mobile_bg.png" alt="" />
      <img className={styles.logo} src="/logo.svg" alt="" />
      <h1>Henlo Attendendee!</h1>
      <img className={styles.ticket_desktop} src="/ticket.png" alt="" />
      <img className={styles.ticket_mobile} src="/ticket_mobile.png" alt="" />
      <h2>Get a chance to mint this Proof of Attendence NFT</h2>
      <h3>Click on the button below to Mint this NFT for free and get it in your wallet.</h3>

      <div className={styles.stylized_btn}>
        <button>
          Mint NFT
        </button>
      </div>

      <h4>Don’t have a crypto wallet? <span className={styles.txGrad}>Let’s make one!</span></h4>
    </div>
  )
}

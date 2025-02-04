import { GetStaticProps, type NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Image from 'next/image'
import { useMemo } from 'react'
import { Release, getAssetsFromNeuronRelease, getLatestRelease } from '../../utils'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import ImgNeuronLogo from './neuron-logo.png'
import ImgDownloadWallet from './download-wallet.png'
import { Assets } from './Assets'
import { useIsMobile } from '../../hooks'

interface PageProps {
  release: Release
}

const Download: NextPage<PageProps> = ({ release }) => {
  const { t } = useTranslation('download')
  const isMobile = useIsMobile()

  const assets = useMemo(() => getAssetsFromNeuronRelease(release), [release])

  return (
    <Page className={styles.page}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.neuron}>
            <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
            <span className={styles.name}>Neuron</span>
          </div>

          <div className={styles.text1}>{t('Download Neuron')}</div>

          {!isMobile && (
            <div className={styles.version}>
              {t('Current Version')} {release.tag_name}
            </div>
          )}
        </div>

        <div className={styles.right}>
          <Image className={styles.imgDownload} src={ImgDownloadWallet} alt="Help" width={200} height={168} />
        </div>
      </div>

      {isMobile && (
        <div className={styles.version}>
          {t('Current Version')} {release.tag_name}
        </div>
      )}

      <Assets className={styles.assets} assets={assets} />
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  const release = await getLatestRelease()
  const lng = await serverSideTranslations(locale, ['common', 'download'])

  const props: PageProps = {
    release,
    ...lng,
  }

  return { props }
}

export default Download

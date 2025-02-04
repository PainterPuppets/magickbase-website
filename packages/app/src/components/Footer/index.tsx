import { ComponentProps, FC } from 'react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import styles from './index.module.scss'
import IconFullLogo from './full-logo.svg'
import { Contacts } from '../Contacts'
import { useIsMobile } from '../../hooks'
import { LinkWithEffect } from '../UpsideDownEffect'
import { api } from '../../utils'

export type FooterProps = ComponentProps<'div'>

export const Footer: FC<FooterProps> = props => {
  const { t } = useTranslation('common')
  const isMobile = useIsMobile()

  const aggregateStateQuery = api.uptime.aggregateState.useQuery()
  const serviceStateText =
    aggregateStateQuery.data === 'operational'
      ? t('All services are online')
      : aggregateStateQuery.data === 'downtime' || aggregateStateQuery.data === 'degraded'
      ? t('Some services are offline')
      : t('Services status loading...')

  return (
    <div {...props} className={clsx(styles.footer, props.className)}>
      <div className={styles.content}>
        <div className={styles.left}>
          <IconFullLogo />

          <div
            className={clsx(styles.serversState, {
              [styles.warnning ?? '']:
                aggregateStateQuery.data === 'downtime' || aggregateStateQuery.data === 'degraded',
            })}
          >
            <div className={styles.dot} />
            {serviceStateText}
          </div>

          <Contacts className={styles.contacts} />

          {!isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>

        <div className={styles.right}>
          <div className={styles.linkList}>
            <div className={styles.title}>{t('Services')}</div>
            <div className={styles.linksContainer}>
              <LinkWithEffect href="https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron">
                {t('Neuron Wallet')}
              </LinkWithEffect>
              <LinkWithEffect href="https://explorer.nervos.org/">{t('CKB Explorer')}</LinkWithEffect>
              <LinkWithEffect href="https://v1.gwscan.com/">{t('Godwoke Explorer')}</LinkWithEffect>
              <LinkWithEffect href="https://github.com/Magickbase/blockscan">{t('Axon Explorer')}</LinkWithEffect>
              <LinkWithEffect href="https://github.com/ckb-js/kuai">{t('Kuai')}</LinkWithEffect>
              <LinkWithEffect href="https://github.com/nervosnetwork/ckb/wiki/Public-JSON-RPC-nodes">
                {t('Public Node')}
              </LinkWithEffect>
            </div>
          </div>

          <div className={styles.linkList}>
            <div className={styles.title}>{t('Foundation')}</div>
            <div className={styles.linksContainer}>
              <LinkWithEffect href="https://www.nervos.org/">{t('Nervos')}</LinkWithEffect>
            </div>
          </div>

          {isMobile && <div className={styles.copyright}>{t('Copyright © 2023 Magickbase All Rights Reserved.')}</div>}
        </div>
      </div>
    </div>
  )
}

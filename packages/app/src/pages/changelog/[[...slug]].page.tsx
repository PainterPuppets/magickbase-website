import { GetStaticPaths, GetStaticProps, type NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { Fragment, useCallback } from 'react'
import { Release, getReleases, range } from '../../utils'
import { Page } from '../../components/Page'
import styles from './index.module.scss'
import ImgNeuronLogo from './neuron-logo.png'
import { useMarkdownProps } from '../../hooks'
import IconTop from './top.svg'
import IconMore from './more.svg'
import { LinkWithEffect } from '../../components/UpsideDownEffect'

const RELEASES_PER_PAGE = 2

interface PageProps {
  releases: Release[]
  page: number
  maxPage: number
}

const Changelog: NextPage<PageProps> = ({ releases, page, maxPage }) => {
  const { t } = useTranslation('changelog')

  const mdProps = useMarkdownProps({ supportToc: false, imgClass: styles.img })

  const gotoTop = useCallback(() => scrollTo({ top: 0, behavior: 'smooth' }), [])

  return (
    <Page className={styles.page} contentWrapper={{ className: styles.contentWrapper }}>
      <div className={styles.top}>
        <div className={styles.neuron}>
          <Image src={ImgNeuronLogo} alt="Neuron Logo" width={44} height={44} />
          <span className={styles.name}>Neuron</span>
        </div>

        <div className={styles.text1}>{t('Changelog')}</div>

        <div className={styles.text2}>
          <Trans
            ns="changelog"
            i18nKey="Neuron wallet new features and updates summary, join <link1>Github</link1> to learn more about the project progress."
            components={{
              link1: (
                <LinkWithEffect
                  href="https://github.com/nervosnetwork/neuron"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          />
        </div>
      </div>

      <div className={styles.releases}>
        {/* TODO: If we were to manually parse the required content from the release here, it would be too complex and not robust,
        so let's implement a simple solution for now and have the neuron team provide a file specifically for reading later. */}
        {releases.map((release, idx) => (
          <Fragment key={release.id}>
            <div className={styles.left}>
              {`${release.tag_name.replace('v', '')} (${release.published_at?.split('T')[0] ?? ''})`}
            </div>
            <div className={styles.right}>
              <ReactMarkdown {...mdProps}>{release.body?.replace(/^#[^#]*?\(.*?\)\s+/, '') ?? ''}</ReactMarkdown>

              {idx === releases.length - 1 && (
                <div className={styles.pagination}>
                  <IconTop className={styles.gotoTop} onClick={gotoTop} />

                  <div className={styles.pagingActions}>
                    {page > 1 ? (
                      <Link className={styles.pagingAction} href={`/changelog/${page - 1}`}>
                        <IconMore />
                      </Link>
                    ) : (
                      <div className={clsx(styles.pagingAction, styles.disabled)}>
                        <IconMore />
                      </div>
                    )}

                    <div className={styles.dividing} />

                    {page < maxPage ? (
                      <Link className={styles.pagingAction} href={`/changelog/${page + 1}`}>
                        <IconMore className={styles.next} />
                      </Link>
                    ) : (
                      <div className={clsx(styles.pagingAction, styles.disabled)}>
                        <IconMore className={styles.next} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ))}
      </div>
    </Page>
  )
}

export const getStaticProps: GetStaticProps<PageProps, { slug?: string[] }> = async ({ locale = 'en', params }) => {
  const [pageStr] = params?.slug ?? []
  const page = Number(pageStr ?? '1')
  const releases = await getReleases()
  const maxPage = Math.ceil(releases.length / RELEASES_PER_PAGE)
  const lng = await serverSideTranslations(locale, ['common', 'changelog'])

  const props: PageProps = {
    releases: releases.slice((page - 1) * RELEASES_PER_PAGE, page * RELEASES_PER_PAGE),
    page,
    maxPage,
    ...lng,
  }

  return { props }
}

export const getStaticPaths: GetStaticPaths<{ slug?: string[] }> = async ({ locales }) => {
  const releases = await getReleases()
  const maxPage = Math.ceil(releases.length / RELEASES_PER_PAGE)
  const pageParams = range(1, maxPage + 1)
    .map<{ slug?: string[] }>(n => ({ slug: [n.toString()] }))
    .concat({ slug: [] })

  return {
    paths: (locales ?? ['en']).map(locale => pageParams.map(params => ({ params, locale }))).flat(),
    fallback: false,
  }
}

export default Changelog

import { ActionIcon, Box } from '@mantine/core'
import { useIntersection, useMediaQuery } from '@mantine/hooks'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import type { Position } from '../Resume'
import { SiteIcon } from './SiteIcon'

import styles from './ProjectPreview.module.css'

const visibilityThreshold = 0.4
const visibilityThresholds = [0, visibilityThreshold]

export type ProjectPreviewProps = {
  readonly preview: NonNullable<Position['preview']>
  readonly title: string
}

export function ProjectPreview({ preview, title }: ProjectPreviewProps) {
  const player = useRef<HTMLVideoElement>(null)
  const { ref, entry } = useIntersection<HTMLDivElement>({ threshold: visibilityThresholds })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true)
  const [playbackPreference, setPlaybackPreference] = useState<boolean>()
  const [playing, setPlaying] = useState(false)
  const visible = (entry?.intersectionRatio ?? 0) >= visibilityThreshold
  const shouldPlay =
    playbackPreference === true
      ? entry?.isIntersecting === true
      : playbackPreference !== false && !reducedMotion && visible

  useEffect(() => {
    const video = player.current
    if (!video) return

    if (shouldPlay) {
      // Some browsers block autoplay even when muted. The play control remains available.
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [shouldPlay])

  const togglePlayback = () => {
    const video = player.current
    if (!video) return

    setPlaybackPreference(!playing)
    if (playing) video.pause()
    else void video.play().catch(() => undefined)
  }

  return (
    <Box ref={ref} className={styles['preview']}>
      <Box
        component="video"
        ref={player}
        src={preview.src}
        poster={preview.poster}
        width={preview.width}
        height={preview.height}
        aria-label={`${title} gameplay preview`}
        className={styles['video']}
        preload="none"
        muted
        playsInline
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <ActionIcon
        type="button"
        variant="default"
        className={styles['playback-control']}
        size="lg"
        aria-label={`${playing ? 'Pause' : 'Play'} ${title} preview`}
        onClick={togglePlayback}
      >
        <SiteIcon icon={playing ? IconPlayerPause : IconPlayerPlay} />
      </ActionIcon>
    </Box>
  )
}

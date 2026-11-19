import { ActionIcon, Anchor, Box } from '@mantine/core'
import { useIntersection, useMediaQuery } from '@mantine/hooks'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import type { Position } from '../Resume'
import { SiteIcon } from './SiteIcon'

import styles from './ProjectPreview.module.css'

export type ProjectPreviewProps = {
  readonly href: string
  readonly preview: NonNullable<Position['preview']>
  readonly title: string
}

export function ProjectPreview({ href, preview, title }: ProjectPreviewProps) {
  const { containerRef, player, playing, onPlay, onPause, togglePlayback } = useProjectPlayback()

  return (
    <Box ref={containerRef} className={styles['preview']}>
      <Anchor href={href} display="block" aria-label={`Open ${title} project`}>
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
          onPlay={onPlay}
          onPause={onPause}
        />
      </Anchor>
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

const visibilityThreshold = 0.4
const visibilityThresholds = [0, visibilityThreshold]

type PlaybackIntent = 'auto' | 'play' | 'pause'

function useProjectPlayback() {
  const player = useRef<HTMLVideoElement>(null)
  const { ref: containerRef, entry } = useIntersection<HTMLDivElement>({
    threshold: visibilityThresholds,
  })
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', true)
  const [intent, setIntent] = useState<PlaybackIntent>('auto')
  const [playing, setPlaying] = useState(false)
  const visible = (entry?.intersectionRatio ?? 0) >= visibilityThreshold
  const playByIntent = {
    auto: !reducedMotion && visible,
    play: entry?.isIntersecting === true,
    pause: false,
  } satisfies Record<PlaybackIntent, boolean>
  const shouldPlay = playByIntent[intent]

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

    setIntent(playing ? 'pause' : 'play')
    if (playing) video.pause()
    else void video.play().catch(() => undefined)
  }

  return {
    containerRef,
    player,
    playing,
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    togglePlayback,
  }
}

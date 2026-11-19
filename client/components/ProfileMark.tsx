import { Image } from '@mantine/core'

const PROFILE_MARK_INTRINSIC_SIZE = 160

export type ProfileMarkProps = {
  readonly size: string
}

export function ProfileMark({ size }: ProfileMarkProps) {
  return (
    <Image
      src="./totally-what-i-look-like.png"
      alt=""
      w={size}
      h={size}
      radius="50%"
      width={PROFILE_MARK_INTRINSIC_SIZE}
      height={PROFILE_MARK_INTRINSIC_SIZE}
    />
  )
}

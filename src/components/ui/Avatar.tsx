interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md'
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function hueFromName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 50%, 40%)`
}

export function Avatar({ name, imageUrl, size = 'sm' }: AvatarProps) {
  const dim = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${dim} rounded-full object-cover flex-shrink-0`}
        title={name}
      />
    )
  }

  return (
    <span
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: hueFromName(name) }}
      title={name}
    >
      {initials(name)}
    </span>
  )
}

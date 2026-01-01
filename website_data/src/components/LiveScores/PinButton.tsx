export default function PinButton({
  pinned,
  onClick,
}: {
  pinned?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="text-xl leading-none"
      aria-label={pinned ? "Unpin match" : "Pin match"}
    >
      {pinned ? "★" : "☆"}
    </button>
  )
}

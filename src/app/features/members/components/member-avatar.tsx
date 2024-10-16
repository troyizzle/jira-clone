import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface MemberAvatarProps {
  name: string
  className?: string
  fallbackClassName?: string
}

export const MemberAvatar = ({
  name,
  className,
  fallbackClassName
}: MemberAvatarProps) => {
  return (
    <Avatar className={cn(
      "size-5 rounded-full transition border border-neutral-300",
      className
    )}>
      <AvatarFallback className={cn(
        "bg-neutral-200 text-neutral-500 font-medium flex items-center justify-center",
        fallbackClassName
      )}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

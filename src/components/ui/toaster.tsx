"use client"

import { cn } from "@/lib/utils"
import { useToast, toast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const handleCopy = async (text: React.ReactNode) => {
    if (typeof text === 'string' && text) {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "오류 로그 복사 완료",
          description: "오류 로그가 클립보드에 복사되었습니다.",
        });
      } catch (error) {
        console.warn("Toast clipboard copy failed:", error);
      }
    }
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isDestructive = props.variant === 'destructive';
        const isCopyable = isDestructive && description;

        return (
          <Toast
            key={id}
            {...props}
            onClick={isCopyable ? () => handleCopy(description) : undefined}
            className={cn(isCopyable && "cursor-pointer transition-colors hover:bg-destructive/90")}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
               {isCopyable && (
                <p className="text-xs opacity-70 mt-2">
                  오류 내용을 복사하려면 이 알림을 클릭하세요.
                </p>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

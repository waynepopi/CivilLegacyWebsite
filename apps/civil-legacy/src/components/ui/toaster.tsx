import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  // 3. Outside-Click/Tap: dismiss the popup by tapping anywhere outside of it
  useEffect(() => {
    if (toasts.length === 0) return;

    const handleOutsideInteraction = () => {
      toasts.forEach((t) => dismiss(t.id));
    };

    // Small delay prevents the click that created the toast from immediately dismissing it
    const timerId = setTimeout(() => {
      document.addEventListener("click", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
    }, 100);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("click", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [toasts, dismiss]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastItem
            key={id}
            id={id}
            title={title}
            description={description}
            action={action}
            dismiss={dismiss}
            {...props}
          />
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

function ToastItem({ 
  id, 
  title, 
  description, 
  action, 
  dismiss, 
  ...props 
}: any) {
  // 1 & 4. Auto-Dismiss & Cleanup: explicit timer and cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      dismiss(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, dismiss]);

  return (
    <Toast 
      {...props} 
      // 2. Tap-to-Dismiss directly on it
      onClick={(e) => {
        e.stopPropagation();
        dismiss(id);
      }}
      className="cursor-pointer"
    >
      <div className="grid gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && (
          <ToastDescription>{description}</ToastDescription>
        )}
      </div>
      {action}
      <ToastClose onClick={(e) => {
        e.stopPropagation();
        dismiss(id);
      }} />
    </Toast>
  )
}

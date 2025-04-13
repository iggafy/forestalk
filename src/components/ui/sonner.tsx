
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-forest-dark group-[.toaster]:text-forest-highlight group-[.toaster]:border-forest-medium group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-forest-highlight/80",
          actionButton:
            "group-[.toast]:bg-forest-accent group-[.toast]:text-forest-dark",
          cancelButton:
            "group-[.toast]:bg-forest-medium group-[.toast]:text-forest-highlight",
          success: 
            "group toast group-[.toaster]:bg-forest-dark group-[.toaster]:border-forest-green group-[.toaster]:text-forest-green",
          error:
            "group toast group-[.toaster]:bg-forest-dark group-[.toaster]:border-forest-wave-red group-[.toaster]:text-forest-wave-red",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

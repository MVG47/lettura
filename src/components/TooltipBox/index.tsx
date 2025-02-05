import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

  export const TooltipBox = (props: any) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {props.children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

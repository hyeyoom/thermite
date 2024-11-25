import {Loader2} from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-6 h-6 animate-spin text-primary"/>
        </div>
    )
}

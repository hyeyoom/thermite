import React from 'react'
import {Button} from '@/components/ui/button'
import {Checkbox} from '@/components/ui/checkbox'
import {PlusCircle, X} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Todo} from '@/lib/types'

interface TodoListProps {
    todos: Todo[]
    onAddTodo: (content: string) => void
    onToggleTodo: (todoId: string) => void
    onDeleteTodo: (todoId: string) => void
}

const TodoList = ({
    todos,
    onAddTodo,
    onToggleTodo,
    onDeleteTodo,
}: TodoListProps) => {
    const [isAddingTodo, setIsAddingTodo] = React.useState(false)
    const [newTodoContent, setNewTodoContent] = React.useState('')

    const handleAddTodo = () => {
        if (newTodoContent.trim()) {
            onAddTodo(newTodoContent)
            setNewTodoContent('')
            setIsAddingTodo(false)
        }
    }

    return (
        <div className="flex-1 min-w-0">
            <div className="space-y-2">
                {todos.map((todo) => (
                    <div key={todo.id} className="group flex items-center gap-2">
                        <div
                            className="flex items-center gap-2 flex-1 min-w-0"
                            onClick={() => onToggleTodo(todo.id)}
                        >
                            <Checkbox
                                checked={todo.isCompleted}
                                onCheckedChange={() => onToggleTodo(todo.id)}
                                className="h-5 w-5 lg:h-4 lg:w-4"
                            />
                            <span
                                className={cn(
                                    "flex-1 min-w-0 truncate py-1",
                                    todo.isCompleted && "line-through text-muted-foreground"
                                )}
                            >
                                {todo.content}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-none"
                            onClick={() => onDeleteTodo(todo.id)}
                        >
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                        </Button>
                    </div>
                ))}

                {isAddingTodo ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newTodoContent}
                            onChange={(e) => setNewTodoContent(e.target.value)}
                            className="flex-1 text-sm px-2 py-1 border-b-2 border-input focus:outline-none focus:border-foreground transition-colors"
                            placeholder="할 일을 입력하세요"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTodo()
                                }
                            }}
                            autoFocus
                        />
                        <Button size="sm" onClick={handleAddTodo}>추가</Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsAddingTodo(false)
                                setNewTodoContent('')
                            }}
                        >
                            취소
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingTodo(true)}
                        disabled={todos.length >= 6}
                        className="w-full justify-start"
                    >
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        할 일 추가 ({todos.length}/6)
                    </Button>
                )}
            </div>
        </div>
    )
}

export default TodoList 
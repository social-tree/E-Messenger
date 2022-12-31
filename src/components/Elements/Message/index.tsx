import { MessageType } from '@/types/messeges'
import TrashIcon from '@/assets/icons/TrashIcon'
import UserContext from '@/context/UserContext'
import { deleteMessage } from '@/hooks/useStore'
import { useContext } from 'react'

interface Props {
  message: MessageType
}

const Message = ({ message }: Props) => {
  const { user, userRoles } = useContext(UserContext)

  return (
    <div className="py-1 flex items-center space-x-2">
      <div className="text-gray-100 w-4">
        {(user?.id === message.user_id ||
          userRoles?.some((role) => ['admin', 'moderator'].includes(role))) && (
          <button onClick={() => deleteMessage(`${message.id}`)}>
            <TrashIcon />
          </button>
        )}
      </div>
      <div>
        <p className="text-blue-700 font-bold">{message.author?.username}</p>
        <p className="text-white">{message.message}</p>
      </div>
    </div>
  )
}

export default Message
